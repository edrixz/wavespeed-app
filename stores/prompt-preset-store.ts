// stores/presetStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { PRESET_SAMPLES } from "~/consts";
import type { PromptPreset } from "~/types";

export const usePresetStore = defineStore("preset", () => {
  const { setStatus } = useLogger();

  // --- STATE ---
  const presets = ref<PromptPreset[]>(PRESET_SAMPLES);
  const activeCategory = ref("All");
  const selectedPreset = ref<PromptPreset | null>(null);
  const isDialogOpen = ref(false);

  // Truy cập store trung tâm
  const promptBuilderStore = usePromptBuilderStore();
  const aiGeneratedPromptStore = useAiGeneratedPromptStore();

  // --- ACTIONS ---

  // Logic lọc dữ liệu tự động phản hồi (Reactive)
  const filteredPresets = computed(() => {
    if (activeCategory.value === "All") return presets.value;
    return presets.value.filter((p) => p.category === activeCategory.value);
  });

  const setCategory = (cat: string) => {
    activeCategory.value = cat;
  };

  /**
   * Mở Dialog để xem chi tiết mẫu
   */
  const openPresetDetails = (preset: PromptPreset) => {
    // Kiểm tra nếu trình duyệt hỗ trợ API mới
    if (!document.startViewTransition) {
      selectedPreset.value = preset;
      isDialogOpen.value = true;
      return;
    }

    // Thực hiện chuyển đổi mượt mà
    document.startViewTransition(() => {
      selectedPreset.value = preset;
      isDialogOpen.value = true;
    });
  };

  const closeDialog = () => {
    if (!document.startViewTransition) {
      isDialogOpen.value = false;
      return;
    }

    document.startViewTransition(() => {
      isDialogOpen.value = false;
    });
  };

  /**
   * APPLY PRESET: Nạp toàn bộ dữ liệu vào Subject hiện tại
   */
  const applyPreset = async () => {
    if (!selectedPreset.value || !promptBuilderStore.activeSubjectId) return;
    await aiGeneratedPromptStore.setAiGeneratedData(
      promptBuilderStore.activeSubjectId,
      selectedPreset.value.data
    );
    await closeDialog();
  };

  // Trả ra các biến/hàm cần dùng
  return {
    presets,
    selectedPreset,
    isDialogOpen,
    filteredPresets,
    activeCategory,
    setCategory,
    openPresetDetails,
    applyPreset,
    closeDialog,
  };
});
