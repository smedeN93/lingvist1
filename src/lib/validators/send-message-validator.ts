import * as z from "zod";

export const sendMessageValidator = z.object({
  noteId: z.string().optional(),
  fileId: z.string().optional(),
  message: z.string().max(300),
  kontraktvilkaar: z.boolean().optional(),
  okonomi: z.boolean().optional(),
  metode: z.boolean().optional(),
  risici: z.boolean().optional(),
});

export type SendMessageRequest = z.infer<typeof sendMessageValidator>;
