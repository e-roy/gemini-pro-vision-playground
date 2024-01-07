// api/gemini-vision/route.ts
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

import {
  GoogleGenerativeAI,
  GenerateContentRequest,
  Part,
  InlineDataPart,
  TextPart,
} from "@google/generative-ai";

import {
  mapSafetySettings,
  defaultSafetySettings,
} from "@/lib/safety-settings-mapper";

import { GeneralSettings } from "@/types";

import { visionRequestSchema } from "@/lib/validate/vision-request-schema";

import { sanitizeContent } from "@/lib/sanitize-content";

export const runtime = "edge";

export async function POST(req: Request) {
  const parseResult = visionRequestSchema.safeParse(await req.json());

  if (!parseResult.success) {
    // If validation fails, return a 400 Bad Request response
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { message, media, media_types, general_settings, safety_settings } =
    parseResult.data;

  const { temperature, maxLength, topP, topK } =
    general_settings as GeneralSettings;

  const userMessage: string = sanitizeContent(message);

  const incomingSafetySettings = safety_settings || defaultSafetySettings;
  const mappedSafetySettings = mapSafetySettings(incomingSafetySettings);

  const parts: Part[] = media.map(
    (mediaData: string, index: number): InlineDataPart => ({
      inlineData: {
        mimeType: media_types[index],
        data: mediaData,
      },
    })
  );

  const userMessagePart: TextPart = { text: userMessage };
  parts.push(userMessagePart);

  const reqContent: GenerateContentRequest = {
    contents: [
      {
        role: "user",
        parts: parts,
      },
    ],
    safetySettings: mappedSafetySettings,
    generationConfig: {
      //   candidateCount: 0,
      //   stopSequences: [],
      maxOutputTokens: maxLength,
      temperature,
      topP,
      topK,
    },
  };

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const geminiStream = await genAI
    .getGenerativeModel({
      model: "gemini-pro-vision",
    })
    .generateContentStream(reqContent);

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
