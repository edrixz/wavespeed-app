export const useWavespeedGrokApiGenerate = () => {
  const galleryStore = useGalleryStore();
  const { setStatus } = useLogger();
  const loggerStore = useLoggerStore();
  const { buildPayload, submitTask } = useWavespeedGrokPayloadMapper();
  const { pollTask } = usePolling();
  const { handleError, handleSuccess } = useResponseHandler();

  const imageStore = useImagesStore();
  const { images } = storeToRefs(imageStore);

  const payloadStore = useGrokPayloadStore();
  const { prompt } = storeToRefs(payloadStore);

  const isProcessing = ref(false);
  const resultImage = ref<string | null>(null);

  const handleGenerate = async () => {
    if (!images.value.length) {
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
      });

      handleSuccess("Complete! Image is ready.");
    } catch (error: any) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError("An unknown error occurred");
      }
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
