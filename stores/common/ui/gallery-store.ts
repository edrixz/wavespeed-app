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
  >([
    {
      id: "img-1",
      url: "https://placehold.co/300x400",
      config: {
        prompt: "A beautiful landscape",
        negative_prompt: "",
        size: "512x512",
      },
      timestamp: Date.now() - 60000,
      isSaved: true,
    },
    {
      id: "img-2",
      url: "https://placehold.co/300x400",
      config: {
        prompt: "A beautiful landscape",
        negative_prompt: "",
        size: "512x512",
      },
      timestamp: Date.now() - 60000,
      isSaved: true,
    },
  ]);

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
