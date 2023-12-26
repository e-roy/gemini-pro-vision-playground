"use client";
// components/MarkdownViewer.tsx
import React, { useMemo } from "react";
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

const MemoizedAnchor = React.memo(Anchor);

const MemoizedUlComponent = React.memo(UlComponent);
const MemoizedOlComponent = React.memo(OlComponent);
const MemoizedLiComponent = React.memo(LiComponent);

const MemoizedPreComponent = React.memo(PreComponent);
const MemoizedCodeBlock = React.memo(CodeBlock);

const MemoizedTableComponent = React.memo(TableComponent);
const MemoizedTheadComponent = React.memo(TheadComponent);
const MemoizedTbodyComponent = React.memo(TbodyComponent);
const MemoizedTrComponent = React.memo(TrComponent);
const MemoizedThComponent = React.memo(ThComponent);
const MemoizedTdComponent = React.memo(TdComponent);

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

      table: MemoizedTableComponent,
      thead: MemoizedTheadComponent,
      tbody: MemoizedTbodyComponent,
      tr: MemoizedTrComponent,
      th: MemoizedThComponent,
      td: MemoizedTdComponent,
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
