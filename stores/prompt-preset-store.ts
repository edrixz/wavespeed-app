// stores/presetStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { PRESET_SAMPLES } from "~/consts";
import type { Database, PromptPreset } from "~/types";

export const usePresetStore = defineStore("preset", () => {
  const { setStatus } = useLogger();
  const supabase = useSupabaseClient<Database>();

  // --- STATE ---
  const presets = ref<PromptPreset[]>(PRESET_SAMPLES);
  const activeCategory = ref("All");
  const selectedPreset = ref<PromptPreset | null>(null);
  const isDialogOpen = ref(false);
  const isLoading = ref(false);
  const isSaving = ref(false);

  // 1. Lấy dữ liệu (READ)
  const fetchPresets = async () => {
    isLoading.value = true;
    const { data, error } = await supabase
      .from("presets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      presets.value = data.map((item) => ({
        ...item,
        thumbnail: item.thumbnail,
      })) as any;
    }
    isLoading.value = false;
  };

  // 2. Thêm mới (CREATE)
  const savePreset = async (payload: {
    title: string;
    category: string;
    thumbnail: string;
    data: any;
  }) => {
    isSaving.value = true;
    try {
      const { data, error } = await supabase
        .from("presets")
        .insert({
          title: payload.title,
          category: payload.category,
          thumbnail_url: payload.thumbnail, // Mapping sang DB
          data: payload.data,
        })
        .select();

      if (error) throw error;

      if (data) {
        // Map ngược lại để hiển thị ngay trên UI
        const newPreset = { ...data[0], thumbnail: data[0].thumbnail };
        presets.value.unshift(newPreset as any);
        return { success: true };
      }
    } catch (err: any) {
      console.error("Save failed:", err.message);
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  // 3. Xóa (DELETE)
  const deletePreset = async (id: string) => {
    const { error } = await supabase.from("presets").delete().eq("id", id);
    if (!error) {
      presets.value = presets.value.filter((p) => p.id !== id);
    }
  };

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
    isLoading,
    isSaving,
    setCategory,
    openPresetDetails,
    applyPreset,
    closeDialog,
    fetchPresets,
    savePreset,
    deletePreset,
  };
});
