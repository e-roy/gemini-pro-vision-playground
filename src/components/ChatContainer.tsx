"use client";
// components/ChatContainer.tsx
import React, { useRef, useEffect, useState, FormEvent } from "react";
import { Message, useChat } from "ai/react";
import { Loader, Send } from "lucide-react";
import { Card } from "./ui/card";
import { MarkdownViewer } from "./MarkdownViewer";
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

type SafetySettings = {
  harassment: number;
  hateSpeech: number;
  sexuallyExplicit: number;
  dangerousContent: number;
};

export const ChatContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [temperature, setTemperature] = useState<number>(0.2);
  const [maxLength, setMaxLength] = useState<number>(4000);
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

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/gemini-pro`,
    body: {
      temperature,
      max_length: maxLength,
      top_p: topP,
      top_k: topK,
    },
    onError: () => {
      setLoading(false);
    },
    onFinish: () => {
      setLoading(false);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    handleSubmit(event);
  };

  return (
    <div className={`grid grid-cols-11 gap-4`}>
      <div className="space-y-4 col-span-3">
        <div className={`h-1/3`}>
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
      </div>
      <div className="flex flex-col h-[95vh] col-span-8">
        <Card className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`${
                  message.role === "user" ? "justify-end" : "justify-start"
                } flex m-4`}
              >
                <div
                  className={`${
                    message.role === "user" ? "bg-slate-300" : "bg-slate-200"
                  } px-4 py-2 rounded-lg`}
                >
                  <MarkdownViewer text={message.content} />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleFormSubmit}
            className={`flex pt-4 border-t border-slate-300 p-2`}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-1 p-2"
              placeholder="Chat with Gemini Pro"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-full border bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
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
