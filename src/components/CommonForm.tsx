"use client";
// components/CommonForm.tsx
import React, {
  useState,
  useRef,
  useCallback,
  FormEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import { Button } from "./ui/button";
import { Loader, Send } from "lucide-react";

interface CommonFormProps {
  value: string;
  placeholder: string;
  loading: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmittable: boolean;
}

export const CommonForm: React.FC<CommonFormProps> = ({
  value,
  placeholder,
  loading,
  onInputChange,
  onFormSubmit,
  isSubmittable,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState("auto");

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        if (isSubmittable && textareaRef.current) {
          onFormSubmit(event as unknown as FormEvent<HTMLFormElement>);
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        const textarea = event.currentTarget;
        const cursorPosition = textarea.selectionStart;
        // Insert the newline character manually
        const newValue =
          textarea.value.slice(0, cursorPosition) +
          "\n" +
          textarea.value.slice(cursorPosition);
        textarea.value = newValue;
        // Manually trigger the onInputChange with the new value
        const changeEvent = new Event("input", {
          bubbles: true,
        }) as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        // Manually set the value of the target to mimic the expected behavior
        Object.defineProperty(changeEvent, "target", {
          writable: true,
          value: { value: newValue },
        });
        onInputChange(changeEvent);
        // Set cursor position
        textarea.selectionStart = cursorPosition + 1;
        textarea.selectionEnd = cursorPosition + 1;
        adjustTextareaHeight(textarea);
      }
    },
    [onInputChange, onFormSubmit, isSubmittable]
  );

  const handleTextAreaInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(event);
      const target = event.currentTarget;
      setTextareaHeight(`${target.scrollHeight}px`);
    },
    [onInputChange]
  );

  const resetTextareaHeight = useCallback(() => {
    setTextareaHeight("2.5rem");
  }, []);

  const adjustTextareaHeight = (target: HTMLTextAreaElement) => {
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  useEffect(() => {
    if (loading) resetTextareaHeight();
  }, [loading, resetTextareaHeight]);

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex gap-4 pt-4 border-t border-primary/70 p-2"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onInput={handleTextAreaInput}
        onChange={onInputChange}
        onKeyDown={handleKeyPress}
        style={{ height: textareaHeight }}
        rows={1}
        className="flex-1 p-2 resize-none overflow-hidden min-h-8 rounded"
        placeholder={placeholder}
      />
      <div className="mt-auto">
        <Button
          type="submit"
          variant={`icon`}
          disabled={!isSubmittable || loading}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <Send className="m-auto" />
          )}
        </Button>
      </div>
    </form>
  );
};
