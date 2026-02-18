import { defineStore } from "pinia";
import { ref } from "vue";
import { DEFAULT_NEGATIVE_PROMPT, DEFAULT_PROMPT } from "~/consts";

export const useSeedreamPayloadStore = defineStore(
  "seedreamPayloadStore",
  () => {
    const modelVersion = ref("v4.5");
    const width = ref(2752);
    const height = ref(4096);
    const prompt = ref(DEFAULT_PROMPT);
    const negative_prompt = ref(DEFAULT_NEGATIVE_PROMPT);
    const enableSafetyChecker = ref(false);
    const enableSyncMode = ref(false);
    const enableBase64Output = ref(false);

    const resetPrompt = () => {
      prompt.value = DEFAULT_PROMPT;
      negative_prompt.value = DEFAULT_NEGATIVE_PROMPT;
    };

    const resetToDefault = () => {
      resetPrompt();
      width.value = 2752;
      height.value = 4096;
      enableSafetyChecker.value = false;
      enableSyncMode.value = false;
      enableBase64Output.value = false;
    };

    return {
      modelVersion,
      prompt,
      negative_prompt,
      width,
      height,
      enableSafetyChecker,
      enableSyncMode,
      enableBase64Output,
      resetPrompt,
      resetToDefault,
    };
  },
);
