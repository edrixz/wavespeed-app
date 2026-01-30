import { useLogger } from "~/composables/common/use-logger";
import { useFileUpload } from "~/composables/common/use-file-upload";
import { useMoondreamQueryStore } from "~/stores/wavespeed/moondream-query-store";
import { useLoggerStore } from "~/stores/common/ui/logger-store";
import type { MoondreamRequestBody } from "~/types/api/moondream-query";

export const useMoondreamQuery = () => {
  const store = useMoondreamQueryStore();
  const loggerStore = useLoggerStore();
  const { setStatus } = useLogger();
  const { uploadFile } = useFileUpload();

  const generateActionPrompt = async (imageInput: File | string) => {
    store.isGenerating = true;
    store.result = "";
    loggerStore.startGroup(`Moondream Analysis`);

    try {
      let publicImageUrl = "";

      // 1. Xử lý upload ảnh (Giữ nguyên logic cũ)
      if (typeof imageInput === "string" && imageInput.startsWith("http")) {
        publicImageUrl = imageInput;
      } else {
        setStatus("Uploading image...", "loading");
        let fileToUpload: File;

        if (typeof imageInput === "string" && imageInput.startsWith("blob:")) {
          const res = await fetch(imageInput);
          const blob = await res.blob();
          fileToUpload = new File([blob], "image.png", { type: blob.type });
        } else if (imageInput instanceof File) {
          fileToUpload = imageInput;
        } else {
          throw new Error("Invalid image");
        }
        publicImageUrl = await uploadFile(fileToUpload);
      }

      // 2. TẠO PAYLOAD PHẲNG (FLAT)
      setStatus("Analyzing...", "loading");

      const payload: MoondreamRequestBody = {
        image: publicImageUrl, // Key là 'image' chứ không phải 'imageUrl'
        prompt: store.customPrompt,
        enable_sync_mode: store.settings.enable_sync_mode,
        enable_safety_checker: store.settings.enable_safety_checker,
        reasoning: store.settings.reasoning,
      };

      const response = await $fetch<{ result: string }>(
        "/api/moondream-query",
        {
          method: "POST",
          body: payload,
        },
      );

      if (response?.result) {
        store.result = response.result;
        setStatus("Done!", "success");
        return response.result;
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`, "error");
      return null;
    } finally {
      store.isGenerating = false;
      loggerStore.endGroup();
    }
  };

  return {
    // ... exports giữ nguyên
    isGenerating: computed(() => store.isGenerating),
    result: computed(() => store.result),
    settings: store.settings,
    customPrompt: computed({
      get: () => store.customPrompt,
      set: (v) => (store.customPrompt = v),
    }),
    generateActionPrompt,
  };
};
