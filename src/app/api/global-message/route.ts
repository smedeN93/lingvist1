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
import { sendMessageValidator } from "@/lib/validators/send-message-validator";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

// Define the schema for our structured data
const resultSchema = z.object({
  relevance: z.string().describe("En kort forklaring på, hvorfor dette resultat er relevant for forespørgslen"),
});

// Modify the POST method to stream status updates
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[${startTime}] Starting global message processing`);

  try {
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      console.log(`[${Date.now()}] Unauthorized access attempt`);
      return new NextResponse("Du skal være logget ind for at sende en besked.", { status: 401 });
    }

    // Validate the message using the sendMessageValidator
    const validationResult = sendMessageValidator.safeParse(body);
    if (!validationResult.success) {
      console.log(`[${Date.now()}] Invalid message format`);
      const errorMessage = validationResult.error.issues.map(issue => issue.message).join(', ');
      return new NextResponse(`Der opstod en fejl med din besked: ${errorMessage}`, { status: 400 });
    }

    const { message } = validationResult.data;

    const encoder = new TextEncoder();

    // Create a ReadableStream to stream status updates and the assistant's response
    const stream = new ReadableStream({
      async start(controller) {
        const enqueueStatus = (message: string) => {
          controller.enqueue(encoder.encode(`status: ${message}\n`));
        };
        const enqueueText = (text: string) => {
          controller.enqueue(encoder.encode(text));
        };

        enqueueStatus('Gennemgår alle dine filer...');

        console.log(`[${Date.now()}] User authenticated: ${user.id}`);

        const userFiles = await db.file.findMany({
          where: { userId: user.id },
          select: { id: true, name: true },
        });

        console.log(`[${Date.now()}] User files retrieved: ${userFiles.length}`);

        if (userFiles.length === 0) {
          controller.enqueue(encoder.encode("Ingen dokumenter fundet for brugeren."));
          controller.close();
          return;
        }

        console.log(`[${Date.now()}] Processing message: ${message}`);
        enqueueStatus('Finder relevante afsnit...');

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        const pinecone = getPineconeClient();
        const pineconeIndex = pinecone.Index("lingvist");

        let allResults = [];
        for (const file of userFiles) {
          console.log(`[${Date.now()}] Processing file: ${file.name}`);
          enqueueStatus(`Processing file: ${file.name}`);

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
          title: result.metadata.fileName || 'Ukendt titel',
        }));

        if (initialResults.length === 0) {
          controller.enqueue(encoder.encode("Ingen relevante dokumenter fundet."));
          controller.close();
          return;
        }

        console.log(`[${Date.now()}] Starting reranking`);
        enqueueStatus('Sammensætter svar...');

        const rerankedResults = await cohere.rerank({
          documents: initialResults,
          query: message,
          topN: Math.min(4, initialResults.length),
          model: 'rerank-multilingual-v3.0',
          returnDocuments: true,
        });

        console.log(`[${Date.now()}] Reranking completed. Results: ${rerankedResults.results.length}`);

        const structuredResults = await Promise.all(
          rerankedResults.results.map(async (result) => {
            const document = (result.document as DocumentType) || {
              text: 'Ingen tekst tilgængelig',
              id: 'N/A',
              title: 'Ukendt titel',
            };

            console.log(`[${Date.now()}] Generating structured result for document: ${document.title}`);
            enqueueStatus(`Generating structured result for document: ${document.title}`);

            const { object } = await generateObject({
              model: openai('gpt-4o-mini'),
              schema: resultSchema,
              prompt: `Generer et struktureret resultat for følgende indhold, under hensyntagen til dets relevans for forespørgslen: "${message}"\n\nIndhold: ${document.text}`,
            });

            return {
              ...object,
              documentId: document.id,
              title: document.title,
            };
          })
        );

        const formattedResults = structuredResults
          .map((result, index) => {
            return `Resultat ${index + 1}:\n- Titel: ${result.title}\n- Relevans: ${result.relevance}\n`;
          })
          .join("\n");

        console.log(`[${Date.now()}] Starting stream generation`);

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

        // Stream the assistant's response
        for await (const chunk of textStream) {
          enqueueText(chunk);
        }

        controller.close();
        console.log(`[${Date.now()}] Stream closed successfully`);
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error(`[${Date.now()}] Error processing message:`, error);
    return new NextResponse("Der opstod en fejl under behandlingen af din besked. Prøv venligst igen senere.", { status: 500 });
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
