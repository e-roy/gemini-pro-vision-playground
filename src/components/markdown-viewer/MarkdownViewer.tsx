"use client";
// components/MarkdownViewer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import { UlComponent, OlComponent, LiComponent } from "./list";
import { PreComponent, CodeBlock } from "./code";
import {
  TableComponent,
  TheadComponent,
  TbodyComponent,
  TrComponent,
  ThComponent,
  TdComponent,
} from "./table";

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

interface IMarkdownViewerProps {
  text: string;
}

export const MarkdownViewer: React.FC<IMarkdownViewerProps> = React.memo(
  function MarkdownViewer({ text }) {
    const components = {
      a: Anchor,

      ul: UlComponent,
      ol: OlComponent,
      li: LiComponent,

      pre: PreComponent,
      code: CodeBlock,

      table: TableComponent,
      thead: TheadComponent,
      tbody: TbodyComponent,
      tr: TrComponent,
      th: ThComponent,
      td: TdComponent,
    };

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
  },
  (prevProps, nextProps) => prevProps.text === nextProps.text
);
