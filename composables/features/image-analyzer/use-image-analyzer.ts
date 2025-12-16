import { useLogger } from "~/composables";
import type { AnalyzedData, AnalyzeResponse } from "~/types";

export const useImageAnalyzer = () => {
  const { setStatus } = useLogger();

  const isAnalyzing = ref(false);
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
  ): Promise<AnalyzedData | null> => {
    isAnalyzing.value = true;
    analyzingMode.value = mode;

    try {
      let finalBase64 = imageInput;

      // --- CHECK VÀ CHUYỂN ĐỔI ---
      // Nếu input là Blob URL (ví dụ: blob:http://localhost...) -> Convert sang Base64
      if (imageInput.startsWith("blob:")) {
        console.log("Converting Blob URL to Base64...");
        finalBase64 = await blobToBase64(imageInput);
        if (!finalBase64) throw new Error("Failed to convert blob to base64");
      }

      // Gửi Base64 chuẩn lên Server
      const { data, error } = await useFetch<AnalyzeResponse>(
        "/api/analyze-image",
        {
          method: "POST",
          body: {
            imageBase64: finalBase64,
            mode: mode,
          },
        }
      );

      if (error.value) throw new Error(error.value.message);

      return (data.value as any)?.result as AnalyzedData;
    } catch (err) {
      console.error(err);
      setStatus("Gemini analysis failed. Please try again.", "error");
      return null;
    } finally {
      isAnalyzing.value = false;
      analyzingMode.value = null;
    }
  };

  return { isAnalyzing, analyzingMode, analyzeImage };
};
