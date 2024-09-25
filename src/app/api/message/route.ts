import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { CohereClient } from 'cohere-ai';

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";

// Initialize Cohere client for reranking
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Handle POST request for processing user messages
  const body = await req.json();

  // Authenticate user
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new NextResponse("Unauthorized.", { status: 401 });

  const { id: userId } = user;

  // Validate and extract message data
  const { 
    fileId, 
    message, 
    kontraktvilkaar,
    okonomi,
    metode,
    risici 
  } = sendMessageValidator.parse(body);
  
  // Retrieve file associated with the message
  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new NextResponse("Not Found.", { status: 404 });

  // Store user message in the database
  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // Initialize OpenAI embeddings
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  // Set up Pinecone vector store
  const pinecone = getPineconeClient();
  const pineconeIndex = pinecone.Index("lingvist");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: fileId,
  });

  // Perform similarity search on the user's message
  const results = await vectorStore.similaritySearch(message, 20);

  // Format initial results for reranking
  const initialResults = results.map(result => ({
    text: result.pageContent,
    id: result.metadata.page?.toString() || 'N/A'
  }));

  // Perform reranking using Cohere
  const rerankedResults = await cohere.rerank({
    documents: initialResults,
    query: message,
    topN: 4,
    model: 'rerank-multilingual-v3.0',
    returnDocuments: true
  });

  // Format reranked results with citations
  const contextWithCitations = rerankedResults.results.map((result, index) => {
    const document = (result.document as DocumentType) || { text: 'Ingen tekst tilgængelig', id: 'N/A' };
    return `[${index + 1}] ${document.text}\n(Side: ${document.id})`;
  }).join("\n\n");

  // Retrieve previous messages for context
  const prevMessages = await db.message.findMany({
    where: {
      fileId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6, // display last 6 messages
  });

  // Format previous messages for OpenAI API
  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  // Generate OpenAI chat completion
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          `Du er en hjælpsom assistent specialiseret i at analysere og besvare spørgsmål om dokumenter. Basér dit svar på den givne kontekst, som er relevante tekster fra dokumentet, som brugerens spørgsmål drejer sig. Den tidligere samtale er inkluderet for forståelse af samtale. Strukturér dit svar klart og logisk, og brug overskrifter hvor det er relevant.
          ${kontraktvilkaar ? "Læg derudover særlig vægt på at analysere kontraktvilkår. Fremhæv vigtige klausuler, potentielle faldgruber og juridiske implikationer." : ""}
          ${okonomi ? "Læg derudover særlig vægt på at analysere de økonomiske aspekter nævnt i teksten. Inkluder finansielle prognoser, risici og potentielle muligheder hvor relevant." : ""}
          ${metode ? "Gennemgå derudover den metodologi, der er anvendt eller nævnt i teksten. Vurder dens styrker, svagheder og potentielle bias." : ""}
          ${risici ? "Identificer og diskuter derudover potentielle risici, der er nævnt eller antydet i teksten. Vurder sandsynligheden og konsekvenserne af hver risiko." : ""}
          Du skal inkludere in-text citationer for hver specifik reference i dit svar ved at bruge tal i firkantede parenteser, f.eks. [1], [2], osv. Dette hjælper brugeren med at finde informationen i originaldokumentet.
          Efter dit svar skal du inkludere en sektion med citationsdetaljer i følgende format:
          ---CITATIONS---
          [1]: (Side: {side}) {first 100 characters of the citation...}
          [2]: (Side: {side}) {first 100 characters of the citation...}
          ...
          ---END CITATIONS---`,
      },
      {
        role: "user",
        content: `Besvar følgende spørgsmål baseret på den givne kontekst og tidligere samtale.
        
  \n----------------\n
  
  TIDLIGERE BESKEDER:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  KONTEKST:
  ${contextWithCitations}
  
  BRUGERENS SPØRGSMÅL: ${message}`,
      },
    ],
  });

  // Stream the OpenAI response
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      console.log("OpenAI completion:", completion);
      // Store the AI response in the database
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });

  // Return the streaming response
  return new StreamingTextResponse(stream);
}

// Define the structure for document type used in reranking
type DocumentType = {
  text: string;
  id: string;
};