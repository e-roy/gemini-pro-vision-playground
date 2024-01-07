// lib/safety-settings-mapper.ts
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const mapSafetyValueToThreshold = (
  value: number
): HarmBlockThreshold => {
  switch (value) {
    case 0:
      return HarmBlockThreshold.BLOCK_NONE;
    case 1:
      return HarmBlockThreshold.BLOCK_LOW_AND_ABOVE;
    case 2:
      return HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE;
    case 3:
      return HarmBlockThreshold.BLOCK_ONLY_HIGH;
    default:
      return HarmBlockThreshold.BLOCK_NONE;
  }
};

export const defaultSafetySettings = {
  harassment: 0,
  hateSpeech: 0,
  sexuallyExplicit: 0,
  dangerousContent: 0,
};

export const mapSafetySettings = (
  safetySettings: typeof defaultSafetySettings
) => [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: mapSafetyValueToThreshold(safetySettings.harassment),
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: mapSafetyValueToThreshold(safetySettings.hateSpeech),
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: mapSafetyValueToThreshold(safetySettings.sexuallyExplicit),
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: mapSafetyValueToThreshold(safetySettings.dangerousContent),
  },
];
