"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TopKSelectorProps {
  value: number;
  onValueChange: (newValue: number[]) => void;
}

export function TopKSelector({ value, onValueChange }: TopKSelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-p">Top K</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="top-p"
              max={40}
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
          side="left"
        >
          Top-k changes how the model selects tokens for output. A top-k of 1
          means the selected token is the most probable among all tokens in the
          model’s vocabulary (also called greedy decoding), while a top-k of 3
          means that the next token is selected from among the 3 most probable
          tokens (using temperature). The default top-k value is 40.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
