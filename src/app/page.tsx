"use client";
// app/page.tsx
import Link from "next/link";
import { VisionContainer } from "@/components/VisionContainer";
import { ChatContainer } from "@/components/ChatContainer";
import { ControlContainer } from "@/components/control/ControlContainer";
import { useControlContext } from "@/providers/ControlContext";
import { GithubIcon } from "lucide-react";

export default function Home() {
  const { selectedModel } = useControlContext();

  return (
    <main className="grid md:grid-cols-12 max-h-screen h-screen max-w-6xl m-auto gap-4 p-2 md:p-4 my-12 md:my-0">
      <div className="relative md:col-span-3 h-[95vh]">
        <ControlContainer />
        <Link
          href={`https://github.com/e-roy/gemini-pro-vision-playground`}
          className={`absolute bottom-0 p-4 flex font-medium text-slate-800 hover:text-slate-950 hover:bg-slate-100 justify-center items-center w-full`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ⭐️ on GitHub <GithubIcon className={`ml-4 h-5 w-5 my-auto`} />
        </Link>
      </div>
      <div className="md:col-span-9 h-[95vh]">
        {selectedModel === "gemini-pro" ? (
          <ChatContainer />
        ) : (
          <VisionContainer />
        )}
      </div>
    </main>
  );
}
