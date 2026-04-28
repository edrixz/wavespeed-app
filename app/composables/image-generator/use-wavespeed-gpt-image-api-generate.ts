export const useWavespeedGptImageApiGenerate = () => {
  const galleryStore = useGalleryStore();
  const { setStatus } = useLogger();
  const loggerStore = useLoggerStore();
  const { buildPayload, submitTask } = useWavespeedGptImagePayloadMapper();
  const { pollTask } = usePolling();
  const { handleError, handleSuccess } = useResponseHandler();
  const promptPresetStore = useGptImagePromptPresetStore();

  const imageStore = useImagesStore();
  const { images } = storeToRefs(imageStore);

  const payloadStore = useGptImagePayloadStore();
  const { prompt } = storeToRefs(payloadStore);

  const isProcessing = ref(false);
  const resultImage = ref<string | null>(null);

  const handleGenerate = async () => {
    if (images.value.length === 0) {
      setStatus("Please select at least 1 reference image!", "error");
      return;
    }

    isProcessing.value = true;
    resultImage.value = null;

    // 1. KHỞI TẠO NHÓM LOG
    loggerStore.startGroup(
      `Starting Process - ${new Date().toLocaleTimeString()}`,
    );
    setStatus("Starting processing...", "info");

    try {
      // Build payload with image upload
      setStatus("Preparing images...", "loading");
      const payload = await buildPayload();

      // Submit task
      setStatus("Sending request to AI...", "loading");
      const taskId = await submitTask(payload);
      setStatus(`Task ID: ${taskId}. Drawing (please wait)...`, "loading");

      // Poll for completion
      const finalUrl = await pollTask(taskId, (taskStatus) => {
        setStatus(`AI processing: ${taskStatus}...`, "loading");
      });

      resultImage.value = finalUrl;

      galleryStore.addGeneratedItem(finalUrl, {
        prompt: payloadStore.prompt,
        resolution: payloadStore.resolution,
        aspect_ratio: payloadStore.aspectRatio,
        quality: payloadStore.quality,
      });

      handleSuccess("Complete! Image is ready.");

      // Increment preset usage if one was actively applied
      if (promptPresetStore.activePresetId) {
        promptPresetStore.incrementUsageCount(promptPresetStore.activePresetId);
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      isProcessing.value = false;
      loggerStore.endGroup();
    }
  };

  const canNotGenerate = computed(
    () => prompt.value === "" || isProcessing.value,
  );

  return { isProcessing, resultImage, canNotGenerate, handleGenerate };
};
