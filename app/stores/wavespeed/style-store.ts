// stores/styleStore.ts
import type { Database, StyleAsset } from "~/types";

export const useStyleAssetsStore = defineStore("styleAssetsStore", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const form = useUseWavespeedSeedreamForm();
  const toast = useToast();

  const styleAssets = ref<StyleAsset[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  const fetchStyleAssets = async () => {
    if (!user.value) return;
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("simple_presets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      styleAssets.value = data as StyleAsset[];
    } catch (err: any) {
      toast.error("Fetch Error:", err.message);
    } finally {
      isLoading.value = false;
    }
  };

  const saveStyleAsset = async (payload: {
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
          negative_prompt:
            payload.negative_prompt ||
            "(worst quality:2.0), (low quality:2.0), (normal quality:2.0), lowres, jpeg artifacts, signature, watermark, username, error, (bad anatomy:1.8), (distorted anatomy:1.8), (fused anatomy:1.8), extra limbs, extra fingers, missing fingers, detached limbs, (malformed genitals:1.8), (distorted labia:1.5), (distorted nipples:1.5), extra breasts, extra nipples, (blurred mucosal tissues:1.4), (plastic skin:1.5), (unrealistic skin texture:1.5), (over-retouched:1.4), cartoon, anime, 3d render, cgi, illustration, sketch, drawing, painting, (deformed body proportions:1.4), (unnatural skin folds:1.3), (flat lighting:1.3), (harsh shadows:1.2), (overexposed highlights:1.3), (asymmetric breasts:1.2), (messy pubic hair patterns:1.3).",
          size: payload.size || "2572*4096",
        })
        .select();

      if (error) throw error;
      if (data?.[0]) {
        styleAssets.value.unshift(data[0] as StyleAsset);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  const applyStyleAsset = (preset: StyleAsset) => {
    form.prompt.value = preset.prompt;
    form.negative_prompt.value = preset.negative_prompt || "";
    const [w, h] = (preset.size || "1024*1024").split("*");
    form.width.value = parseInt(w!);
    form.height.value = parseInt(h!);
    toast.success(`Applied: ${preset.title}`);
  };

  const deleteStyleAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from("simple_presets")
        .delete()
        .eq("id", id);
      if (error) throw error;
      styleAssets.value = styleAssets.value.filter((s) => s.id !== id);
      toast.success("Preset removed.");
      return { success: true };
    } catch (err: any) {
      toast.error(err.message);
      return { success: false };
    }
  };

  return {
    styleAssets,
    isLoading,
    isSaving,
    fetchStyleAssets,
    saveStyleAsset,
    deleteStyleAsset,
    applyStyleAsset,
  };
});
