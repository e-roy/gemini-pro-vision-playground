// lib/validate/vision-request-schema.ts
import { z } from "zod";
import { safetySettingSchema } from "./common";

export const visionRequestSchema = z.object({
  message: z.string(),
  media: z.array(z.string()),
  media_types: z.array(z.string()),
  general_settings: z.object({
    temperature: z.number(),
    maxLength: z.number(),
    topP: z.number(),
    topK: z.number(),
  }),
  safety_settings: safetySettingSchema.optional(),
});
