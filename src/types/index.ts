export type MediaData = {
  data: string;
  mimeType: string;
};

export type GeneralSettings = {
  temperature: number;
  maxLength: number;
  topP: number;
  topK: number;
};

export type SafetySettings = {
  harassment: number;
  hateSpeech: number;
  sexuallyExplicit: number;
  dangerousContent: number;
};
