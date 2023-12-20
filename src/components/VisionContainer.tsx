"use client";
// componnets/VisionContainer.tsx
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Loader, Send } from "lucide-react";

import { useControlContext } from "@/providers/ControlContext";

export const VisionContainer = () => {
  const { generalSettings, safetySettings, mediaDataList } =
    useControlContext();

  const [result, setResult] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isFormSubmittable = () => {
    return (
      prompt.trim() !== "" &&
      mediaDataList.some(
        (media) => media !== null && media.data !== "" && media.mimeType !== ""
      )
    );
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormSubmittable()) return;
    setLoading(true);
    setUserQuestion(prompt);
    setResult("");
    setPrompt("");

    // Filter out any invalid image data
    const validMediaData = mediaDataList.filter(
      (data) => data.data !== "" && data.mimeType !== ""
    );

    // If there are no valid images and the prompt is empty, do not proceed
    if (validMediaData.length === 0) return;

    const mediaBase64 = validMediaData.map((data) =>
      data.data.replace(/^data:(image|video)\/\w+;base64,/, "")
    );
    const mediaTypes = validMediaData.map((data) => data.mimeType);

    // console.log(mediaBase64.length, mediaTypes);

    const body = JSON.stringify({
      message: prompt,
      media: mediaBase64,
      media_types: mediaTypes,
      general_settings: generalSettings,
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
    <div className="flex flex-col h-[95vh]">
      <Card className="flex flex-col flex-1 overflow-hidden">
        {userQuestion && <div className="bg-slate-200 p-4">{userQuestion}</div>}
        <div className="flex-1 overflow-y-auto p-4">
          <MarkdownViewer text={result} />
          {mediaDataList.every(
            (media) => media === null || media.data === ""
          ) && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl text-slate-700 font-medium">
                Add an image to get started
              </div>
            </div>
          )}
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
  );
};
