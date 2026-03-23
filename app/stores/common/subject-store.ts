// stores/common/subject-store.ts
import type { Database, Subject, SubjectFormPayload } from "~/types";

export const useSubjectStore = defineStore("subjectStore", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useSystemToast();

  const subjects = ref<Subject[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  /**
   * Fetch all subjects belonging to the current user.
   */
  const fetchSubjects = async () => {
    if (!user.value) return;
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.value.sub)
        .order("created_at", { ascending: false });
      if (error) throw error;
      subjects.value = (data ?? []) as Subject[];
    } catch (err: any) {
      toast.error(`Failed to fetch subjects: ${err.message}`);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new subject for the current user.
   */
  const createSubject = async (payload: SubjectFormPayload) => {
    const userId = user.value?.sub;
    if (!userId) return { success: false, error: "Not authenticated" };
    isSaving.value = true;

    try {
      const { data, error } = await supabase
        .from("subjects")
        .insert({
          user_id: userId,
          name: payload.name,
          image: payload.image,
        })
        .select();
      if (error) throw error;
      if (data?.[0]) subjects.value.unshift(data[0] as Subject);
      toast.success("Subject created!");
      return { success: true };
    } catch (err: any) {
      toast.error(`Create failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Update an existing subject.
   */
  const updateSubject = async (id: string, payload: SubjectFormPayload) => {
    isSaving.value = true;
    try {
      const { data, error } = await supabase
        .from("subjects")
        .update({ name: payload.name, image: payload.image })
        .eq("id", id)
        .select();
      if (error) throw error;
      if (data?.[0]) {
        const idx = subjects.value.findIndex((s) => s.id === id);
        if (idx !== -1) subjects.value[idx] = data[0] as Subject;
      }
      toast.success("Subject updated!");
      return { success: true };
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Delete a subject by ID.
   */
  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", id);
      if (error) throw error;
      subjects.value = subjects.value.filter((s) => s.id !== id);
      toast.success("Subject deleted.");
      return { success: true };
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
      return { success: false };
    }
  };

  return {
    subjects,
    isLoading,
    isSaving,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
});
