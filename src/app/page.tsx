"use client";
// app/page.tsx
import { VisionContainer } from "@/components/VisionContainer";
import { ChatContainer } from "@/components/ChatContainer";
import { ControlContainer } from "@/components/control/ControlContainer";
import { useControlContext } from "@/providers/ControlContext";

export default function Home() {
  const { selectedModel } = useControlContext();

  return (
    <main className="grid md:grid-cols-12 max-h-screen md:h-screen max-w-6xl m-auto gap-4 p-2 md:p-4 my-12 md:my-0">
      <div className="relative md:col-span-3 h-[95vh]">
        <ControlContainer />
      </div>
      <div className="md:col-span-9">
        {selectedModel === "gemini-pro" ? (
          <ChatContainer />
        ) : (
          <VisionContainer />
        )}
      </div>
    </main>
  );
}
