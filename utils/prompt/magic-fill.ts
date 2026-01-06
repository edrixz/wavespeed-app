import type { AnalyzedData } from "~/types/entities";
import { useLogger } from "~/composables";
import { usePromptBuilderStore } from "~/stores/prompt-builder-store";
import { useAiGeneratedPromptStore } from "~/stores/ai-generated-prompt-store";

/**
 * Map dữ liệu phân tích từ AI vào store (Magic Fill)
 */
export const mapMagicFillToStore = (data: AnalyzedData) => {
  const { setStatus } = useLogger();

  const promptStore = usePromptBuilderStore();
  const aiGeneratedStore = useAiGeneratedPromptStore();

  if (!promptStore.currentSubject) return false;

  // LÀM SẠCH DỮ LIỆU CŨ TRƯỚC KHI MAPPING MỚI
  aiGeneratedStore.clearAiData(promptStore.currentSubject.id);

  // Thay vì ghi đè vào promptStore, ta ghi vào aiStore
  aiGeneratedStore.setAiGeneratedData(promptStore.currentSubject.id, data);

  setStatus("Magic Fill completed successfully!", "success");

  return true;
};

/**
 * Trích xuất giá trị cụ thể từ dữ liệu phân tích
 */
export const extractFieldFromAnalysis = (
  data: AnalyzedData,
  fieldPath: string
) => {
  const keys = fieldPath.split(".");
  let value: any = data;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }

  return value?.value || value?.label_vi || value;
};
