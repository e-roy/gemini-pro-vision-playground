"use client";
// componnets/VisionContainer.tsx
import React, { useState, useCallback } from "react";
import { useControlContext } from "@/providers/ControlContext";
import { Card } from "@/components/ui/card";

import { MarkdownViewer } from "./markdown-viewer/MarkdownViewer";
import { CommonForm } from "./CommonForm";
import { TypingBubble } from "./TypingBubble";

import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export const VisionContainer = () => {
  const { generalSettings, safetySettings, mediaDataList } =
    useControlContext();

  const [result, setResult] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isFormSubmittable = useCallback(() => {
    return (
      prompt.trim() !== "" &&
      mediaDataList.some(
        (media) => media !== null && media.data !== "" && media.mimeType !== ""
      )
    );
  }, [prompt, mediaDataList]);

  const makeApiCall = useCallback(
    async (message: string) => {
      // Filter out any invalid image data
      const validMediaData = mediaDataList.filter(
        (data) => data.data !== "" && data.mimeType !== ""
      );

      // If there are no valid images and the message is empty, do not proceed
      if (validMediaData.length === 0) return;
      if (message.trim() === "") return;

      const mediaBase64 = validMediaData.map((data) =>
        data.data.replace(/^data:(image|video)\/\w+;base64,/, "")
      );
      const mediaTypes = validMediaData.map((data) => data.mimeType);

      const body = JSON.stringify({
        message,
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
        }
      } catch (error) {
        if (error instanceof Error) {
          setResult(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [mediaDataList, generalSettings, safetySettings]
  );

  const handleRefresh = useCallback(() => {
    if (!userQuestion) return;
    setLoading(true);
    setResult("");
    makeApiCall(userQuestion);
  }, [userQuestion, makeApiCall]);

  const handleSubmitForm = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormSubmittable()) return;
      setLoading(true);
      setUserQuestion(prompt);
      setResult("");
      setPrompt("");

      await makeApiCall(prompt);
    },
    [isFormSubmittable, makeApiCall, prompt]
  );

  return (
    <div className="flex flex-col h-[95vh]">
      <Card className="flex flex-col flex-1 overflow-hidden">
        {userQuestion && (
          <div className="bg-primary/20 p-4 flex space-x-4">
            <Button
              type={`button`}
              variant={`icon`}
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCcw className={`w-4 h-4`} />
            </Button>

            <div>{userQuestion}</div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">
          <MarkdownViewer text={result} />
          {loading && <TypingBubble />}
          {mediaDataList.every(
            (media) => media === null || media?.data === ""
          ) && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl text-primary/80 font-medium">
                Add an image to get started
              </div>
            </div>
          )}
        </div>
        <CommonForm
          value={prompt}
          placeholder="Ask a question about the images"
          loading={loading}
          onInputChange={(e) => setPrompt(e.target.value)}
          onFormSubmit={handleSubmitForm}
          isSubmittable={isFormSubmittable()}
        />
      </Card>
    </div>
  );
};
