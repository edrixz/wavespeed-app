import { useImageStore } from "~/stores/image/image-store";
import { useGeminiPromptStore } from "~/stores/gemini/gemini-prompt-store";
import { useToast } from "~/composables/common/use-toast";

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

  // Computed: Lọc ra danh sách các item có file thực sự (loại bỏ ảnh Default Server)
  // Chúng ta cần cả ID để map kết quả, nên không dùng getter filesToUpload (chỉ trả về File[])
  const validImages = computed(() =>
    imageStore.images.filter(
      (item) => item.file !== null && item.type === "LOCAL",
    ),
  );

  const analyzeCurrentImages = async () => {
    // Check dựa trên validImages
    if (validImages.value.length === 0) {
      toast.warning("Vui lòng tải ảnh lên trước khi phân tích!");
      return;
    }

    isAnalyzing.value = true;
    toast.info("AI đang phân tích chi tiết ảnh...");

    try {
      // 1. Chuẩn bị ảnh Base64 từ File Object
      const base64Images = await Promise.all(
        validImages.value.map((item) => fileToBase64(item.file as File)),
      );

      // 2. Gọi API
      const analyzedData = await $fetch<any[]>("/api/gemini/analyze-image", {
        method: "POST",
        body: {
          images: base64Images,
          mode: "pro",
        },
      });

      // 3. Map kết quả trả về với ID ảnh trong store để hiển thị đúng
      const mappedResults = analyzedData.map((data, index) => ({
        imageId: validImages.value[index].id, // Map đúng ID của ảnh
        imageUrl: validImages.value[index].url, // URL blob để hiển thị thumbnail
        data: data,
      }));

      // 4. Lưu vào store và mở dialog
      geminiStore.setResults(mappedResults);
      toast.success("Phân tích hoàn tất! Hãy chọn các yếu tố bạn muốn.");
    } catch (error) {
      console.error(error);
      toast.error("Phân tích thất bại. Vui lòng thử lại.");
    } finally {
      isAnalyzing.value = false;
    }
  };

  // Nút chỉ sáng khi có ít nhất 1 ảnh hợp lệ và không đang chạy
  const canAnalyze = computed(
    () => validImages.value.length > 0 && !isAnalyzing.value,
  );

  return {
    isAnalyzing,
    canAnalyze,
    analyzeCurrentImages,
  };
};
