// FILE: stores/gemini/gemini-prompt-store.ts
import { defineStore } from "pinia";
import type {
  ImageAnalysisResult,
  AnalysisCategory,
} from "~/types/gemini/analyzed-data";

export const useGeminiPromptStore = defineStore("geminiPrompt", () => {
  const analyzedResults = ref<ImageAnalysisResult[]>([]);
  const selectedKeys = ref<Set<string>>(new Set());
  const isDialogOpen = ref(false);

  // Lưu kết quả và mở Dialog
  const setResults = (results: ImageAnalysisResult[]) => {
    analyzedResults.value = results;
    selectedKeys.value.clear();

    // Mặc định chọn tất cả các thuộc tính
    results.forEach((img) => {
      (Object.keys(img.data) as AnalysisCategory[]).forEach((cat) => {
        selectedKeys.value.add(`${img.imageId}-${cat}`);
      });
    });

    isDialogOpen.value = true;
  };

  // Toggle chọn/bỏ chọn
  const toggleSelection = (imageId: string, category: AnalysisCategory) => {
    const key = `${imageId}-${category}`;
    if (selectedKeys.value.has(key)) selectedKeys.value.delete(key);
    else selectedKeys.value.add(key);
  };

  // LOGIC QUAN TRỌNG: Compile Prompt
  // Chỉ lấy phần tiếng Anh (.value) để gửi cho AI vẽ ảnh
  const compileFinalPrompt = (): string => {
    const promptParts: string[] = [];

    analyzedResults.value.forEach((img) => {
      // Thứ tự ưu tiên khi ghép chuỗi
      const categories: AnalysisCategory[] = [
        "subject",
        "clothing",
        "pose",
        "background",
        "lighting",
        "technical",
      ];
      const imgParts: string[] = [];

      categories.forEach((cat) => {
        if (selectedKeys.value.has(`${img.imageId}-${cat}`)) {
          const content = img.data[cat]?.value;
          if (content) imgParts.push(content);
        }
      });

      if (imgParts.length > 0) {
        promptParts.push(imgParts.join(", "));
      }
    });

    return promptParts.join(". ");
  };

  return {
    analyzedResults,
    selectedKeys,
    isDialogOpen,
    setResults,
    toggleSelection,
    compileFinalPrompt,
  };
});
