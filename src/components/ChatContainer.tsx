"use client";
// components/ChatContainer.tsx
import React, {
  useRef,
  useEffect,
  useState,
  FormEvent,
  useCallback,
} from "react";
import { Message, useChat } from "ai/react";
import { Card } from "./ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarkdownViewer } from "./MarkdownViewer";
import { useControlContext } from "@/providers/ControlContext";
import { CommonForm } from "./CommonForm";
import { TypingBubble } from "./TypingBubble";
import { MessageCircleX } from "lucide-react";

export const ChatContainer = () => {
  const { generalSettings, safetySettings } = useControlContext();
  const [loading, setLoading] = useState<boolean>(false);

  const { messages, setMessages, input, handleInputChange, handleSubmit } =
    useChat({
      id: "gemini-pro",
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    handleSubmit(event);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[95vh]">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {messages.length > 0 && (
            <div className={`flex justify-end p-4`}>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild onClick={handleClearChat}>
                  <div className={`text-primary/60 hover:text-primary/90`}>
                    <MessageCircleX />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  align="start"
                  className="w-[260px] text-sm"
                  side="right"
                >
                  Clear chat history
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`${
                message.role === "user" ? "justify-end" : "justify-start"
              } flex m-4`}
            >
              <div
                className={`${
                  message.role === "user"
                    ? "bg-primary/20 dark:bg-primary/20"
                    : "bg-primary/10 dark:bg-primary/10"
                } px-4 py-2 rounded-lg`}
              >
                <MarkdownViewer text={message.content} />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {loading && <TypingBubble />}
        </div>
        <CommonForm
          value={input}
          placeholder="Chat with Gemini Pro"
          loading={loading}
          onInputChange={handleInputChange}
          onFormSubmit={handleFormSubmit}
          isSubmittable={input.trim() !== ""}
        />
      </Card>
    </div>
  );
};
