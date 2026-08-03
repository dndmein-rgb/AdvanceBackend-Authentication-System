import { z } from "zod";

export const googleCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().min(1, "State is required"),
});

export type GoogleCallbackDTO = z.infer<typeof googleCallbackSchema>;