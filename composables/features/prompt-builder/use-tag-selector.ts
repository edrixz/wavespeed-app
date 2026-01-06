import type { AiValue, AnalyzedData } from "~/types/entities";
import type { ListItem } from "~/types/list-item";

export const useTagSelector = (
  modelValue: ComputedRef<AiValue>,
  mode: ComputedRef<"single" | "multi">,
  options: ComputedRef<ListItem[]>,
  type: ComputedRef<keyof AnalyzedData>,
  field: ComputedRef<string>,
  onUpdate: (val: AiValue) => void // callback để cập nhật về component
) => {
  const promptStore = usePromptBuilderStore();
  const aiGeneratedStore = useAiGeneratedPromptStore();

  const { updateAttr } = usePromptBuilder();

  // Kiểm tra trạng thái Active
  const isSelected = (valEn: string) => {
    if (!modelValue.value?.value) return false;
    return modelValue.value.value
      .split(",")
      .map((s) => s.trim())
      .includes(valEn);
  };

  const baseOptionValues = computed(() =>
    options.value.map((opt) => opt.value)
  );

  // 2. Lấy dữ liệu thô từ AI (Object song ngữ)
  const rawAiData = computed(() => {
    if (!promptStore.activeSubjectId) return { en: [], vi: [] };
    const aiData = aiGeneratedStore.getAiGeneratedDataBySubjectId(
      promptStore.activeSubjectId
    );
    const raw = (aiData as any)?.[type.value]?.[field.value] as AiValue;

    if (!raw || !raw.value) return { en: [], vi: [] };

    return {
      en: raw.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      vi: raw.label_vi
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  });

  // KIỂM TRA: Tag mặc định có được AI gợi ý không?
  const isAiRecommended = (valEn: string) => rawAiData.value.en.includes(valEn);

  // 4. LOGIC AUTO APPLY (Sửa lỗi watch)
  watch(
    rawAiData,
    (newData) => {
      if (!newData.en.length) return;

      // Tìm những tag AI gợi ý mà có nằm trong danh sách Options mặc định
      const matchesEn = newData.en.filter((tag) =>
        baseOptionValues.value.includes(tag)
      );

      if (matchesEn.length > 0) {
        if (mode.value === "single") {
          const hasBaseTag = modelValue.value?.value
            ?.split(",")
            .some((t) => baseOptionValues.value.includes(t.trim()));
          if (!hasBaseTag) {
            const firstMatchEn = matchesEn[0];
            const matchIndex = newData.en.indexOf(firstMatchEn);
            const firstMatchVi = newData.vi[matchIndex] || firstMatchEn;

            onUpdate(handleToggle(firstMatchEn, firstMatchVi, false));
          }
        } else {
          // Multi mode
          let currentResult = { ...modelValue.value };
          let changed = false;

          matchesEn.forEach((tagEn) => {
            if (!isSelected(tagEn)) {
              const mIndex = newData.en.indexOf(tagEn);
              const tagVi = newData.vi[mIndex] || tagEn;
              currentResult = handleToggle(tagEn, tagVi, false);
              changed = true;
            }
          });
          if (changed) onUpdate(currentResult);
        }
      }
    },
    { immediate: true }
  );

  // 5. Sorted Options (List phía trên)
  const sortedOptions = computed(() => {
    let list = [...options.value];
    if (mode.value === "single") {
      list = list.filter(
        (opt) => !(isAiRecommended(opt.value) && !isSelected(opt.value))
      );
    }
    return list.sort(
      (a, b) => (isSelected(b.value) ? 1 : 0) - (isSelected(a.value) ? 1 : 0)
    );
  });

  // 6. AI Suggestions (List phía dưới - Trả về AiValue[])
  const aiSuggestions = computed(() => {
    return rawAiData.value.en
      .map((en, index) => ({
        value: en,
        label_vi: rawAiData.value.vi[index] || en,
      }))
      .filter((item) => {
        const isDefault = baseOptionValues.value.includes(item.value);
        return isDefault
          ? mode.value === "single" && !isSelected(item.value)
          : true;
      });
  });

  /**
   * 3. LOGIC TOGGLE CHÍNH (Value-centric)
   */
  const handleToggle = (
    valEn: string,
    valVi: string,
    isAiSuggestion: boolean = false
  ): AiValue => {
    let currentEn = modelValue.value?.value
      ? modelValue.value.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    let currentVi = modelValue.value?.label_vi
      ? modelValue.value.label_vi
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const index = currentEn.indexOf(valEn);

    if (!isAiSuggestion && mode.value === "single") {
      // Chế độ Single: Xóa các base tags khác
      baseOptionValues.value.forEach((baseVal) => {
        const i = currentEn.indexOf(baseVal);
        if (i > -1) {
          currentEn.splice(i, 1);
          currentVi.splice(i, 1);
        }
      });
      if (index === -1) {
        currentEn.push(valEn);
        currentVi.push(valVi);
      }
    } else {
      // Chế độ Multi
      if (index > -1) {
        currentEn.splice(index, 1);
        currentVi.splice(index, 1);
      } else {
        currentEn.push(valEn);
        currentVi.push(valVi);
      }
    }

    return { value: currentEn.join(", "), label_vi: currentVi.join(", ") };
  };

  const handleReset = () => {
    if (promptStore.activeSubjectId) {
      aiGeneratedStore.clearAiField(
        promptStore.activeSubjectId,
        type.value,
        field.value
      );
    }
  };

  const isLoading = computed(() => {
    const id = promptStore.activeSubjectId;
    if (!id) return false;
    // Truy cập trực tiếp qua instance store để đảm bảo tính reactive
    return aiGeneratedStore.isSubjectAnalyzing(id);
  });

  return {
    isLoading,
    aiSuggestions,
    sortedOptions,
    isSelected,
    isAiRecommended,
    handleToggle,
    handleReset,
  };
};
