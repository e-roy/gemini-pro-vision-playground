"use client";

import * as React from "react";
import { SliderProps } from "@radix-ui/react-slider";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MaxLengthSelectorProps {
  // defaultValue: SliderProps["defaultValue"];
  maxTokens: number;
  value: number;
  onValueChange: (newValue: number[]) => void;
}

export function MaxLengthSelector({
  // defaultValue,
  maxTokens,
  value,
  onValueChange,
}: MaxLengthSelectorProps) {
  // const [value, setValue] = React.useState(defaultValue);

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Maximum Length</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="maxlength"
              max={maxTokens}
              defaultValue={[value]}
              step={10}
              onValueChange={onValueChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Maximum Length"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Token limit determines the maximum amount of text output from one
          prompt. A token is approximately four characters. The default value is
          2048.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
