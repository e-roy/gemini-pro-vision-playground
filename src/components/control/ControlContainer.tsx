// components/control/ControlContainer.tsx
import { SafetySelector } from "./SafetySelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageUploadComponent from "../ImageUploadComponent";
import { useControlContext } from "@/providers/ControlContext";

import { ChevronDown } from "lucide-react";
import { SettingsSelector } from "./SettingsSelector";

import { settings_data } from "./settings_data";

export const ControlContainer = () => {
  const {
    selectedModel,
    generalSettings,
    handleGeneralSettingsChange,
    safetySettings,
    handleModelChange,
    handleSafetyChange,
    handleFirstMediaUpload,
    handleSecondMediaUpload,
  } = useControlContext();

  return (
    <div className="space-y-2 col-span-3 py-4">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`border w-full rounded flex justify-between p-2`}
          >
            <div>Model:</div>
            <div className={`flex`}>
              {selectedModel} <ChevronDown className="h-4 w-4 my-auto ml-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`w-full`}>
            <DropdownMenuItem
              className={`w-full`}
              onClick={() => handleModelChange("gemini-pro")}
            >
              gemini-pro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleModelChange("gemini-pro-vision")}
            >
              gemini-pro-vision
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={``}>
        <SettingsSelector
          label={settings_data.temperature.label}
          hoverText={settings_data.temperature.hoverText}
          step={settings_data.temperature.step}
          max={settings_data.temperature.max}
          value={generalSettings.temperature}
          onValueChange={(newValue) =>
            handleGeneralSettingsChange("temperature", newValue[0])
          }
        />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Advanced Settings</AccordionTrigger>

            <AccordionContent>
              <SettingsSelector
                label={settings_data.maxLength.label}
                hoverText={settings_data.maxLength.hoverText}
                step={settings_data.maxLength.step}
                max={selectedModel === "gemini-pro-vision" ? 2048 : 8192}
                value={generalSettings.maxLength}
                onValueChange={(newValue) =>
                  handleGeneralSettingsChange("maxLength", newValue[0])
                }
              />
              <SettingsSelector
                label={settings_data.topP.label}
                hoverText={settings_data.topP.hoverText}
                step={settings_data.topP.step}
                max={settings_data.topP.max}
                value={generalSettings.topP}
                onValueChange={(newValue) =>
                  handleGeneralSettingsChange("topP", newValue[0])
                }
              />
              <SettingsSelector
                label={settings_data.topK.label}
                hoverText={settings_data.topK.hoverText}
                step={settings_data.topK.step}
                max={settings_data.topK.max}
                value={generalSettings.topK}
                onValueChange={(newValue) =>
                  handleGeneralSettingsChange("topK", newValue[0])
                }
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Safety Settings</AccordionTrigger>
            <AccordionContent>
              <p>
                Adjust how likely you are to see responses that could be
                harmful. Content is blocked based on the probability that it is
                harmful.
              </p>
              <SafetySelector
                label="Harassment"
                value={safetySettings.harassment}
                onValueChange={(newValue) =>
                  handleSafetyChange("harassment", newValue)
                }
              />
              <SafetySelector
                label="Hate Speech"
                value={safetySettings.hateSpeech}
                onValueChange={(newValue) =>
                  handleSafetyChange("hateSpeech", newValue)
                }
              />
              <SafetySelector
                label="Sexually Explicit"
                value={safetySettings.sexuallyExplicit}
                onValueChange={(newValue) =>
                  handleSafetyChange("sexuallyExplicit", newValue)
                }
              />
              <SafetySelector
                label="Dangerous Content"
                value={safetySettings.dangerousContent}
                onValueChange={(newValue) =>
                  handleSafetyChange("dangerousContent", newValue)
                }
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {selectedModel === "gemini-pro-vision" && (
        <div className={`flex w-full gap-4`}>
          <ImageUploadComponent onFileUpload={handleFirstMediaUpload} />
          <ImageUploadComponent onFileUpload={handleSecondMediaUpload} />
        </div>
      )}
    </div>
  );
};
