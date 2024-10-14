import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { streamText } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { CohereClient } from 'cohere-ai';

import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { db } from "@/db";  // Import the database client

// Initialize Cohere client for reranking
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Handle POST request for processing user messages
    const body = await req.json();

    // Authenticate user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) return new NextResponse("Unauthorized.", { status: 401 });

    // Fetch all file IDs for the user from the database
    const userFiles = await db.file.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    const fileIds = userFiles.map(file => file.id);

    console.log("User file IDs:", fileIds);

    if (fileIds.length === 0) {
      return new NextResponse("No documents found for the user.", { status: 404 });
    }

    // Extract message data
    const { message } = body;
    
    if (!message) {
      return new NextResponse("Message is required.", { status: 400 });
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
    for (const fileId of fileIds) {
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: fileId,
      });

      const results = await vectorStore.similaritySearch(message, 5);  // Adjust the number as needed
      allResults.push(...results);
    }

    console.log("Total similarity search results:", allResults.length);

    // Take top 20 results without sorting
    const topResults = allResults.slice(0, 20);

    // Format initial results for reranking
    const initialResults = topResults.map(result => ({
      text: result.pageContent,
      id: result.metadata.fileId?.toString() || 'N/A'
    }));

    console.log("Initial results for reranking:", initialResults.length);

    if (initialResults.length === 0) {
      return new NextResponse("No relevant documents found.", { status: 404 });
    }

    // Perform reranking using Cohere
    const rerankedResults = await cohere.rerank({
      documents: initialResults,
      query: message,
      topN: Math.min(4, initialResults.length),
      model: 'rerank-multilingual-v3.0',
      returnDocuments: true
    });

    console.log("Reranked results:", rerankedResults.results.length);

    // Format reranked results with citations
    const contextWithCitations = rerankedResults.results.map((result, index) => {
      const document = (result.document as DocumentType) || { text: 'Ingen tekst tilgængelig', id: 'N/A' };
      return `[${index + 1}] ${document.text}\n(Dokument ID: ${document.id})`;
    }).join("\n\n");

    // Generate OpenAI chat completion using streamText
    const { textStream, fullStream } = await streamText({
      model: openai('gpt-4o-mini'),
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            `Du er en hjælpsom assistent specialiseret i at analysere og besvare spørgsmål om dokumenter. Basér dit svar på den givne kontekst, som er relevante tekster fra brugerens dokumenter. Strukturér dit svar klart og logisk, og brug overskrifter hvor det er relevant.
            Du skal inkludere in-text citationer for hver specifik reference i dit svar ved at bruge tal i firkantede parenteser, f.eks. [1], [2], osv. Dette hjælper brugeren med at finde informationen i originaldokumentet.
            Efter dit svar skal du inkludere en sektion med citationsdetaljer i følgende format:
            ---CITATIONS---
            [1]: (Dokument ID: {id}) {first 100 characters of the citation...}
            [2]: (Dokument ID: {id}) {first 100 characters of the citation...}
            ...
            ---END CITATIONS---`,
        },
        {
          role: "user",
          content: `Besvar følgende spørgsmål baseret på den givne kontekst.
        
  \n----------------\n
  
  KONTEKST:
  ${contextWithCitations}
  
  BRUGERENS SPØRGSMÅL: ${message}`,
        },
      ],
    });

    // Return the streaming response
    return new Response(textStream);
  } catch (error) {
    console.error("Error in global message route:", error);
    return new NextResponse("An error occurred while processing your request.", { status: 500 });
  }
}

// Define the structure for document type used in reranking
type DocumentType = {
  text: string;
  id: string;
};