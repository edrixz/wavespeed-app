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
      // KIỂM TRA NẾU LÀ LỖI HỦY BỎ
      if (err.name === "AbortError" || err.message?.includes("aborted")) {
        console.log("User cancelled the request");
        // Hiển thị thông báo nhẹ nhàng thay vì báo lỗi đỏ
        setStatus("Analysis cancelled by user.", "info");
      } else {
        // ĐÂY MỚI LÀ LỖI THỰC SỰ (Network, Server, Gemini...)
        console.error("Actual error:", err);
        setStatus("Gemini analysis failed. Please try again.", "error");
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
