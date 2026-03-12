// app/composables/grok/use-wavespeed-grok-payload-mapper.ts
import type { GrokEditPayload } from "~/types";

export const useWavespeedGrokPayloadMapper = () => {
  const { setStatus } = useLogger();
  const { uploadImage } = useUploadToSupabase();

  const imageStore = useImagesStore();
  const { images, filesToUpload } = storeToRefs(imageStore);

  const payloadStore = useGrokPayloadStore();
  const { prompt, enableSafetyChecker, enableBase64Output, enableSyncMode } =
    storeToRefs(payloadStore);

  /**
   * Build payload for Grok generation, including uploading a pending image to Supabase
   * @returns {Promise<GrokEditPayload>} The formatted payload
   */
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

    // Upload new file to Supabase if present
    if (filesToUpload.value.length > 0) {
      setStatus("Uploading image to Supabase...", "loading");

      const uploadedUrl = await uploadImage(
        filesToUpload.value[0]!,
        "tmp-files",
      );

      if (!uploadedUrl) {
        throw new Error("Failed to upload image to Supabase.");
      }

      finalImageUrl = uploadedUrl;
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

  /**
   * Submit the Grok task to the backend API
   * @param {GrokEditPayload} payload - The generation payload
   * @returns {Promise<string>} The Task ID
   */
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
