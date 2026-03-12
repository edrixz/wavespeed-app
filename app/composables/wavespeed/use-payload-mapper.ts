// app/composables/wavespeed/use-payload-mapper.ts
import type { seedreamEditPayload } from "~/types";

export const usePayloadMapper = () => {
  const { setStatus } = useLogger();
  const { uploadImage } = useUploadToSupabase();

  const imageStore = useImagesStore();
  const { images, filesToUpload } = storeToRefs(imageStore);

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
    const finalImageUrls: string[] = [];

    // Collect existing URLs
    images.value.forEach((img) => {
      if (img.url.startsWith("http") && !img.url.startsWith("blob:"))
        finalImageUrls.push(img.url);
    });

    // Upload new files to Supabase if present
    if (filesToUpload.value.length > 0) {
      setStatus(
        `Uploading ${filesToUpload.value.length} images to Supabase...`,
        "loading",
      );

      // Upload multiple files concurrently
      const uploadPromises = filesToUpload.value.map((file) =>
        uploadImage(file, "tmp-files"),
      );

      const uploadedUrls = await Promise.all(uploadPromises);

      // Filter out failed uploads (null values)
      const validUrls = uploadedUrls.filter(
        (url): url is string => url !== null,
      );

      if (validUrls.length !== filesToUpload.value.length) {
        throw new Error("Some images failed to upload to Supabase.");
      }

      finalImageUrls.push(...validUrls);
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
