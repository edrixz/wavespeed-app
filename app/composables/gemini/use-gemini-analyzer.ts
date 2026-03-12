// app/composables/gemini/use-gemini-analyzer.ts
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useClipboard } from "@vueuse/core";

type PromptSections = {
  subject: string;
  clothing: string;
  setting: string;
  style: string;
  vibe: string;
  full: string;
};

export const useGeminiAnalyzer = () => {
  const imageStore = useImagesStore();
  const { images, filesToUpload } = storeToRefs(imageStore);
  const { uploadImage } = useUploadToSupabase();
  const { setStatus } = useLogger();
  const { copy } = useClipboard();

  const isAnalyzing = ref<boolean>(false);
  const analysisResult = ref<string | null>(null);
  const promptResult = ref<PromptSections | null>(null);

  // Quản lý trạng thái đã copy cho từng phần
  const copiedState = ref<Record<string, boolean>>({});

  const extractSection = (
    text: string,
    startKey: string,
    endKey: string,
  ): string => {
    const startIdx = text.indexOf(startKey);
    if (startIdx === -1) return "";
    const contentStart = startIdx + startKey.length;
    const endIdx = endKey ? text.indexOf(endKey) : text.length;
    return text.slice(contentStart, endIdx).trim();
  };

  const handleAnalyze = async () => {
    if (isAnalyzing.value) return;
    isAnalyzing.value = true;
    promptResult.value = null;
    copiedState.value = {};

    try {
      let finalImageUrl = "";
      if (
        images.value[0]?.url.startsWith("http") &&
        !images.value[0].url.startsWith("blob:")
      ) {
        finalImageUrl = images.value[0].url;
      } else if (filesToUpload.value.length > 0) {
        const uploadedUrl = await uploadImage(
          filesToUpload.value[0]!,
          "tmp-files",
        );
        finalImageUrl = uploadedUrl || "";
      }

      const response: any = await $fetch("/api/gemini/analyze", {
        method: "POST",
        body: { imageUrl: finalImageUrl },
      });

      const rawText = response.data || "";
      const splitToken = "[SPLIT_TOKEN_HERE]";

      if (rawText.includes(splitToken)) {
        const parts = rawText.split(splitToken);
        analysisResult.value = parts[0]!
          .replace(/PH(A|Ầ)N A:.*?\n/i, "")
          .trim();
        const englishText = parts[1]!.replace(/PH(A|Ầ)N B:.*?\n/i, "").trim();

        promptResult.value = {
          subject: extractSection(englishText, "1. THE SUBJECT", "2. CLOTHING"),
          clothing: extractSection(
            englishText,
            "2. CLOTHING AND ACCESSORIES",
            "3. SETTING",
          ),
          setting: extractSection(
            englishText,
            "3. SETTING AND ATMOSPHERE",
            "4. PHOTOGRAPHY",
          ),
          style: extractSection(englishText, "4. PHOTOGRAPHY STYLE", "5. VIBE"),
          vibe: extractSection(englishText, "5. VIBE AND STORY", ""),
          full: englishText,
        };
      }
      setStatus("Phân tích hoàn tất!", "success");
    } catch (e) {
      setStatus("Lỗi phân tích", "error");
    } finally {
      isAnalyzing.value = false;
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    copy(text);
    copiedState.value[key] = true;
    setStatus(`Đã copy ${key}!`, "success");
    setTimeout(() => {
      copiedState.value[key] = false;
    }, 2000);
  };

  return {
    isAnalyzing,
    analysisResult,
    promptResult,
    handleAnalyze,
    handleCopy,
    copiedState,
  };
};
