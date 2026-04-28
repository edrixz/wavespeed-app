// stores/styleStore.ts
import { DEFAULT_NEGATIVE_PROMPT } from "~/consts";
import type { Database, GptImagePromptPreset } from "~/types";

export const useGptImagePromptPresetStore = defineStore(
  "gptImagePromptPresetStore",
  () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const form = useGptImageForm();
    const toast = useSystemToast();

    const promptPresets = ref<GptImagePromptPreset[]>([]);
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
          .from("gpt_image_presets")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;

        if (reset) {
          promptPresets.value = data as GptImagePromptPreset[];
        } else {
          promptPresets.value = [
            ...promptPresets.value,
            ...(data as GptImagePromptPreset[]),
          ];
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
      aspect_ratio?: string;
      quality: string;
      resolution: string;
    }) => {
      const userUid = user.value?.sub;

      if (!userUid)
        return { success: false, error: "Authentication failed: No user UID" };
      isSaving.value = true;

      try {
        const { data, error } = await supabase
          .from("gpt_image_presets")
          .insert({
            user_id: userUid,
            title: payload.title,
            thumbnail: payload.thumbnail,
            prompt: payload.prompt,
            aspect_ratio: payload.aspect_ratio || "2:3",
            resolution: payload.resolution || "4K",
            quality: payload.quality || "high",
          })
          .select();

        if (error) throw error;
        if (data?.[0]) {
          promptPresets.value.unshift(data[0] as GptImagePromptPreset);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      } finally {
        isSaving.value = false;
      }
    };

    const applyPreset = (preset: GptImagePromptPreset) => {
      activePresetId.value = preset.id;
      form.prompt.value = preset.prompt;
      form.aspectRatio.value = preset.aspect_ratio;
      form.resolution.value = preset.resolution;
      form.quality.value = preset.quality;
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
        const preset = promptPresets.value.find((p) => p.id === id);
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

    const updatePresetDetails = async (
      id: string,
      updates: {
        title?: string;
        prompt?: string;
        size?: string | null;
      },
    ) => {
      try {
        isSaving.value = true;
        const { error } = await supabase
          .from("simple_presets")
          .update(updates)
          .eq("id", id);

        if (error) throw error;

        // Cập nhật nội bộ danh sách
        const preset = promptPresets.value.find((p) => p.id === id);
        if (preset) {
          Object.assign(preset, updates);
        }

        toast.success("Preset updated successfully.");
        return { success: true };
      } catch (err: any) {
        toast.error("Failed to update preset: " + err.message);
        return { success: false };
      } finally {
        isSaving.value = false;
      }
    };

    const incrementUsageCount = async (id: string) => {
      // Find the preset to get the current usage_count
      const preset = promptPresets.value.find((p) => p.id === id);
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
      updatePresetDetails,
      deletePreset,
      applyPreset,
      updatePresetRating,
      incrementUsageCount,
    };
  },
);
