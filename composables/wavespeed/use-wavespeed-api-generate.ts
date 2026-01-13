import { useLogger } from "~/composables/common";
import { usePayloadMapper } from "./use-payload-mapper";
import { usePolling } from "./use-polling";
import { useResponseHandler } from "./use-response-handler";
import { useGalleryStore } from "~/stores/common/ui/gallery-store";

export const useWavespeedApiGenerate = () => {
  const galleryStore = useGalleryStore();
  const { setStatus } = useLogger();
  const loggerStore = useLoggerStore();
  const { buildPayload, submitTask } = usePayloadMapper();
  const { pollTask } = usePolling();
  const { handleError, handleSuccess } = useResponseHandler();

  const imageStore = useImageStore();
  const { images } = storeToRefs(imageStore);

  const payloadStore = useWavespeedPayloadStore();
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
      `Dreamer Process - ${new Date().toLocaleTimeString()}`
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
        negative_prompt: payloadStore.negative_prompt,
        size: `${payloadStore.width}*${payloadStore.height}`,
      });

      handleSuccess("Complete! Image is ready.");
    } catch (error: any) {
      handleError(error);
    } finally {
      isProcessing.value = false;
      // 2. KẾT THÚC NHÓM LOG
      loggerStore.endGroup();
    }
  };

  const isCanNotGenerate = computed(() => prompt.value === "");

  return { isProcessing, resultImage, isCanNotGenerate, handleGenerate };
};
