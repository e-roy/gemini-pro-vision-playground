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

interface TemperatureSelectorProps {
  value: number;
  onValueChange: (newValue: number[]) => void;
}

export function TemperatureSelector({
  value,
  onValueChange,
}: TemperatureSelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="temperature"
              max={1}
              defaultValue={[value]}
              step={0.1}
              onValueChange={onValueChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Temperature"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="right"
        >
          Temperature controls the degree of randomness in token selection.
          Lower temperatures are good for prompts that expect a true or correct
          response, while higher temperatures can lead to more diverse or
          unexpected results. With a temperature of 0 the highest probability
          token is always selected. For most use cases, try starting with a
          temperature of 0.2.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
