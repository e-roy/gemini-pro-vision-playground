"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TopPSelectorProps {
  value: number;
  onValueChange: (newValue: number[]) => void;
}

export function TopPSelector({ value, onValueChange }: TopPSelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-p">Top P</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="top-p"
              max={1}
              defaultValue={[value]}
              step={0.1}
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
          Top-p changes how the model selects tokens for output. Tokens are
          selected from most probable to least until the sum of their
          probabilities equals the top-p value. For example, if tokens A, B, and
          C have a probability of .3, .2, and .1 and the top-p value is .5, then
          the model will select either A or B as the next token (using
          temperature). The default top-p value is .8.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
