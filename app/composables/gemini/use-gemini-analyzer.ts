// app/composables/gemini/use-gemini-analyzer.ts
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useClipboard } from "@vueuse/core";

export const useGeminiAnalyzer = () => {
  const imageStore = useImagesStore();
  const { images, filesToUpload } = storeToRefs(imageStore);
  const { uploadImage } = useUploadToSupabase();
  const { setStatus } = useLogger();

  const isAnalyzing = ref<boolean>(false);
  const hasError = ref<boolean>(false);

  const analysisResult = ref<string | null>(null);
  const promptResult = ref<string | null>(null);

  // State cho Modal xem chi tiết phân tích
  const isAnalysisModalOpen = ref<boolean>(false);

  const { copy, copied } = useClipboard();

  const canNotAnalyze = computed<boolean>(
    () =>
      isAnalyzing.value ||
      (images.value.length === 0 && filesToUpload.value.length === 0),
  );

  const handleAnalyze = async () => {
    if (canNotAnalyze.value) return;

    isAnalyzing.value = true;
    hasError.value = false;
    analysisResult.value = null;
    promptResult.value = null;
    isAnalysisModalOpen.value = false;

    try {
      setStatus("Preparing image...", "loading");
      let finalImageUrl = "";

      if (
        images.value[0] &&
        images.value[0].url.startsWith("http") &&
        !images.value[0].url.startsWith("blob:")
      ) {
        finalImageUrl = images.value[0].url;
      } else if (filesToUpload.value.length > 0) {
        setStatus("Uploading image...", "loading");
        // Cập nhật tên bucket thành tmp-files
        const uploadedUrl = await uploadImage(
          filesToUpload.value[0]!,
          "tmp-files",
        );

        if (!uploadedUrl) throw new Error("Failed to upload image.");
        finalImageUrl = uploadedUrl;
      }

      if (!finalImageUrl) throw new Error("No valid image found for analysis.");

      setStatus("Analyzing image with Gemini...", "loading");
      const response: any = await $fetch("/api/gemini/analyze", {
        method: "POST",
        body: {
          imageUrl: finalImageUrl,
        },
      });

      const rawText = response.data || "";
      const splitToken = "[SPLIT_TOKEN_HERE]";

      if (rawText.includes(splitToken)) {
        const parts = rawText.split(splitToken);

        // Sử dụng Regex để xóa dòng tiêu đề dù AI có gõ có dấu hay không dấu
        let partA = parts[0]
          .replace(/PH(A|Ầ)N A:.*?\n/i, "")
          .replace("PHAN A: PHAN TICH TIENG VIET", "") // Backup fallback
          .trim();
        analysisResult.value = partA;

        let partB = parts[1]
          .replace(/PH(A|Ầ)N B:.*?\n/i, "")
          .replace("PHAN B: PROMPT TIENG ANH", "") // Backup fallback
          .trim();
        promptResult.value = partB;
      } else {
        analysisResult.value = rawText;
        promptResult.value = "";
      }

      setStatus("Analysis complete!", "success");
    } catch (error: any) {
      hasError.value = true;
      setStatus(error.message || "An error occurred during analysis.", "error");
      console.error("[Gemini Analyzer Error]:", error);
    } finally {
      isAnalyzing.value = false;
    }
  };

  const handleCopyPrompt = () => {
    if (promptResult.value) {
      copy(promptResult.value);
      setStatus("Đã copy prompt!", "success");
    }
  };

  return {
    isAnalyzing,
    hasError,
    analysisResult,
    promptResult,
    isAnalysisModalOpen,
    canNotAnalyze,
    handleAnalyze,
    handleCopyPrompt,
    copied,
  };
};
