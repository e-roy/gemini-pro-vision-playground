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
import { SafetySelector } from "./control/SafetySelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MediaData = {
  data: string;
  mimeType: string;
};

type SafetySettings = {
  harassment: number;
  hateSpeech: number;
  sexuallyExplicit: number;
  dangerousContent: number;
};

export const VisionContainer = () => {
  const [firstMediaData, setFirstMediaData] = useState<MediaData | null>(null);
  const [secondMediaData, setSecondMediaData] = useState<MediaData | null>(
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

  const [safetySettings, setSafetySettings] = useState<SafetySettings>({
    harassment: 2,
    hateSpeech: 2,
    sexuallyExplicit: 2,
    dangerousContent: 2,
  });

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

  const handleSafetyChange = (
    type: keyof SafetySettings,
    newValue: number[]
  ) => {
    setSafetySettings((prevState) => ({
      ...prevState,
      [type]: newValue[0],
    }));
  };

  const handleFirstMediaUpload = useCallback(
    (data: string, mimeType: string) => {
      setFirstMediaData({ data, mimeType });
    },
    []
  );

  const handleSecondMediaUpload = useCallback(
    (data: string, mimeType: string) => {
      setSecondMediaData({ data, mimeType });
    },
    []
  );

  const isFormSubmittable = () => {
    return (
      prompt.trim() !== "" &&
      (firstMediaData !== null || secondMediaData !== null)
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
    const mediaData = [firstMediaData, secondMediaData].filter(
      (data): data is MediaData => {
        return data !== null && data.data !== "" && data.mimeType !== "";
      }
    );

    // If there are no valid images and the prompt is empty, do not proceed
    if (mediaData.length === 0) return;

    const mediaBase64 = mediaData.map((data) =>
      data.data.replace(/^data:(image|video)\/\w+;base64,/, "")
    );
    const mediaTypes = mediaData.map((data) => data.mimeType);

    const body = JSON.stringify({
      message: prompt,
      media: mediaBase64,
      media_types: mediaTypes,
      temperature,
      max_length: maxLength,
      top_p: topP,
      top_k: topK,
      safety_settings: safetySettings,
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
        }
        setLoading(false);
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
        <div className={``}>
          <TemperatureSelector
            value={temperature}
            onValueChange={handleTemperatureChange}
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Advanced Settings</AccordionTrigger>

              <AccordionContent>
                <MaxLengthSelector
                  maxTokens={2048}
                  value={maxLength}
                  onValueChange={handleMaxLengthChange}
                />
                <TopPSelector value={topP} onValueChange={handleTopPChange} />
                <TopKSelector value={topK} onValueChange={handleTopKChange} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Safety Settings</AccordionTrigger>
              <AccordionContent>
                <p>
                  Adjust how likely you are to see responses that could be
                  harmful. Content is blocked based on the probability that it
                  is harmful.
                </p>
                <SafetySelector
                  label="Harassment"
                  value={safetySettings.harassment}
                  onValueChange={(newValue) =>
                    handleSafetyChange("harassment", newValue)
                  }
                />
                <SafetySelector
                  label="Hate Speech"
                  value={safetySettings.hateSpeech}
                  onValueChange={(newValue) =>
                    handleSafetyChange("hateSpeech", newValue)
                  }
                />
                <SafetySelector
                  label="Sexually Explicit"
                  value={safetySettings.sexuallyExplicit}
                  onValueChange={(newValue) =>
                    handleSafetyChange("sexuallyExplicit", newValue)
                  }
                />
                <SafetySelector
                  label="Dangerous Content"
                  value={safetySettings.dangerousContent}
                  onValueChange={(newValue) =>
                    handleSafetyChange("dangerousContent", newValue)
                  }
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <ImageUploadComponent onFileUpload={handleFirstMediaUpload} />
        <ImageUploadComponent onFileUpload={handleSecondMediaUpload} />
      </div>
      <div className="flex flex-col h-[95vh] col-span-8">
        <Card className="flex flex-col flex-1 overflow-hidden">
          {userQuestion && (
            <div className="bg-slate-200 p-4">{userQuestion}</div>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            {!firstMediaData?.data && !secondMediaData?.data && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl text-slate-700 font-medium">
                  Add an image to get started
                </div>
              </div>
            )}
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
