import { useImageStore } from "~/stores/image/image-store";
import { useGeminiPromptStore } from "~/stores/gemini/gemini-prompt-store";
import { useToast } from "~/composables/common/use-toast";
import type { ImageAnalysisResult } from "~/types/gemini/analyzed-data";

// Helper: Convert File Object sang Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useGeminiVision = () => {
  const imageStore = useImageStore();
  const geminiStore = useGeminiPromptStore();
  const toast = useToast();

  const isAnalyzing = ref(false);

  // Chỉ lấy ảnh LOCAL (đã upload từ máy)
  const validImages = computed(() =>
    imageStore.images.filter(
      (item) => item.file !== null && item.type === "LOCAL",
    ),
  );

  const analyzeCurrentImages = async () => {
    if (validImages.value.length === 0) {
      toast.warning("Vui lòng tải ảnh lên trước khi phân tích!");
      return;
    }

    isAnalyzing.value = true;
    toast.info("AI đang phân tích chi tiết ảnh...");

    try {
      // 1. Convert tất cả ảnh sang Base64
      const base64Images = await Promise.all(
        validImages.value.map((item) => fileToBase64(item.file as File)),
      );

      // 2. Gọi Server API
      const analyzedData = await $fetch<any[]>("/api/gemini/analyze-image", {
        method: "POST",
        body: {
          images: base64Images,
          mode: "pro", // Có thể đổi thành 'flash' để tiết kiệm
        },
      });

      // 3. Map kết quả trả về với ID ảnh gốc
      const mappedResults: ImageAnalysisResult[] = analyzedData.map(
        (data, index) => ({
          imageId: validImages.value[index].id,
          imageUrl: validImages.value[index].url,
          data: data,
        }),
      );

      // 4. Lưu vào Store (Store phải có action setResults nhận mảng)
      geminiStore.setResults(mappedResults);

      toast.success("Phân tích hoàn tất! Đang mở bảng chọn...");
    } catch (error) {
      console.error("Vision Error:", error);
      toast.error("Phân tích thất bại. Vui lòng thử lại.");
    } finally {
      isAnalyzing.value = false;
    }
  };

  const canAnalyze = computed(
    () => validImages.value.length > 0 && !isAnalyzing.value,
  );

  return {
    isAnalyzing,
    canAnalyze,
    analyzeCurrentImages,
  };
};
