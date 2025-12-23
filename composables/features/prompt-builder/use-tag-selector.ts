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
    return modelValue.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .includes(val);
  };

  const baseOptionValues = computed(() =>
    options.value.map((opt) => opt.value)
  );

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
      const matches = newAiTags.filter((tag: string) =>
        baseOptionValues.value.includes(tag)
      );

      if (matches.length > 0) {
        // Nếu là mode single và chưa có base tag nào được chọn
        if (mode.value === "single") {
          const hasBaseTag = modelValue.value
            ?.split(",")
            .some((t) => baseOptionValues.value.includes(t.trim()));
          if (!hasBaseTag) {
            const newValue = handleToggle(matches[0]);
            onUpdate(newValue);
          }
        } else {
          // Multi mode: tự động chọn tất cả match
          let newValue = modelValue.value || "";
          matches.forEach((tag: string) => {
            if (!isSelected(tag)) {
              // Giả lập toggle để lấy chuỗi mới
              const tempValue = modelValue.value;
              // Lưu ý: handleToggle lấy modelValue trực tiếp, nên cần cập nhật tuần tự
              // Ở đây đơn giản là nối chuỗi nếu chưa có
              const currentTags = newValue
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
              if (!currentTags.includes(tag)) {
                currentTags.push(tag);
                newValue = currentTags.join(", ");
              }
            }
          });
          onUpdate(newValue);
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

  const handleToggle = (val: string, forceMulti: boolean = false) => {
    let currentTags = modelValue.value
      ? modelValue.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const isBaseTag = baseOptionValues.value.includes(val);
    const isAlreadySelected = currentTags.includes(val);

    // CHẾ ĐỘ HYBRID:
    // Nếu là Base Tag và đang ở mode single (và không bị ép multi bởi AI list)
    if (isBaseTag && mode.value === "single" && !forceMulti) {
      // Loại bỏ các Base Tag khác đang có trong list, giữ lại AI Tags
      currentTags = currentTags.filter(
        (t) => !baseOptionValues.value.includes(t)
      );
      if (!isAlreadySelected) currentTags.push(val);
    } else {
      // Chế độ Multi thông thường (cho AI Suggestions hoặc mode multi)
      if (isAlreadySelected) {
        currentTags = currentTags.filter((t) => t !== val);
      } else {
        currentTags.push(val);
      }
    }

    const finalValue = currentTags.join(", ");
    return finalValue;
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
