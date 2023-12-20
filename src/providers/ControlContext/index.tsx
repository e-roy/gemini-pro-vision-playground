"use client";
// providers/ControlContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";

import { MediaData, SafetySettings, GeneralSettings } from "@/types";

interface ControlContextState {
  selectedModel: "gemini-pro" | "gemini-pro-vision";
  mediaDataList: MediaData[];
  handleMediaUpload: (data: string, mimeType: string, index: number) => void;
  removeMediaData: (index: number) => void;
  generalSettings: GeneralSettings;
  handleGeneralSettingsChange: (
    setting: keyof GeneralSettings,
    newValue: number
  ) => void;
  safetySettings: SafetySettings;
  handleModelChange: (model: "gemini-pro" | "gemini-pro-vision") => void;
  handleSafetyChange: (type: keyof SafetySettings, newValue: number[]) => void;
}

export const ControlContext = createContext<ControlContextState | undefined>(
  undefined
);

export const ControlProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<
    "gemini-pro" | "gemini-pro-vision"
  >("gemini-pro");

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    temperature: 0.2,
    maxLength: 2048,
    topP: 0.8,
    topK: 40,
  });

  const [safetySettings, setSafetySettings] = useState<SafetySettings>({
    harassment: 2,
    hateSpeech: 2,
    sexuallyExplicit: 2,
    dangerousContent: 2,
  });

  const [mediaDataList, setMediaDataList] = useState<MediaData[]>([]);

  const handleModelChange = (model: "gemini-pro" | "gemini-pro-vision") => {
    setSelectedModel(model);
  };

  const handleGeneralSettingsChange = (
    setting: keyof GeneralSettings,
    newValue: number
  ) => {
    setGeneralSettings((prevState) => ({
      ...prevState,
      [setting]: newValue,
    }));
  };

  const handleSafetyChange = (
    type: keyof SafetySettings,
    newValue: number[]
  ) => {
    setSafetySettings((prevState) => ({
      ...prevState,
      [type]: newValue[0],
    }));
  };

  const handleMediaUpload = (data: string, mimeType: string, index: number) => {
    setMediaDataList((prevMediaData) => {
      const newMediaData = [...prevMediaData];
      newMediaData[index] = { data, mimeType };
      return newMediaData;
    });
  };

  const removeMediaData = (index: number) => {
    setMediaDataList((prevMediaData) => {
      const newMediaData = [...prevMediaData];
      newMediaData.splice(index, 1);
      return newMediaData;
    });
  };

  return (
    <ControlContext.Provider
      value={{
        selectedModel,
        mediaDataList,
        handleMediaUpload,
        removeMediaData,
        generalSettings,
        handleGeneralSettingsChange,
        safetySettings,
        handleModelChange,
        handleSafetyChange,
      }}
    >
      {children}
    </ControlContext.Provider>
  );
};

export const useControlContext = () => {
  const context = useContext(ControlContext);
  if (context === undefined) {
    throw new Error("useControlContext must be used within a ControlProvider");
  }
  return context;
};
