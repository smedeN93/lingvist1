import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { streamText } from "ai";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: userId } = user;

    const { noteId, message } = sendMessageValidator.parse(body);

    const note = await db.note.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const { textStream, fullStream } = await streamText({
      model: openai('gpt-4o-mini'),
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            `Du er en hjælpsom assistent, der opdaterer brugernotater. Giv klare, koncise svar baseret på konteksten og brugerens input. Fokuser på relevant information uden at gentage eksisterende noteindhold. Begræns dit svar til maksimalt 1-2 korte, men fuldstændige sætninger og én overskrift. Dit svar skal altid kunne tilføjes direkte til en eksisterende note.`,
        },
        {
          role: "user",
          content: `Eksisterende noteindhold: ${note.content}\n\nBrugerspørgsmål: ${message}\n\nGiv et direkte og kortfattet svar, der kan tilføjes til den eksisterende note:`,
        },
      ],
      onFinish: async (completion) => {
        try {
          await db.note.update({
            where: { id: note.id },
            data: { aiResponse: completion.text },
          });
        } catch (error) {
          console.error('Fejl ved opdatering af note i databasen:', error);
        }
      },
    });

    return new Response(textStream);
  } catch (error) {
    console.error('Error in notes route:', error);
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("An unexpected error occurred", { status: 500 });
  }
}