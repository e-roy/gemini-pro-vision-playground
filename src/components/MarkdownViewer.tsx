"use client";
// components/MarkdownViewer.tsx
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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

interface IPreProps {
  children: React.ReactElement<{ className?: string; children: string }>;
}

const PreComponent: React.FC<IPreProps> = ({ children }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const language = React.isValidElement(children)
    ? children.props.className?.split("-")[1] || ""
    : "";

  const copyToClipboard = React.useCallback(async () => {
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(children?.props?.children);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  }, [children.props.children]);

  return (
    <pre className="bg-[#2B2B2B] rounded-md p-2 text-neutral-50 mb-4">
      <div className={`flex justify-between`}>
        <div className="italic text-xs text-neutral-300 uppercase">
          {language}
        </div>
        <button
          type={`button`}
          className="border w-20 rounded"
          onClick={copyToClipboard}
        >
          {hasCopied ? "Copied!" : "Copy"}
        </button>
      </div>

      {children}
    </pre>
  );
};

interface CodeBlockProps {
  className?: string;
  children?: string | React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ ...props }) => {
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className as string) || [];

  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      language={match[1]}
      style={a11yDark}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code {...rest} className={className}>
      {children}
    </code>
  );
};

const MemoizedAnchor = React.memo(Anchor);
const MemoizedUlComponent = React.memo(UlComponent);
const MemoizedOlComponent = React.memo(OlComponent);
const MemoizedLiComponent = React.memo(LiComponent);
const MemoizedPreComponent = React.memo(PreComponent);
const MemoizedCodeBlock = React.memo(CodeBlock);

interface IMarkdownViewerProps {
  text: string;
}

export const MarkdownViewer: React.FC<IMarkdownViewerProps> = ({ text }) => {
  const components = useMemo(
    () => ({
      a: MemoizedAnchor,
      ul: MemoizedUlComponent,
      ol: MemoizedOlComponent,
      li: MemoizedLiComponent,
      pre: MemoizedPreComponent,
      code: MemoizedCodeBlock,
    }),
    []
  );

  return (
    <ReactMarkdown
      // @ts-ignore
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {text}
    </ReactMarkdown>
  );
};
