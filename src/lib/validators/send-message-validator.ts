import * as z from "zod";

export const sendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
  includePageNumbers: z.boolean().optional(),
  argumentAnalysis: z.boolean().optional(),
  exploreScenarios: z.boolean().optional(),
  kontraktvilkaar: z.boolean().optional(),
  okonomi: z.boolean().optional(),
  metode: z.boolean().optional(),
  risici: z.boolean().optional(),
});

export type SendMessageRequest = z.infer<typeof sendMessageValidator>;