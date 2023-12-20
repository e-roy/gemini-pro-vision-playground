// api/gemini/route.ts
import { Message } from "ai";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentRequest,
} from "@google/generative-ai";

import { GeneralSettings } from "@/types";

const mapSafetyValueToThreshold = (value: number): HarmBlockThreshold => {
  switch (value) {
    case 0:
      return HarmBlockThreshold.BLOCK_NONE;
    case 1:
      return HarmBlockThreshold.BLOCK_LOW_AND_ABOVE;
    case 2:
      return HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE;
    case 3:
      return HarmBlockThreshold.BLOCK_ONLY_HIGH;
    default:
      return HarmBlockThreshold.BLOCK_NONE;
  }
};

const defaultSafetySettings = {
  harassment: 0,
  hateSpeech: 0,
  sexuallyExplicit: 0,
  dangerousContent: 0,
};

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, general_settings, safety_settings } = await req.json();
  const { temperature, maxLength, topP, topK } =
    general_settings as GeneralSettings;
  // console.log(temperature, maxLength, topP, topK);
  // console.log("general_settings", general_settings);
  // console.log("safety_settings", safety_settings);
  // console.log("messages =================>", messages);

  const reqContent: GenerateContentRequest = {
    contents: messages.map((m: Message) => {
      if (m.role === "user") {
        return {
          role: "user",
          parts: [{ text: m.content }],
        };
      }
      if (m.role === "assistant") {
        return {
          role: "model",
          parts: [{ text: m.content }],
        };
      }
      return undefined;
    }),
  };

  const incomingSafetySettings = safety_settings || defaultSafetySettings;

  const mappedSafetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: mapSafetyValueToThreshold(incomingSafetySettings.harassment),
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: mapSafetyValueToThreshold(incomingSafetySettings.hateSpeech),
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: mapSafetyValueToThreshold(
        incomingSafetySettings.sexuallyExplicit
      ),
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: mapSafetyValueToThreshold(
        incomingSafetySettings.dangerousContent
      ),
    },
  ];

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({
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
  });

  const countTokens = await model.countTokens(reqContent);
  console.log("count tokens ------", countTokens);

  try {
    const streamingResp = await model.generateContentStream(reqContent);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamingResp.stream) {
            if (chunk.candidates) {
              const parts = chunk.candidates[0].content.parts;
              const firstPart = parts[0];
              if (typeof firstPart.text === "string") {
                // Encode the string text as bytes
                const textEncoder = new TextEncoder();
                const encodedText = textEncoder.encode(firstPart.text);
                controller.enqueue(encodedText);
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
