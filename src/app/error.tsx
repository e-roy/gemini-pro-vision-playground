"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Error({ error, reset }: any) {
  React.useEffect(() => {
    console.log("logging error:", error);
  }, [error]);

  return (
    <main className="h-full bg-cover bg-top sm:bg-top">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-sm font-semibold text-slate-700 text-opacity-50 uppercase tracking-wide">
          app error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          {`Uh oh! Something went wrong.`}
        </h1>
        <p className="mt-2 text-2xl font-medium text-slate-800 text-opacity-50">
          {`It looks like the app has encountered an error:`}
        </p>
        <p className="mt-2 text-2xl font-medium text-red-500">
          {error?.message}
        </p>
        <div className="mt-6">
          <Button type={`button`} onClick={() => reset()}>
            Try Again
          </Button>

          <p className="mt-2 text-xl font-medium text-slate-800 text-opacity-50">
            {`If trying again doesn't work, please refresh the url`}
          </p>
        </div>
      </div>
    </main>
  );
}
