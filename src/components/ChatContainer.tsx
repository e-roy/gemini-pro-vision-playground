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

import { MarkdownViewer } from "./markdown-viewer/MarkdownViewer";
import { useControlContext } from "@/providers/ControlContext";
import { CommonForm } from "./CommonForm";
import { TypingBubble } from "./TypingBubble";
import { MessageCircleX, User, Bot } from "lucide-react";
import { Button } from "./ui/button";

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
        {messages.length > 0 && (
          <div className={`flex p-4`}>
            <Button
              variant={`secondary`}
              type={`button`}
              size={`sm`}
              onClick={handleClearChat}
            >
              <MessageCircleX className={`mr-2`} /> Clear chat history
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message: Message) => (
            <div key={message.id} className={`flex`}>
              <div
                className={`${
                  message.role === "user"
                    ? ""
                    : "bg-primary/10 dark:bg-primary/10"
                } px-4 py-8 w-full`}
              >
                <div className={`my-4`}>
                  {message.role === "user" ? (
                    <div className={`flex space-x-4 font-medium`}>
                      <User />
                      <div>You</div>
                    </div>
                  ) : (
                    <div className={`flex space-x-4 font-medium`}>
                      <Bot />
                      <div>Gemini Pro</div>
                    </div>
                  )}
                </div>
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
