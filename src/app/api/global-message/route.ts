import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { streamText, generateObject } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { CohereClient } from 'cohere-ai';
import { z } from 'zod';

import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { db } from "@/db";

// Initialize Cohere client for reranking
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

// Define the schema for our structured data
const resultSchema = z.object({
  relevance: z.string().describe("En kort forklaring på, hvorfor dette resultat er relevant for forespørgslen")
});

export async function POST(req: NextRequest) {
  try {
    // Handle POST request for processing user messages
    const body = await req.json();

    // Authenticate user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) return new NextResponse("Uautoriseret.", { status: 401 });

    // Fetch all file IDs and names for the user from the database
    const userFiles = await db.file.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const fileMap = new Map(userFiles.map(file => [file.id, file.name]));

    console.log("Brugerens filer:", userFiles);

    if (userFiles.length === 0) {
      return new NextResponse("Ingen dokumenter fundet for brugeren.", { status: 404 });
    }

    // Extract message data
    const { message } = body;
    
    if (!message) {
      return new NextResponse("Besked er påkrævet.", { status: 400 });
    }

    // Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    // Set up Pinecone vector store
    const pinecone = getPineconeClient();
    const pineconeIndex = pinecone.Index("lingvist");

    // Perform similarity search across all user's files
    let allResults = [];
    for (const file of userFiles) {
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: file.id,
      });

      const results = await vectorStore.similaritySearch(message, 5);  // Adjust the number as needed
      results.forEach(result => {
        result.metadata.fileName = file.name;  // Add file name to metadata
      });
      allResults.push(...results);
    }

    console.log("Samlede resultater fra lighedssøgning:", allResults.length);

    // Take top 20 results without sorting
    const topResults = allResults.slice(0, 20);

    // Format initial results for reranking
    const initialResults = topResults.map(result => ({
      text: result.pageContent,
      id: result.metadata.fileId?.toString() || 'N/A',
      title: result.metadata.fileName || 'Ukendt titel'
    }));

    console.log("Indledende resultater til omrangering:", initialResults.length);

    if (initialResults.length === 0) {
      return new NextResponse("Ingen relevante dokumenter fundet.", { status: 404 });
    }

    // Perform reranking using Cohere
    const rerankedResults = await cohere.rerank({
      documents: initialResults,
      query: message,
      topN: Math.min(4, initialResults.length),
      model: 'rerank-multilingual-v3.0',
      returnDocuments: true
    });

    console.log("Omrangerede resultater:", rerankedResults.results.length);

    // Generate structured data for each reranked result
    const structuredResults = await Promise.all(rerankedResults.results.map(async (result, index) => {
      const document = (result.document as DocumentType) || { text: 'Ingen tekst tilgængelig', id: 'N/A', title: 'Ukendt titel' };
      
      const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: resultSchema,
        prompt: `Generer et struktureret resultat for følgende indhold, under hensyntagen til dets relevans for forespørgslen: "${message}"\n\nIndhold: ${document.text}`,
      });

      return {
        ...object,
        documentId: document.id,
        title: document.title
      };
    }));

    // Format structured results
    const formattedResults = structuredResults.map((result, index) => {
      return `Resultat ${index + 1}:\n- Titel: ${result.title}\n- Relevans: ${result.relevance}\n`;
    }).join("\n");

    // Generate OpenAI chat completion using streamText
    const { textStream, fullStream } = await streamText({
      model: openai('gpt-4o-mini'),
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            `Du er en hjælpsom assistent specialiseret i at analysere og besvare spørgsmål om dokumenter. Din opgave er at præsentere de givne strukturerede resultater i det nøjagtige format, der er angivet, uden yderligere kommentarer eller ændringer. Brug asterisker for formatering: *kursiv* for kursiv tekst og **fed** for fed tekst.`,
        },
        {
          role: "user",
          content: `Præsenter følgende strukturerede resultater med passende formatering (kursiv for titler, fed for vigtige punkter):

${formattedResults}

Brug derefter disse resultater til at give et kort, velformuleret svar på brugerens forespørgsel: "${message}"`,
        },
      ],
    });

    // Return the streaming response
    return new Response(textStream);
  } catch (error) {
    console.error("Fejl i global message route:", error);
    return new NextResponse("Der opstod en fejl under behandlingen af din anmodning.", { status: 500 });
  }
}

// Define the structure for document type used in reranking
type DocumentType = {
  text: string;
  id: string;
  title: string;
};
