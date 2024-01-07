// lib/validate/pro-request-schema.ts
import { z } from "zod";
import { messageSchema, safetySettingSchema } from "./common";

export const proRequestSchema = z.object({
  messages: z.array(messageSchema),
  general_settings: z.object({
    temperature: z.number(),
    maxLength: z.number(),
    topP: z.number(),
    topK: z.number(),
  }),
  safety_settings: safetySettingSchema.optional(),
});
