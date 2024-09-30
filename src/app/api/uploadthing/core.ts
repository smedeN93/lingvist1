import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { File } from "@prisma/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

// Create an instance of the uploadthing library
const f = createUploadthing();

// Middleware to authenticate user and get subscription plan
const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new UploadThingError("Unauthorized.");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};

// Function to handle the upload completion
const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  let createdFile: File | null;

  // Check if the file already exists in the database
  createdFile = await db.file.findUnique({
    where: {
      key: file.key,
      userId: metadata.userId,
    },
  });

  // If the file doesn't exist, create a new entry in the database
  if (!createdFile) {
    createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://utfs.io/f/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });
  }

  try {
    // Fetch the PDF file
    const response = await fetch(createdFile.url);
    const blob = await response.blob();

    // Load PDF into memory
    const loader = new PDFLoader(blob);

    // Extract PDF page level text
    const pageLevelDocs = await loader.load();

    // Get the number of pages in the PDF
    const pageAmt = pageLevelDocs.length;
    const { subscriptionPlan, userId } = metadata;
    const { isSubscribed } = subscriptionPlan;

    // Check if the number of pages exceeds the plan limits
    const isProExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pageAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    // If the page limit is exceeded, mark the upload as failed
    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createdFile.id,
          userId,
        },
      });
      return;
    }

    // Initialize Pinecone client and index
    const pinecone = getPineconeClient();
    const pineconeIndex = pinecone.Index("lingvist");

    // Create OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    // Add page numbers to metadata for each document
    const docsWithPageNumbers = pageLevelDocs.map((doc, i) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        page: i + 1,
      },
    }));

    // Store documents in Pinecone with embeddings
    await PineconeStore.fromDocuments(docsWithPageNumbers, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    // Update the file status to SUCCESS in the database
    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
    });
  } catch (error) {
    console.error("File processing failed:", error);
    // If an error occurs, update the file status to FAILED
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
    });
  }
};

// Define the file router with different upload configurations for free and pro plans
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
