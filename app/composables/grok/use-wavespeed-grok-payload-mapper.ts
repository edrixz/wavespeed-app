import type { GrokEditPayload } from "~/types";

export const useWavespeedGrokPayloadMapper = () => {
  const { setStatus } = useLogger();
  const { uploadFile } = useFileUpload();

  const imageStore = useImagesStore();
  const { images, filesToUpload } = storeToRefs(imageStore);

  const payloadStore = useGrokPayloadStore();
  const { prompt, enableSafetyChecker, enableBase64Output, enableSyncMode } =
    storeToRefs(payloadStore);

  const buildPayload = async (): Promise<GrokEditPayload> => {
    let finalImageUrl: string = "";

    // Collect existing URLs
    if (
      images.value[0] &&
      images.value[0].url.startsWith("http") &&
      !images.value[0].url.startsWith("blob:")
    ) {
      finalImageUrl = images.value[0].url;
    }

    // Upload new files if present
    if (filesToUpload.value.length > 0) {
      setStatus("Uploading image...", "loading");

      finalImageUrl = await uploadFile(filesToUpload.value[0]!);
      setStatus("Upload complete.", "success");
    }

    return {
      enable_base64_output: enableBase64Output.value,
      enable_sync_mode: enableSyncMode.value,
      enable_safety_checker: enableSafetyChecker.value,
      prompt: prompt.value,
      image: finalImageUrl,
    };
  };

  const submitTask = async (payload: GrokEditPayload): Promise<string> => {
    const response: any = await $fetch("/api/grok/generate", {
      method: "POST",
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
