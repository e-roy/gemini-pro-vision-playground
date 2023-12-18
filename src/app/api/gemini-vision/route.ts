// api/gemini-vision/route.ts
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
  const {
    message,
    media,
    media_types,
    temperature,
    max_length,
    top_p,
    top_k,
    safety_settings,
  } = await req.json();
  // console.log(temperature, max_length, top_p, top_k);
  // console.log(media, media_types);
  // console.log(safety_settings);

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

  const model = genAI.getGenerativeModel({
    model: "gemini-pro-vision",
    safetySettings: mappedSafetySettings,
    generationConfig: {
      //   candidateCount: 0,
      //   stopSequences: [],
      maxOutputTokens: max_length,
      temperature: temperature,
      topP: top_p,
      topK: top_k,
    },
  });

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
                controller.enqueue(firstPart.text);
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
