export const useUseWavespeedSeedreamForm = () => {
  const toast = useToast();
  const payloadStore = useSeedreamPayloadStore();

  const {
    modelVersion,
    width,
    height,
    prompt,
    negative_prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
  } = storeToRefs(payloadStore);

  const isVersionV45 = computed(() => modelVersion.value === "v4.5");

  const toggleVersionMode = () => {
    modelVersion.value = modelVersion.value === "v4" ? "v4.5" : "v4";
  };

  // --- LOGIC: Reset ---
  const resetToDefault = () => {
    payloadStore.resetPrompt();
    width.value = 2752;
    height.value = 4096;
  };

  return {
    // State
    isVersionV45,
    prompt,
    negative_prompt,
    width,
    height,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,

    // Computed & Methods
    resetToDefault,
    toggleVersionMode,
  };
};
