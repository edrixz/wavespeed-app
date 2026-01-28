// [FILE: wavespeed/stores/gemini/gemini-prompt-store.ts]
import { defineStore, storeToRefs } from "pinia";
import { ref, computed } from "vue";
import type { ImageAnalysisResult } from "~/types/gemini/analyzed-data";
import { useWavespeedPayloadStore } from "~/stores/wavespeed/wavespeed-payload-store"; // Import store chính

export const useGeminiPromptStore = defineStore("geminiPrompt", () => {
  // --- STATE ---
  const results = ref<ImageAnalysisResult[]>([]);
  const isDialogOpen = ref(false);

  // State lưu các key được chọn (VD: ['img_1-subject', 'img_1-lighting'])
  // Format key: `${imageId}-${categoryKey}`
  const selectedSegments = ref<Set<string>>(new Set());

  // --- ACTIONS ---

  /** * 1. Lưu kết quả từ API
   * Mặc định chọn tất cả (Auto-select all) hoặc reset
   */
  const setResults = (data: ImageAnalysisResult[]) => {
    results.value = data;
    selectedSegments.value.clear();

    // Logic: Mặc định chọn hết tất cả các thẻ để tiện cho user
    data.forEach((img) => {
      // Các key trong object data (subject, clothing, ...)
      Object.keys(img.data).forEach((key) => {
        selectedSegments.value.add(`${img.imageId}-${key}`);
      });
    });

    if (data.length > 0) isDialogOpen.value = true;
  };

  /** * 2. Toggle chọn/bỏ chọn một item
   */
  const toggleSelection = (imageId: string, category: string) => {
    const key = `${imageId}-${category}`;
    if (selectedSegments.value.has(key)) {
      selectedSegments.value.delete(key);
    } else {
      selectedSegments.value.add(key);
    }
  };

  /**
   * 3. ÁP DỤNG VÀO PROMPT CHÍNH (Logic bạn đang thiếu)
   * Lấy tất cả value tiếng Anh của các mục đang được chọn -> Nối lại -> Update Prompt chính
   */
  const applyToMainPrompt = (appendMode: "replace" | "append" = "replace") => {
    const payloadStore = useWavespeedPayloadStore();

    // Thu thập các đoạn text tiếng Anh từ các mục được chọn
    const segments: string[] = [];

    results.value.forEach((img) => {
      Object.entries(img.data).forEach(([category, content]: [string, any]) => {
        const key = `${img.imageId}-${category}`;
        // Nếu mục này đang được chọn trong state selectedSegments
        if (selectedSegments.value.has(key) && content?.value) {
          segments.push(content.value); // Lấy field tiếng Anh (value)
        }
      });
    });

    // Nối các đoạn lại bằng dấu phẩy
    const finalString = segments.join(", ");

    if (!finalString) return;

    // Cập nhật vào Store chính
    if (appendMode === "replace") {
      payloadStore.prompt = finalString;
    } else {
      // Append: Giữ prompt cũ, thêm prompt mới vào cuối
      const current = payloadStore.prompt.trim();
      payloadStore.prompt = current
        ? `${current}, ${finalString}`
        : finalString;
    }

    // Đóng dialog sau khi áp dụng
    isDialogOpen.value = false;
  };

  const closeDialog = () => {
    isDialogOpen.value = false;
  };

  const clearResults = () => {
    results.value = [];
    selectedSegments.value.clear();
    isDialogOpen.value = false;
  };

  // --- GETTERS ---
  const hasResults = computed(() => results.value.length > 0);

  // Helper check xem item có đang được chọn không (để bind vào UI Checkbox)
  const isSelected = (imageId: string, category: string) => {
    return selectedSegments.value.has(`${imageId}-${category}`);
  };

  return {
    results,
    isDialogOpen,
    selectedSegments,
    hasResults,
    setResults,
    toggleSelection,
    isSelected,
    applyToMainPrompt,
    closeDialog,
    clearResults,
  };
});
