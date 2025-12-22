import type { AnalyzedData } from "~/types";

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
