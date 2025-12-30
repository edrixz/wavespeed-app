// stores/simplePresetStore.ts [cite: 2025-12-19]
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Database } from "~/types";

export interface SimplePreset {
  id: string;
  user_id: string;
  title: string;
  thumbnail: string | null;
  prompt: string;
  negative_prompt: string | null;
  size: string | null;
  created_at: string | null;
}

export const useSimplePresetStore = defineStore("simplePreset", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const settings = useSettingsForm();
  const toast = useToast();

  const presets = ref<SimplePreset[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  // Lấy dữ liệu danh sách [cite: 2025-12-19]
  const fetchPresets = async () => {
    if (!user.value) return;
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("simple_presets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      presets.value = data as any as SimplePreset[];
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    } finally {
      isLoading.value = false;
    }
  };

  // Lưu mới sử dụng .sub
  const savePreset = async (payload: {
    title: string;
    thumbnail?: string;
    prompt: string;
    negative_prompt: string;
    size: string;
  }) => {
    const userUid = user.value?.sub; 
    
    if (!userUid) return { success: false, error: "Authentication failed: No user UID" };
    isSaving.value = true;

    try {
      const { data, error } = await supabase
        .from("simple_presets")
        .insert({
          user_id: userUid, //
          title: payload.title,
          thumbnail: payload.thumbnail || null,
          prompt: payload.prompt,
          negative_prompt: payload.negative_prompt,
          size: payload.size,
        })
        .select();

      if (error) throw error;
      if (data?.[0]) {
        presets.value.unshift(data[0] as any as SimplePreset);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  const applyPreset = (preset: SimplePreset) => {
    settings.prompt.value = preset.prompt;
    settings.negative_prompt.value = preset.negative_prompt || "";
    const [w, h] = (preset.size || "1024*1024").split("*");
    settings.width.value = parseInt(w);
    settings.height.value = parseInt(h);
    if (settings.isBuilderMode.value) settings.toggleBuilderMode();
    toast.success(`Applied: ${preset.title}`);
  };

  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase.from("simple_presets").delete().eq("id", id);
      if (error) throw error;
      presets.value = presets.value.filter((p) => p.id !== id);
      toast.success("Preset removed.");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false };
    }
  };

  return { presets, isLoading, isSaving, fetchPresets, savePreset, deletePreset, applyPreset };
});