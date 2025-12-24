// stores/aiPromptStore.ts
import { defineStore } from "pinia";
import type { AnalyzedData } from "~/types";

export const useAiGeneratedPromptStore = defineStore("aiPrompt", () => {
  // Lưu trữ dữ liệu AI theo ID của Subject để không bị nhầm lẫn khi đổi Tab
  const aiDataMap = ref<Record<string, AnalyzedData>>({});

  // Quản lý các Subject đang được phân tích
  const analyzingSubjects = ref<Set<string>>(new Set());

  // Lưu trữ các bộ điều khiển hủy bỏ yêu cầu
  const abortControllers = ref<Map<string, AbortController>>(new Map());

  /**
   * Object lưu trữ dữ liệu đã phân tích
   * Cấu trúc: { [id: string]: AnalyzedData }
   */
  const generatedData = ref<Record<string, any>>({});

  const setAnalyzing = (
    subjectId: string,
    isAnalyzing: boolean,
    controller?: AbortController
  ) => {
    if (isAnalyzing) {
      analyzingSubjects.value.add(subjectId);
      if (controller) abortControllers.value.set(subjectId, controller);
    } else {
      analyzingSubjects.value.delete(subjectId);
      abortControllers.value.delete(subjectId);
    }
  };

  const cancelAnalysis = (subjectId: string) => {
    const controller = abortControllers.value.get(subjectId);
    if (controller) {
      controller.abort(); // Dừng yêu cầu HTTP ngay lập tức
      setAnalyzing(subjectId, false);
    }
  };

  const isSubjectAnalyzing = (subjectId: string) => {
    return analyzingSubjects.value.has(subjectId);
  };

  const setAiGeneratedData = (subjectId: string, data: AnalyzedData) => {
    aiDataMap.value[subjectId] = data;
    generatedData.value[subjectId] = data;
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
    generatedData,
    setAnalyzing,
    cancelAnalysis,
    isSubjectAnalyzing,
    setAiGeneratedData,
    getAiGeneratedDataBySubjectId,
    clearAiData,
    clearAiField,
  };
});
