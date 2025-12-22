// stores/aiPromptStore.ts
import { defineStore } from "pinia";
import type { AnalyzedData } from "~/types";

export const useAiGeneratedPromptStore = defineStore("aiPrompt", () => {
  // Lưu trữ dữ liệu AI theo ID của Subject để không bị nhầm lẫn khi đổi Tab
  const aiDataMap = ref<Record<string, AnalyzedData>>({});

  const setAiGeneratedData = (subjectId: string, data: AnalyzedData) => {
    aiDataMap.value[subjectId] = data;
  };

  const getAiGeneratedDataBySubjectId = (subjectId: string) => {
    return aiDataMap.value[subjectId] || null;
  };

  const clearAiData = (subjectId: string) => {
    delete aiDataMap.value[subjectId];
  };

  const clearAiField = (
    subjectId: string,
    type: keyof AnalyzedData,
    field: string
  ) => {
    if (aiDataMap.value[subjectId] && aiDataMap.value[subjectId][type]) {
      // @ts-ignore: Truy cập động vào field
      aiDataMap.value[subjectId][type][field] = "";
    }
  };

  return {
    aiDataMap,
    setAiGeneratedData,
    getAiGeneratedDataBySubjectId,
    clearAiData,
    clearAiField,
  };
});
