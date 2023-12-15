"use client";
// components/MarkdownViewer.tsx
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

type AnchorProps = {
  href: string;
  children: React.ReactNode;
};

const Anchor: React.FC<AnchorProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const UlComponent: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  ...props
}) => {
  return (
    <ul {...props} className="list-disc pl-4 mb-4">
      {children}
    </ul>
  );
};

const OlComponent: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  children,
  ...props
}) => {
  return (
    <ol {...props} className="list-decimal pl-4 mb-0">
      {children}
    </ol>
  );
};

const LiComponent: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({
  children,
  ...props
}) => {
  return (
    <li {...props} className="mb-1 leading-snug pl-4">
      {children}
    </li>
  );
};

// Memoize components to prevent re-rendering if props have not changed
const MemoizedAnchor = React.memo(Anchor);
const MemoizedUlComponent = React.memo(UlComponent);
const MemoizedOlComponent = React.memo(OlComponent);
const MemoizedLiComponent = React.memo(LiComponent);

interface IMarkdownViewerProps {
  text: string;
}

export const MarkdownViewer: React.FC<IMarkdownViewerProps> = ({ text }) => {
  // Use useMemo to avoid re-creating the components object on every render
  const components = useMemo(
    () => ({
      a: MemoizedAnchor,
      ul: MemoizedUlComponent,
      ol: MemoizedOlComponent,
      li: MemoizedLiComponent,
    }),
    []
  );

  return (
    <ReactMarkdown
      // @ts-ignore
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      className="markdown"
    >
      {text}
    </ReactMarkdown>
  );
};
