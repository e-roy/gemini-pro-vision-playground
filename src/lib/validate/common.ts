// lib/validate/common.ts
import { z } from "zod";
import { JSONValue } from "ai";

export const safetySettingSchema = z.object({
  harassment: z.number(),
  hateSpeech: z.number(),
  sexuallyExplicit: z.number(),
  dangerousContent: z.number(),
});

const jsonValueSchema: z.ZodSchema<JSONValue> = z.lazy(() =>
  z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ])
);

const functionCallSchema = z.object({
  arguments: z.string().optional(),
  name: z.string().optional(),
});

const toolCallSchema = z.object({
  id: z.string(),
  type: z.string(),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
  }),
});

export const messageSchema = z.object({
  id: z.string().optional(),
  tool_call_id: z.string().optional(),
  createdAt: z.date().optional(),
  content: z.string(),
  ui: z.any().optional(),
  role: z.enum(["system", "user", "assistant", "function", "data", "tool"]),
  name: z.string().optional(),
  function_call: functionCallSchema.optional(),
  data: jsonValueSchema.optional(),
  tool_calls: z.array(toolCallSchema).optional(),
});
