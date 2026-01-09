export const usePresetManager = () => {
  const toast = useToast();
  const presetStore = usePresetStore();

  const createPreset = async (data: any) => {
    try {
      await presetStore.savePreset(data);
      toast.success("Preset created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create preset");
      return false;
    }
  };

  const updatePreset = async (id: string, data: any) => {
    try {
      await presetStore.updatePreset(id, data);
      toast.success("Preset updated successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update preset");
      return false;
    }
  };

  const deletePreset = async (id: string) => {
    try {
      await presetStore.deletePreset(id);
      toast.success("Preset deleted successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete preset");
      return false;
    }
  };

  return {
    createPreset,
    updatePreset,
    deletePreset,
  };
};
