// app/composables/wavespeed/use-payload-mapper.ts
import type { seedreamEditPayload } from "~/types";

export const usePayloadMapper = () => {
  const { setStatus } = useLogger();
  const { uploadImage } = useUploadToSupabase();

  const imageStore = useImagesStore();
  const { images } = storeToRefs(imageStore);

  const payloadStore = useSeedreamPayloadStore();
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

  /**
   * Build payload for Seedream generation, including uploading pending images to Supabase
   * @returns {Promise<seedreamEditPayload>} The formatted payload
   */
  const buildPayload = async (): Promise<seedreamEditPayload> => {
    // Upload LOCAL files concurrently first, preserving their index mapping
    const localEntries = images.value
      .map((img, idx) => ({ img, idx }))
      .filter((e) => e.img.type === "LOCAL" && e.img.file);

    let uploadedMap = new Map<number, string>();

    if (localEntries.length > 0) {
      setStatus(
        `Uploading ${localEntries.length} images to Supabase...`,
        "loading",
      );

      const uploadPromises = localEntries.map((e) =>
        uploadImage(e.img.file!, "tmp-files"),
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      // Validate all uploads succeeded
      const failedCount = uploadedUrls.filter((url) => url === null).length;
      if (failedCount > 0) {
        throw new Error("Some images failed to upload to Supabase.");
      }

      // Map each uploaded URL back to its original index
      localEntries.forEach((e, i) => {
        uploadedMap.set(e.idx, uploadedUrls[i] as string);
      });

      setStatus("Upload complete.", "success");
    }

    // Build final URLs array in the exact same order as the UI
    const finalImageUrls: string[] = images.value.map((img, idx) => {
      if (uploadedMap.has(idx)) return uploadedMap.get(idx)!;
      return img.url;
    });

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

  /**
   * Submit the generation task to the backend API
   * @param {seedreamEditPayload} payload - The generation payload
   * @returns {Promise<string>} The Task ID
   */
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
