import { defineStore } from "pinia";
import { ref } from "vue";
import { DEFAULT_NEGATIVE_PROMPT, DEFAULT_PROMPT } from "~/consts";

type Quality = "low" | "medium" | "high";
type Resolution = "1k" | "2k" | "4k";
type AspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3"
  | "4:5"
  | "5:4"
  | "21:9";

export const useGptImagePayloadStore = defineStore(
  "gptImagePayloadStore",
  () => {
    const prompt = ref(DEFAULT_PROMPT);
    const negative_prompt = ref(DEFAULT_NEGATIVE_PROMPT);
    const aspectRatio = ref<AspectRatio>("2:3");
    const resolution = ref<Resolution>("4k");
    const quality = ref<Quality>("high");
    const enableSafetyChecker = ref(false);
    const enableSyncMode = ref(false);
    const enableBase64Output = ref(false);

    const resetPrompt = () => {
      prompt.value = DEFAULT_PROMPT;
      negative_prompt.value = DEFAULT_NEGATIVE_PROMPT;
    };

    const resetToDefault = () => {
      resetPrompt();
      aspectRatio.value = "2:3";
      resolution.value = "4k";
      quality.value = "high";
      enableSafetyChecker.value = false;
      enableSyncMode.value = false;
      enableBase64Output.value = false;
    };

    return {
      prompt,
      negative_prompt,
      quality,
      resolution,
      aspectRatio,
      enableSafetyChecker,
      enableSyncMode,
      enableBase64Output,
      resetPrompt,
      resetToDefault,
    };
  },
);
