export const useGptImageForm = () => {
  const payloadStore = useGptImagePayloadStore();

  const {
    aspectRatio,
    resolution,
    quality,
    prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
  } = storeToRefs(payloadStore);

  // --- LOGIC: Reset ---
  const resetToDefault = () => {
    payloadStore.resetPrompt();
    aspectRatio.value = "2:3";
    resolution.value = "4k";
    quality.value = "high";
  };

  return {
    // State
    aspectRatio,
    resolution,
    quality,
    prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,

    // Computed & Methods
    resetToDefault,
  };
};
