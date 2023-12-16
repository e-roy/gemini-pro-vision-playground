"use client";
// componnets/VisionContainer.tsx
import ImageUploadComponent from "@/components/ImageUploadComponent";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Card } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { Loader, Send } from "lucide-react";
import { TemperatureSelector } from "./control/TemperatureSelector";
import { MaxLengthSelector } from "./control/MaxLengthSelector";
import { TopPSelector } from "./control/TopPSelector";
import { TopKSelector } from "./control/TopKSelector";

type ImageData = {
  base64: string;
  mimeType: string;
};

export const VisionContainer = () => {
  const [firstImageData, setFirstImageData] = useState<ImageData | null>(null);
  const [secondImageData, setSecondImageData] = useState<ImageData | null>(
    null
  );
  const [result, setResult] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [temperature, setTemperature] = useState<number>(0.2);
  const [maxLength, setMaxLength] = useState<number>(2048);
  const [topP, setTopP] = useState<number>(0.8);
  const [topK, setTopK] = useState<number>(40);

  const handleTemperatureChange = (newTemperature: number[]) => {
    setTemperature(newTemperature[0]);
  };

  const handleMaxLengthChange = (newMaxLength: number[]) => {
    setMaxLength(newMaxLength[0]);
  };

  const handleTopPChange = (newTopP: number[]) => {
    setTopP(newTopP[0]);
  };

  const handleTopKChange = (newTopK: number[]) => {
    setTopK(newTopK[0]);
  };

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
    setLoading(true);
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
      temperature,
      max_length: maxLength,
      top_p: topP,
      top_k: topK,
    });

    try {
      const response = await fetch(`/api/gemini-vision`, {
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
          setLoading(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className={`grid grid-cols-11 gap-4`}>
      <div className="space-y-2 col-span-3">
        <div className={`h-1/3`}>
          <TemperatureSelector
            value={temperature}
            onValueChange={handleTemperatureChange}
          />
          <MaxLengthSelector
            maxTokens={2048}
            value={maxLength}
            onValueChange={handleMaxLengthChange}
          />
          <TopPSelector value={topP} onValueChange={handleTopPChange} />
          <TopKSelector value={topK} onValueChange={handleTopKChange} />
        </div>

        <ImageUploadComponent onImageUpload={handleFirstImageUpload} />
        <ImageUploadComponent onImageUpload={handleSecondImageUpload} />
      </div>
      <div className="flex flex-col h-[95vh] col-span-8">
        <Card className="flex flex-col flex-1 overflow-hidden">
          {userQuestion && (
            <div className="bg-slate-200 p-4">{userQuestion}</div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            <MarkdownViewer text={result} />
          </div>
          <form
            onSubmit={handleSubmitForm}
            className={`flex pt-4 border-t border-slate-300 p-2`}
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 p-2"
              placeholder="Ask a question about the images"
            />

            <button
              type="submit"
              className="ml-2 p-2 rounded-full border bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!isFormSubmittable() || loading}
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <Send className="m-auto" />
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};
