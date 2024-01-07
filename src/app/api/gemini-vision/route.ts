// api/gemini-vision/route.ts
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

import {
  GoogleGenerativeAI,
  GenerateContentRequest,
} from "@google/generative-ai";

import {
  mapSafetySettings,
  defaultSafetySettings,
} from "@/lib/safety-settings-mapper";

import { GeneralSettings } from "@/types";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, media, media_types, general_settings, safety_settings } =
    await req.json();
  const { temperature, maxLength, topP, topK } =
    general_settings as GeneralSettings;

  const userMessage = message;

  const reqContent: GenerateContentRequest = {
    contents: [
      {
        role: "user",
        parts: media
          .map((mediaData: string, index: number) => ({
            inline_data: {
              mime_type: media_types[index],
              data: mediaData,
            },
          }))
          .concat([{ text: `"""${userMessage}"""` }]),
      },
    ],
  };

  const incomingSafetySettings = safety_settings || defaultSafetySettings;
  const mappedSafetySettings = mapSafetySettings(incomingSafetySettings);

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const geminiStream = await genAI
    .getGenerativeModel({
      model: "gemini-pro-vision",
      safetySettings: mappedSafetySettings,
      generationConfig: {
        //   candidateCount: 0,
        //   stopSequences: [],
        maxOutputTokens: maxLength,
        temperature,
        topP,
        topK,
      },
    })
    .generateContentStream(reqContent);

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
