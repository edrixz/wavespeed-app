import type { AnalyzedData } from "~/types";

export const useTagSelector = (
  modelValue: ComputedRef<string>,
  mode: ComputedRef<"single" | "multi">,
  options: ComputedRef<{ label: string; value: string }[]>,
  type: ComputedRef<keyof AnalyzedData>,
  field: ComputedRef<string>
) => {
  const promptStore = usePromptBuilderStore();
  const { activeSubjectId } = storeToRefs(promptStore);

  const aiGeneratedStore = useAiGeneratedPromptStore();
  const { getAiGeneratedDataBySubjectId, clearAiField } = aiGeneratedStore;

  const { updateAttr, isActive } = usePromptBuilder();

  // Kiểm tra trạng thái Active
  const isSelected = (val: string) => {
    if (!modelValue.value) return false;
    // Với single mode, so sánh trực tiếp; với multi, kiểm tra trong mảng
    if (mode.value === "single") return modelValue.value === val;
    return modelValue.value
      .split(",")
      .map((s) => s.trim())
      .includes(val);
  };

  // Logic sắp xếp User Tags lên đầu
  const sortedOptions = computed(() => {
    return [...options.value].sort((a, b) => {
      const aActive = isSelected(a.value) ? 1 : 0;
      const bActive = isSelected(b.value) ? 1 : 0;
      // Sắp xếp giảm dần: 1 (active) đứng trước 0 (inactive)
      return bActive - aActive;
    });
  });

  // Logic lấy gợi ý AI
  const aiSuggestions = computed(() => {
    if (!activeSubjectId.value) return [];
    const aiData = getAiGeneratedDataBySubjectId(activeSubjectId.value);
    if (!aiData) return [];

    // Truy cập an toàn vào object lồng nhau
    const category = aiData[type.value];
    if (!category || typeof category !== "object") return [];

    // @ts-ignore: Do field là string dynamic
    const rawValue = category[field.value];
    if (!rawValue || typeof rawValue !== "string") return [];

    return rawValue
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  });

  const handleToggle = (val: string) => {
    const tempObj = { value: modelValue.value || "" };
    updateAttr(tempObj, "value", val, mode.value);
    // Trả về giá trị mới để component emit update:modelValue
    return tempObj.value;
  };

  const handleReset = () => {
    if (activeSubjectId.value) {
      clearAiField(activeSubjectId.value, type.value, field.value);
    }
  };

  return {
    aiSuggestions,
    sortedOptions,
    isSelected,
    handleToggle,
    handleReset,
  };
};
