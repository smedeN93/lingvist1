import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new NextResponse("Unauthorized.", { status: 401 });

  const { id: userId } = user;

  const { 
    fileId, 
    message, 
    includePageNumbers,
    argumentAnalysis,
    exploreScenarios,
    kontraktvilkaar,
    okonomi,
    metode,
    risici 
  } = sendMessageValidator.parse(body);
  
  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new NextResponse("Not Found.", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const pinecone = getPineconeClient();
  const pineconeIndex = pinecone.Index("lingvist");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: fileId,
  });

  const results = await vectorStore.similaritySearch(message, 4);

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

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          `Du er en hjælpsom assistent specialiseret i at analysere og besvare spørgsmål om dokumenter. Svar altid i markdown format og vær præcis og koncis. Hvis du er usikker, så sig det ærligt frem for at gætte.
          ${includePageNumbers ? "Inkluder sidetal for hver specifik reference i dit svar. Dette hjælper brugeren med at finde informationen i originaldokumentet." : ""}
          ${argumentAnalysis ? "Inkludér hvor det er nødvendigt en grundig analyse af argumenterne præsenteret i den givne kontekst. Identificer hovedargumenter, understøttende beviser og potentielle svagheder." : ""}
          ${exploreScenarios ? "Inkludér hvor det er brugbart forskellige hypotetiske scenarier baseret på den givne kontekst. Overvej potentielle udfald og konsekvenser af de præsenterede situationer." : ""}
          ${kontraktvilkaar ? "Læg særlig vægt på at analysere kontraktvilkår. Fremhæv vigtige klausuler, potentielle faldgruber og juridiske implikationer." : ""}
          ${okonomi ? "Læg særlig vægt på de økonomiske aspekter nævnt i teksten. Inkluder finansielle prognoser, risici og potentielle muligheder hvor relevant." : ""}
          ${metode ? "Gennemgå og forklar den metodologi, der er anvendt eller nævnt i teksten. Vurder dens styrker, svagheder og potentielle bias." : ""}
          ${risici ? "Identificer og diskuter potentielle risici, der er nævnt eller antydet i teksten. Vurder sandsynligheden og konsekvenserne af hver risiko." : ""}
          Basér dit svar på den givne kontekst og tidligere samtale. Strukturér dit svar klart og logisk, og brug overskrifter hvor det er relevant`,
      },
      {
        role: "user",
        content: `Besvar følgende spørgsmål baseret på den givne kontekst og tidligere samtale.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
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

  return new StreamingTextResponse(stream);
}
