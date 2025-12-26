// stores/simplePresetStore.ts]
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Database } from "~/types";

// 1. Cập nhật Interface: Cho phép nullable để khớp với DB]
export interface SimplePreset {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  negative_prompt: string | null;
  size: string | null; // Sửa từ string thành string | null]
  created_at: string | null; // Sửa từ string thành string | null]
}

export const useSimplePresetStore = defineStore("simplePreset", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const settings = useSettingsForm();
  const toast = useToast();

  const presets = ref<SimplePreset[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  /**
   * ACTION: Fetch Presets
   */
  const fetchPresets = async () => {
    if (!user.value) return;
    isLoading.value = true;

    try {
      const { data, error } = await supabase
        .from("simple_presets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Ép kiểu an toàn sau khi đã lấy dữ liệu]
      presets.value = data as any as SimplePreset[];
    } catch (err: any) {
      console.error("Fetch Simple Presets failed:", err.message);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ACTION: Save Preset
   */
  const savePreset = async (payload: {
    title: string;
    prompt: string;
    negative_prompt: string;
    size: string;
  }) => {
    if (!user.value) return { success: false, error: "Chưa đăng nhập" };
    isSaving.value = true;

    try {
      const { data, error } = await supabase
        .from("simple_presets")
        .insert({
          user_id: user.value.id,
          title: payload.title,
          prompt: payload.prompt,
          negative_prompt: payload.negative_prompt,
          size: payload.size,
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        presets.value.unshift(data[0] as any as SimplePreset);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * ACTION: Apply Preset]
   */
  const applyPreset = (preset: SimplePreset) => {
    try {
      settings.prompt.value = preset.prompt;
      settings.negative_prompt.value = preset.negative_prompt || "";

      // Xử lý an toàn khi size có thể null]
      const sizeValue = preset.size || "1024*1024"; // Giá trị mặc định nếu null]
      const [w, h] = sizeValue.split("*");

      settings.width.value = parseInt(w) || 1024;
      settings.height.value = parseInt(h) || 1024;

      if (settings.isBuilderMode.value) {
        settings.toggleBuilderMode();
      }

      toast.success(`Đã áp dụng mẫu: ${preset.title}`);
    } catch (err) {
      toast.error("Lỗi khi áp dụng cấu hình.");
    }
  };

  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase
        .from("simple_presets")
        .delete()
        .eq("id", id);
      if (error) throw error;
      presets.value = presets.value.filter((p) => p.id !== id);
      toast.success("Đã xóa mẫu nhanh.");
      return { success: true };
    } catch (err: any) {
      toast.error("Lỗi khi xóa: " + err.message);
      return { success: false };
    }
  };

  return {
    presets,
    isLoading,
    isSaving,
    fetchPresets,
    savePreset,
    deletePreset,
    applyPreset,
  };
});
