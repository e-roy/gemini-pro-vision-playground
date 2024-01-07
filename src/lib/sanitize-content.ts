// lib/sanitize-content.ts
import { escape } from "html-escaper";

export const sanitizeContent = (content: string): string => {
  return escape(content);
};
