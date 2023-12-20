"use client";
// components/ChatContainer.tsx
import React, {
  useRef,
  useEffect,
  useState,
  FormEvent,
  KeyboardEvent,
  useCallback,
} from "react";
import { Message, useChat } from "ai/react";
import { Loader, Send } from "lucide-react";
import { Card } from "./ui/card";
import { MarkdownViewer } from "./MarkdownViewer";
import { useControlContext } from "@/providers/ControlContext";

export const ChatContainer = () => {
  const { generalSettings, safetySettings } = useControlContext();
  const [loading, setLoading] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const resetTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      // Reset height to 1 row height, assuming 20px as the line height
      textareaRef.current.style.height = "2.5rem";
    }
  }, []);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    handleSubmit(event);
    resetTextareaHeight();
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        setLoading(true);
        handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
        resetTextareaHeight();
      } else if (event.key === "Enter") {
        // Allow for Ctrl+Enter or Shift+Enter to insert new lines
        event.preventDefault();
        const textarea = event.currentTarget;
        const cursorPosition = textarea.selectionStart;
        textarea.value =
          textarea.value.slice(0, cursorPosition) +
          "\n" +
          textarea.value.slice(cursorPosition);
        handleInputChange(
          event as unknown as React.ChangeEvent<HTMLTextAreaElement>
        );
        textarea.selectionStart = cursorPosition + 1;
        textarea.selectionEnd = cursorPosition + 1;
        textarea.style.height = "inherit";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
    [handleInputChange, handleSubmit, resetTextareaHeight]
  );

  const handleTextAreaInput = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      handleInputChange(event as React.ChangeEvent<HTMLTextAreaElement>);
      const target = event.currentTarget;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    },
    [handleInputChange]
  );
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
          className="flex pt-4 border-t border-slate-300 p-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onInput={handleTextAreaInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            rows={1}
            className="flex-1 p-2 resize-none overflow-hidden min-h-16"
            placeholder="Chat with Gemini Pro"
          />
          <div className="mt-auto">
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
          </div>
        </form>
      </Card>
    </div>
  );
};
