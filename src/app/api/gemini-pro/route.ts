// api/gemini/route.ts
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentRequest,
  Content,
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

  // consecutive user messages need to be merged into the same content, 2 consecutive Content objects will error with the Gemini api
  const reqContent: GenerateContentRequest = {
    contents: messages.reduce((acc: Content[], m: Message) => {
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
