import { useLogger } from "~/composables";
import type { AnalyzedData, AnalyzeResponse } from "~/types";

export const useImageAnalyzer = () => {
  const { setStatus } = useLogger();
  const aiStore = useAiGeneratedPromptStore();
  const promptStore = usePromptBuilderStore();

  const analyzingMode = ref<"fast" | "pro" | null>(null); // Để hiển thị loading spinner riêng

  // --- HELPER: CHUYỂN BLOB URL -> BASE64 ---
  // Hàm này chạy ở Client, giúp biến đổi link "blob:..." thành chuỗi "data:image..."
  const blobToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      // 1. Fetch blob ngay trong trình duyệt
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // 2. Đọc blob thành Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      setStatus("Failed to convert blob to base64.", "error");
      return "";
    }
  };

  const analyzeImage = async (
    imageInput: string,
    mode: "fast" | "pro" = "fast"
  ) => {
    const subjectId = promptStore.activeSubjectId;
    if (!subjectId) return null;

    // Nếu đang có một yêu cầu khác chạy cho Subject này, hãy hủy nó trước
    aiStore.cancelAnalysis(subjectId);

    // 1. Khởi tạo Controller mới
    const controller = new AbortController();
    aiStore.setAnalyzing(subjectId, true, controller);
    setStatus("Gemini AI is analyzing...", "loading");

    try {
      let finalBase64 = imageInput;
      if (imageInput.startsWith("blob:")) {
        finalBase64 = await blobToBase64(imageInput);
      }

      // 2. Truyền signal vào $fetch
      const response = await $fetch<AnalyzeResponse>("/api/analyze-image", {
        method: "POST",
        signal: controller.signal, // Gắn "ngòi nổ" hủy bỏ tại đây
        body: { imageBase64: finalBase64, mode, subjectId },
      });

      const result = (response as any)?.result as AnalyzedData;
      if (result) mapMagicFillToStore(result);

      return result;
    } catch (err: any) {
      // 1. Kiểm tra nếu là hành động CANCEL từ người dùng
      if (err.name === "AbortError" || err.message?.includes("aborted")) {
        setStatus("Analysis cancelled.", "info");
        return null;
      }

      // 2. BẮT LỖI 429 TỪ TRONG MESSAGE
      let friendlyMessage = "Gemini is busy. Please try again later.";
      let isQuotaError = false;

      try {
        // Vì err.message là một chuỗi JSON (như bạn đã show)
        const errorBody = JSON.parse(err.data.message);

        // Kiểm tra mã code 429 nằm bên trong object error
        if (
          errorBody.error?.code === 429 ||
          errorBody.error?.status === "RESOURCE_EXHAUSTED"
        ) {
          isQuotaError = true;

          // Tìm thời gian chờ (retryDelay) trong details
          const retryInfo = errorBody.error?.details?.find((d: any) =>
            d["@type"]?.includes("RetryInfo")
          );

          if (retryInfo?.retryDelay) {
            friendlyMessage = `Quota reached. Please retry in ${retryInfo.retryDelay}.`;
          } else {
            friendlyMessage =
              "Pro quota exceeded. Please wait a moment or use Magic Fill.";
          }
        }
      } catch (parseErr) {
        // Nếu message không phải JSON hoặc parse lỗi, ta dùng regex quét chuỗi thô
        if (err.message?.includes("429") || err.message?.includes("quota")) {
          isQuotaError = true;
          const match = err.message.match(/retry in ([\d\.]+s)/);
          friendlyMessage = match
            ? `Quota reached. Retry in ${match[1]}.`
            : "Pro limit reached. Please try again later.";
        }
      }

      // 3. Hiển thị thông báo
      setStatus(friendlyMessage, "error");

      if (isQuotaError) {
        console.warn("Gemini Rate Limit:", friendlyMessage);
      } else {
        console.error("Actual Server Error:", err);
      }

      return null;
    } finally {
      aiStore.setAnalyzing(subjectId, false);
    }
  };

  return {
    isAnalyzing: computed(() =>
      aiStore.isSubjectAnalyzing(promptStore.activeSubjectId || "")
    ),
    analyzingMode,
    analyzeImage,
    cancelAnalysis: aiStore.cancelAnalysis,
  };
};
