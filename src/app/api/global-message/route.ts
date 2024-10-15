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
  const startTime = Date.now();
  console.log(`[${startTime}] Starting global message processing`);

  try {
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      console.log(`[${Date.now()}] Unauthorized access attempt`);
      return new NextResponse("Uautoriseret.", { status: 401 });
    }

    const userFiles = await db.file.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    console.log(`[${Date.now()}] User files retrieved: ${userFiles.length}`);

    if (userFiles.length === 0) {
      return new NextResponse("Ingen dokumenter fundet for brugeren.", { status: 404 });
    }

    const { message } = body;
    
    if (!message) {
      return new NextResponse("Besked er påkrævet.", { status: 400 });
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const pinecone = getPineconeClient();
    const pineconeIndex = pinecone.Index("lingvist");

    let allResults = [];
    for (const file of userFiles) {
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: file.id,
      });

      const results = await vectorStore.similaritySearch(message, 5);
      results.forEach(result => {
        result.metadata.fileName = file.name;
      });
      allResults.push(...results);
    }

    console.log(`[${Date.now()}] Similarity search completed. Results: ${allResults.length}`);

    const topResults = allResults.slice(0, 20);
    const initialResults = topResults.map(result => ({
      text: result.pageContent,
      id: result.metadata.fileId?.toString() || 'N/A',
      title: result.metadata.fileName || 'Ukendt titel'
    }));

    if (initialResults.length === 0) {
      return new NextResponse("Ingen relevante dokumenter fundet.", { status: 404 });
    }

    const rerankedResults = await cohere.rerank({
      documents: initialResults,
      query: message,
      topN: Math.min(4, initialResults.length),
      model: 'rerank-multilingual-v3.0',
      returnDocuments: true
    });

    console.log(`[${Date.now()}] Reranking completed. Results: ${rerankedResults.results.length}`);

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

    const formattedResults = structuredResults.map((result, index) => {
      return `Resultat ${index + 1}:\n- Titel: ${result.title}\n- Relevans: ${result.relevance}\n`;
    }).join("\n");

    const { textStream, fullStream } = await streamText({
      model: openai('gpt-4o-mini'),
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `Du er en hjælpsom assistent specialiseret i at analysere og besvare spørgsmål om dokumenter. Din opgave er at præsentere de givne strukturerede resultater i det nøjagtige format, der er angivet, uden yderligere kommentarer eller ændringer. Brug asterisker for formatering: *kursiv* for kursiv tekst og **fed** for fed tekst.`,
        },
        {
          role: "user",
          content: `Præsenter følgende strukturerede resultater med passende formatering (kursiv for titler, fed for vigtige punkter):

${formattedResults}

Brug derefter disse resultater til at give et kort, velformuleret svar på brugerens forespørgsel: "${message}"`,
        },
      ],
    });

    console.log(`[${Date.now()}] Stream generation completed. Sending response.`);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const timeout = setTimeout(() => {
          controller.error(new Error("Stream timed out"));
        }, 60000); // 60 second timeout

        try {
          for await (const chunk of textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          clearTimeout(timeout);
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error(`[${Date.now()}] Error in global message route:`, error);
    return new NextResponse("Der opstod en fejl under behandlingen af din anmodning.", { status: 500 });
  } finally {
    console.log(`[${Date.now()}] Global message processing completed. Total time: ${Date.now() - startTime}ms`);
  }
}

// Define the structure for document type used in reranking
type DocumentType = {
  text: string;
  id: string;
  title: string;
};
