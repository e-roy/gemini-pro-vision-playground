"use client";
// components/ChatContainer.tsx
import React, { useRef, useEffect, useState, FormEvent } from "react";
import { Message, useChat } from "ai/react";
import { Loader, Send } from "lucide-react";
import { Card } from "./ui/card";
import { MarkdownViewer } from "./MarkdownViewer";
import { useControlContext } from "@/providers/ControlContext";

export const ChatContainer = () => {
  const { generalSettings, safetySettings } = useControlContext();
  const [loading, setLoading] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/gemini-pro`,
    body: {
      general_settings: generalSettings,
      safety_settings: safetySettings,
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
    <div className="flex flex-col h-[95vh]">
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
  );
};
