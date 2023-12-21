import React from "react";

export const TypingBubble: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="typing-dot bg-primary/50 h-2 w-2 rounded-full animate-typing-bounce" />
      <div
        className="typing-dot bg-primary/50 h-2 w-2 rounded-full animate-typing-bounce"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="typing-dot bg-primary/50 h-2 w-2 rounded-full animate-typing-bounce"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};
