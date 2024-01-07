// api/gemini/route.ts
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

import {
  GoogleGenerativeAI,
  GenerateContentRequest,
  Content,
} from "@google/generative-ai";

import {
  mapSafetySettings,
  defaultSafetySettings,
} from "@/lib/safety-settings-mapper";

import { sanitizeContent } from "@/lib/sanitize-content";

import { proRequestSchema } from "@/lib/validate/pro-request-schema";

import { GeneralSettings } from "@/types";

export const runtime = "edge";

export async function POST(req: Request) {
  const parseResult = proRequestSchema.safeParse(await req.json());

  if (!parseResult.success) {
    // If validation fails, return a 400 Bad Request response
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { messages, general_settings, safety_settings } = parseResult.data;
  const { temperature, maxLength, topP, topK } =
    general_settings as GeneralSettings;

  for (const message of messages) {
    message.content = sanitizeContent(message.content);
  }

  const typedMessages: Message[] = messages as unknown as Message[];

  // consecutive user messages need to be merged into the same content, 2 consecutive Content objects with user role will error with the Gemini api
  const reqContent: GenerateContentRequest = {
    contents: typedMessages.reduce((acc: Content[], m: Message) => {
      if (m.role === "user") {
        const lastContent = acc[acc.length - 1];
        if (lastContent && lastContent.role === "user") {
          lastContent.parts.push({ text: m.content });
        } else {
          acc.push({
            role: "user",
            parts: [{ text: m.content }],
          });
        }
      } else if (m.role === "assistant") {
        acc.push({
          role: "model",
          parts: [{ text: m.content }],
        });
      }

      return acc;
    }, []),
  };

  const incomingSafetySettings = safety_settings || defaultSafetySettings;
  const mappedSafetySettings = mapSafetySettings(incomingSafetySettings);

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const tokens = await genAI
    .getGenerativeModel({
      model: "gemini-pro",
    })
    .countTokens(reqContent);
  console.log("count tokens ------", tokens);

  const geminiStream = await genAI
    .getGenerativeModel({
      model: "gemini-pro",
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
