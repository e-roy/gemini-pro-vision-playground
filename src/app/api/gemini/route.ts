// api/gemini/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { message, images, image_types } = await req.json();

  const userMessage = message;

  const reqContent = {
    contents: [
      {
        role: "user",
        parts: images
          .map((imageData: string, index: number) => ({
            inline_data: {
              mime_type: image_types[index],
              data: imageData,
            },
          }))
          .concat([{ text: `"""${userMessage}"""` }]),
      },
    ],
  };

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const model = genAI.getGenerativeModel({
    model: "gemini-pro-vision",
    generationConfig: {
      //   candidateCount: 0,
      //   stopSequences: [],
      //   maxOutputTokens: 0,
      temperature: 0.4,
      topP: 1,
      topK: 32,
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
