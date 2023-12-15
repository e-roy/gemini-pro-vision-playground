"use client";
// app/page.tsx
import ImageUploadComponent from "@/components/ImageUploadComponent";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Card } from "@/components/ui/card";
import { useState, useCallback } from "react";

type ImageData = {
  base64: string;
  mimeType: string;
};

export default function Home() {
  const [firstImageData, setFirstImageData] = useState<ImageData | null>(null);
  const [secondImageData, setSecondImageData] = useState<ImageData | null>(
    null
  );
  const [result, setResult] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");

  const handleFirstImageUpload = useCallback(
    (base64: string, mimeType: string) => {
      setFirstImageData({ base64, mimeType });
    },
    []
  );

  const handleSecondImageUpload = useCallback(
    (base64: string, mimeType: string) => {
      setSecondImageData({ base64, mimeType });
    },
    []
  );

  const isFormSubmittable = () => {
    return (
      prompt.trim() !== "" &&
      (firstImageData !== null || secondImageData !== null)
    );
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormSubmittable()) return;
    setUserQuestion(prompt);
    setResult("");
    setPrompt("");

    // Filter out any invalid image data (where base64 or mimeType is an empty string)
    const imagesData = [firstImageData, secondImageData].filter(
      (data): data is ImageData => {
        return data !== null && data.base64 !== "" && data.mimeType !== "";
      }
    );

    // If there are no valid images and the prompt is empty, do not proceed
    if (imagesData.length === 0) return;

    const imagesBase64 = imagesData.map((data) =>
      data.base64.replace(/^data:image\/\w+;base64,/, "")
    );
    const imageTypes = imagesData.map((data) => data.mimeType);

    const body = JSON.stringify({
      message: prompt,
      images: imagesBase64,
      image_types: imageTypes,
    });

    try {
      const response = await fetch(`/api/gemini`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (reader) {
        let accumulator = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = new TextDecoder().decode(value);
          accumulator += text;
          setResult(accumulator);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      }
    }
  };

  return (
    <main className="grid grid-cols-2 max-h-screen max-w-6xl m-auto gap-4">
      <div className="space-y-4 p-4">
        <ImageUploadComponent onImageUpload={handleFirstImageUpload} />
        <ImageUploadComponent onImageUpload={handleSecondImageUpload} />
      </div>
      <div className="flex flex-col h-screen max-h-screen pt-4 pb-8">
        <Card className="flex-1 overflow-y-scroll">
          <div className={`bg-slate-200 p-4`}>{userQuestion}</div>
          <div className={`p-4`}>
            <MarkdownViewer text={result} />
          </div>
        </Card>

        <form
          onSubmit={handleSubmitForm}
          style={{ display: "flex", paddingTop: "10px" }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-slate-300 shadow-md shadow-slate-300"
            placeholder="Ask a question about the images"
          />
          <button
            type="submit"
            className="ml-2 p-2 rounded-lg border bg-blue-500 hover:bg-blue-600 text-white"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
