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

    const fetchPreset = async () => {
      if (!user.value) return;
      isLoading.value = true;
      try {
        const { data, error } = await supabase
          .from("simple_presets")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        promptPresets.value = data as PromptPreset[];
      } catch (err: any) {
        toast.error("Fetch Error:", err.message);
      } finally {
        isLoading.value = false;
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

    return {
      promptPresets,
      isLoading,
      isSaving,
      fetchPreset,
      savePreset,
      deletePreset,
      applyPreset,
    };
  },
);
