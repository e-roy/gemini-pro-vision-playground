"use client";
// app/page.tsx
import { useState } from "react";
import { VisionContainer } from "@/components/VisionContainer";
import { ChatContainer } from "@/components/ChatContainer";
import { Eye, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState<"vision" | "chat">(
    "vision"
  );

  return (
    <main className="grid grid-cols-12 max-h-screen h-screen max-w-6xl m-auto gap-4 p-2 md:p-4">
      <nav className="col-span-1 flex flex-col space-y-4 pt-2">
        <button
          type="button"
          className={cn(
            `border-2 hover:border-slate-400 hover:shadow-lg shadow-slate-300 rounded-full mx-auto p-2 text-slate-400 hover:text-slate-700 transition ease-in-out delay-50 hover:-translate-y-0.5 hover:scale-110 duration-150`,
            activeComponent === "vision" && "border-slate-400 text-slate-700"
          )}
          onClick={() => setActiveComponent("vision")}
        >
          <Eye className="h-10 w-10" />
        </button>
        <button
          type="button"
          className={cn(
            `border-2 hover:border-slate-400 hover:shadow-lg shadow-slate-300 rounded-full mx-auto p-2 text-slate-400 hover:text-slate-700 transition ease-in-out delay-50 hover:-translate-y-0.5 hover:scale-110 duration-150`,
            activeComponent === "chat" && "border-slate-400 text-slate-700"
          )}
          onClick={() => setActiveComponent("chat")}
        >
          <MessageCircle className="h-10 w-10" />
        </button>
      </nav>
      <div className="col-span-11 h-[95vh]">
        {activeComponent === "vision" ? <VisionContainer /> : <ChatContainer />}
      </div>
    </main>
  );
}
