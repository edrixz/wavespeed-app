import { ref, computed, onUnmounted } from "vue";
import type { ImageItem } from "~/types";

const globalImages = ref<ImageItem[]>([]);

export const useImageState = (initialData: ImageItem[] = []) => {
  globalImages.value = initialData;

  // --- Helpers ---
  const generateId = () =>
    `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const createItem = (file: File): ImageItem => ({
    id: generateId(),
    url: URL.createObjectURL(file),
    file,
    type: "LOCAL",
  });

  const revokeItem = (item: ImageItem) => {
    if (item.type === "LOCAL" && item.url) URL.revokeObjectURL(item.url);
  };

  // --- CRUD Actions ---
  const addFiles = (files: File[]) => {
    files.forEach((file) => globalImages.value.push(createItem(file)));
  };

  const replaceFileAt = (index: number, file: File) => {
    const oldItem = globalImages.value[index];
    if (!oldItem) return;

    revokeItem(oldItem); // Xóa bộ nhớ ảnh cũ

    // Thay thế bằng ảnh mới, giữ ID cũ để UI không bị giật (re-render)
    globalImages.value[index] = {
      ...createItem(file),
      id: oldItem.id,
    };
  };

  const removeAt = (index: number) => {
    revokeItem(globalImages.value[index]);
    globalImages.value.splice(index, 1);
  };

  // --- Computed ---
  const filesToUpload = computed(() =>
    globalImages.value.filter((i) => i.file !== null).map((i) => i.file as File)
  );

  // --- Cleanup ---
  onUnmounted(() => globalImages.value.forEach(revokeItem));

  return { globalImages, filesToUpload, addFiles, replaceFileAt, removeAt };
};
