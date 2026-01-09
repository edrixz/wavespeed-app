import { useLogger } from "~/composables/common";
import type { seedreamEditPayload } from "~/types";

export const usePayloadMapper = () => {
  const { setStatus } = useLogger();
  const { uploadMultipleFiles } = useFileUpload();

  const imageStore = useImageStore();
  const { images, filesToUpload } = storeToRefs(imageStore);

  const payloadStore = useWavespeedPayloadStore();
  const {
    modelVersion,
    prompt,
    negative_prompt,
    width,
    height,
    enableSafetyChecker,
    enableBase64Output,
    enableSyncMode,
  } = storeToRefs(payloadStore);

  const buildPayload = async (): Promise<seedreamEditPayload> => {
    const finalImageUrls: string[] = [];

    // Collect existing URLs
    images.value.forEach((img) => {
      if (img.url.startsWith("http") && !img.url.startsWith("blob:"))
        finalImageUrls.push(img.url);
    });

    // Upload new files if present
    if (filesToUpload.value.length > 0) {
      setStatus(`Uploading ${filesToUpload.value.length} images...`, "loading");

      const uploadedUrls = await uploadMultipleFiles(filesToUpload.value);
      finalImageUrls.push(...uploadedUrls);
      setStatus("Upload complete.", "success");
    }

    return {
      enable_base64_output: enableBase64Output.value,
      enable_sync_mode: enableSyncMode.value,
      enable_safety_checker: enableSafetyChecker.value,
      prompt: prompt.value,
      negative_prompt: negative_prompt.value,
      images: finalImageUrls,
      size: `${width.value}*${height.value}`,
    };
  };

  const submitTask = async (payload: seedreamEditPayload): Promise<string> => {
    const response: any = await $fetch("/api/generate", {
      method: "POST",
      headers: {
        "x-model-version": modelVersion.value,
      },
      body: payload,
    });

    if (!response?.data?.id) throw new Error("No Task ID received");
    return response.data.id;
  };

  return {
    buildPayload,
    submitTask,
  };
};
