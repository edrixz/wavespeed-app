// stores/styleStore.ts
import { DEFAULT_NEGATIVE_PROMPT } from "~/consts";
import type { Database, PromptPreset } from "~/types";

export const useSeedreamPromptPresetStore = defineStore(
  "seedreamPromptPresetStore",
  () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const form = useUseWavespeedSeedreamForm();
    const toast = useSystemToast();

    const promptPresets = ref<PromptPreset[]>([]);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const activePresetId = ref<string | null>(null);

    const hasMore = ref(true);
    const currentPage = ref(0);
    const PAGE_SIZE = 10;
    const isFetchingMore = ref(false);

    const fetchPreset = async (reset = true) => {
      if (!user.value) return;
      
      if (reset) {
        currentPage.value = 0;
        hasMore.value = true;
        isLoading.value = true;
      } else {
        if (!hasMore.value || isFetchingMore.value) return;
        isFetchingMore.value = true;
      }

      try {
        const from = currentPage.value * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from("simple_presets")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;
        
        if (reset) {
           promptPresets.value = data as PromptPreset[];
        } else {
           promptPresets.value = [...promptPresets.value, ...(data as PromptPreset[])];
        }

        if (data.length < PAGE_SIZE) {
           hasMore.value = false;
        } else {
           currentPage.value++;
        }
      } catch (err: any) {
        toast.error("Fetch Error: " + err.message);
      } finally {
        isLoading.value = false;
        isFetchingMore.value = false;
      }
    };

    const savePreset = async (payload: {
      title: string;
      thumbnail: string;
      prompt: string;
      negative_prompt?: string;
      size?: string;
    }) => {
      const userUid = user.value?.sub;

      if (!userUid)
        return { success: false, error: "Authentication failed: No user UID" };
      isSaving.value = true;

      try {
        const { data, error } = await supabase
          .from("simple_presets")
          .insert({
            user_id: userUid,
            title: payload.title,
            thumbnail: payload.thumbnail,
            prompt: payload.prompt,
            negative_prompt: payload.negative_prompt || DEFAULT_NEGATIVE_PROMPT,
            size: payload.size || "2572*4096",
          })
          .select();

        if (error) throw error;
        if (data?.[0]) {
          promptPresets.value.unshift(data[0] as PromptPreset);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      } finally {
        isSaving.value = false;
      }
    };

    const applyPreset = (preset: PromptPreset) => {
      activePresetId.value = preset.id;
      form.prompt.value = preset.prompt;
      form.negative_prompt.value = preset.negative_prompt || "";
      const [w, h] = (preset.size || "1024*1024").split("*");
      form.width.value = parseInt(w!);
      form.height.value = parseInt(h!);
      toast.success(`Applied: ${preset.title}`);
    };

    const deletePreset = async (id: string) => {
      try {
        const { error } = await supabase
          .from("simple_presets")
          .delete()
          .eq("id", id);
        if (error) throw error;
        promptPresets.value = promptPresets.value.filter((s) => s.id !== id);
        toast.success("Preset removed.");
        return { success: true };
      } catch (err: any) {
        toast.error(err.message);
        return { success: false };
      }
    };

    const updatePresetRating = async (id: string, rating: number) => {
      try {
        const { error } = await supabase
          .from("simple_presets")
          .update({ rating })
          .eq("id", id);
        if (error) throw error;
        
        // Cập nhật nội bộ danh sách
        const preset = promptPresets.value.find(p => p.id === id);
        if (preset) {
          preset.rating = rating;
        }
        
        toast.success("Rating saved.");
        return { success: true };
      } catch (err: any) {
        toast.error("Failed to save rating: " + err.message);
        return { success: false };
      }
    };

    const incrementUsageCount = async (id: string) => {
      // Find the preset to get the current usage_count
      const preset = promptPresets.value.find(p => p.id === id);
      if (!preset) return;
      
      const newCount = (preset.usage_count || 0) + 1;
      
      try {
        const { error } = await supabase
          .from("simple_presets")
          .update({ usage_count: newCount })
          .eq("id", id);
          
        if (error) throw error;
        
        // Update local state
        preset.usage_count = newCount;
      } catch (err: any) {
        console.error("Failed to increment usage count:", err.message);
      }
    };

    return {
      promptPresets,
      isLoading,
      isSaving,
      activePresetId,
      hasMore,
      isFetchingMore,
      fetchPreset,
      savePreset,
      deletePreset,
      applyPreset,
      updatePresetRating,
      incrementUsageCount,
    };
  },
);
