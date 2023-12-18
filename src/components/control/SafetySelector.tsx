// componets/control/SafetySelector.tsx
"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SafetySelectorProps {
  label: string;
  value: number;
  onValueChange: (newValue: number[]) => void;
}

export function SafetySelector({
  label,
  value,
  onValueChange,
}: SafetySelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-p">{label}</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value === 0
                  ? "none"
                  : value === 1
                  ? "few"
                  : value === 2
                  ? "some"
                  : "most"}
              </span>
            </div>
            <Slider
              id="top-p"
              max={3}
              defaultValue={[value]}
              step={1}
              onValueChange={onValueChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Top P"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="right"
        >
          Block medium or high probability of being harmful.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
