// api/gemini-vision/route.ts
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

import { GeneralSettings } from "@/types";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentRequest,
} from "@google/generative-ai";

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
  const { message, media, media_types, general_settings, safety_settings } =
    await req.json();
  const { temperature, maxLength, topP, topK } =
    general_settings as GeneralSettings;
  // console.log(temperature, maxLength, topP, topK);
  // console.log(media, media_types);
  // console.log(safety_settings);
  // console.log("message =================>", message);

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
