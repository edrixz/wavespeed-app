import { defineStore } from "pinia";

export const useGalleryStore = defineStore("session-gallery", () => {
  const items = ref<
    Array<{
      id: string;
      url: string;
      config: {
        prompt: string;
        negative_prompt: string;
        size: string;
      };
      timestamp: number;
      isSaved: boolean; // Trạng thái đã lưu vào DB hay chưa
    }>
  >([]);

  const addGeneratedItem = (url: string, config: any) => {
    items.value.unshift({
      id: `img-${Date.now()}`,
      url,
      config,
      timestamp: Date.now(),
      isSaved: false,
    });
  };

  const removeItem = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id);
  };

  const clearSession = () => {
    items.value = [];
  };

  return { items, addGeneratedItem, removeItem, clearSession };
});
