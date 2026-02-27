export const useUseWavespeedSeedreamForm = () => {
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

  const versionOptions = [
    { label: "v4", value: "v4" },
    { label: "v4.5", value: "v4.5" },
    { label: "v5 lite", value: "v5-lite" },
  ];

  // --- LOGIC: Reset ---
  const resetToDefault = () => {
    payloadStore.resetPrompt();
    width.value = 2752;
    height.value = 4096;
  };

  return {
    // State
    modelVersion,
    versionOptions,
    prompt,
    negative_prompt,
    width,
    height,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,

    // Computed & Methods
    resetToDefault,
  };
};
