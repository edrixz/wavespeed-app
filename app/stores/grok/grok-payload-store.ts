import { defineStore } from "pinia";
import { ref } from "vue";
import { DEFAULT_PROMPT } from "~/consts";

export const useGrokPayloadStore = defineStore("grokPayloadStore", () => {
  const prompt = ref(DEFAULT_PROMPT);
  const enableSafetyChecker = ref(false);
  const enableSyncMode = ref(false);
  const enableBase64Output = ref(false);

  const resetPrompt = () => {
    prompt.value = DEFAULT_PROMPT;
  };

  const resetToDefault = () => {
    resetPrompt();
    enableSafetyChecker.value = false;
    enableSyncMode.value = false;
    enableBase64Output.value = false;
  };

  return {
    prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
    resetPrompt,
    resetToDefault,
  };
});
