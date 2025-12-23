import type { AnalyzedData, ListItem } from "~/types";

export const useTagSelector = (
  modelValue: ComputedRef<string>,
  mode: ComputedRef<"single" | "multi">,
  options: ComputedRef<ListItem[]>,
  type: ComputedRef<keyof AnalyzedData>,
  field: ComputedRef<string>,
  onUpdate: (val: string) => void // callback để cập nhật về component
) => {
  const promptStore = usePromptBuilderStore();
  const aiGeneratedStore = useAiGeneratedPromptStore();

  const { updateAttr } = usePromptBuilder();

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

  // Lấy toàn bộ mảng tag thô từ AI (chưa lọc)
  const rawAiTags = computed(() => {
    if (!promptStore.activeSubjectId) return [];
    const aiData = aiGeneratedStore.getAiGeneratedDataBySubjectId(
      promptStore.activeSubjectId
    );
    // @ts-ignore
    const rawValue = aiData?.[type.value]?.[field.value];
    if (!rawValue) return [];
    return rawValue
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  });

  // KIỂM TRA: Tag mặc định có được AI gợi ý không?
  const isAiRecommended = (val: string) => {
    return rawAiTags.value.includes(val);
  };

  // --- LOGIC MỚI: AUTO APPLY ---
  watch(
    rawAiTags,
    (newAiTags) => {
      if (!newAiTags.length) return;

      const defaultValues = options.value.map((opt) => opt.value);
      const matches = newAiTags.filter((tag: string) =>
        defaultValues.includes(tag)
      );

      if (matches.length > 0) {
        let currentValue = modelValue.value || "";
        const tempObj = { value: currentValue };

        if (mode.value === "single") {
          // Chỉ tự động chọn nếu HIỆN TẠI chưa có gì được chọn
          if (!currentValue) {
            updateAttr(tempObj, "value", matches[0], "single");
            onUpdate(tempObj.value);
          }
        } else {
          // Multi mode: Thêm tất cả các tag AI gợi ý (nếu chưa được chọn)
          let changed = false;
          matches.forEach((tag: string) => {
            if (!isSelected(tag)) {
              updateAttr(tempObj, "value", tag, "multi");
              changed = true;
            }
          });
          if (changed) onUpdate(tempObj.value);
        }
      }
    },
    { immediate: true }
  );

  const sortedOptions = computed(() => {
    let list = [...options.value];

    // Đối với Single mode: Nếu tag mặc định được AI gợi ý nhưng CHƯA ĐƯỢC CHỌN
    // thì ẩn nó ở list trên để nó "di chuyển" xuống list dưới
    if (mode.value === "single") {
      list = list.filter((opt) => {
        const recommended = isAiRecommended(opt.value);
        const picked = isSelected(opt.value);
        return !(recommended && !picked);
      });
    }

    return list.sort((a, b) => {
      const aS = isSelected(a.value) ? 1 : 0;
      const bS = isSelected(b.value) ? 1 : 0;
      return bS - aS;
    });
  });

  // --- LOGIC 2: DANH SÁCH AI GỢI Ý (Phía dưới) ---
  const aiSuggestions = computed(() => {
    const defaultValues = options.value.map((opt) => opt.value);

    return rawAiTags.value.filter((tag: string) => {
      const isDefault = defaultValues.includes(tag);

      if (isDefault) {
        // Nếu là tag mặc định: Chỉ hiện ở dưới nếu nó CHƯA ĐƯỢC CHỌN (trong mode single)
        return mode.value === "single" && !isSelected(tag);
      } else {
        // Nếu là tag mới: Luôn luôn hiển thị ở đây để chọn/bỏ chọn
        return true;
      }
    });
  });

  const handleToggle = (val: string) => {
    const tempObj = { value: modelValue.value || "" };
    updateAttr(tempObj, "value", val, mode.value);
    // Trả về giá trị mới để component emit update:modelValue
    return tempObj.value;
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
