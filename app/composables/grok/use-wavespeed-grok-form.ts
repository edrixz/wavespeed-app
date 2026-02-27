export const useUseWavespeedGrokForm = () => {
  const toast = useSystemToast();
  const payloadStore = useGrokPayloadStore();

  const { prompt, enableSafetyChecker, enableSyncMode, enableBase64Output } =
    storeToRefs(payloadStore);

  // --- LOGIC: Reset ---
  const resetToDefault = () => {
    payloadStore.resetPrompt();
  };

  return {
    prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,

    // Computed & Methods
    resetToDefault,
  };
};
