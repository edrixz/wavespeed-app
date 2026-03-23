import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { DEFAULT_IMAGE_URL } from "~/consts/common/image";
import type { ImageItem } from "~/types";

export const useImagesStore = defineStore("images", () => {
  const images = ref<ImageItem[]>([
    {
      id: "default-img",
      url: DEFAULT_IMAGE_URL,
      file: null,
      type: "SERVER",
    },
  ]);

  const generateId = () =>
    `img_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const createItem = (file: File): ImageItem => ({
    id: generateId(),
    url: URL.createObjectURL(file), // Tạo blob URL
    file,
    type: "LOCAL",
  });

  const revokeItem = (item: ImageItem) => {
    if (item.type === "LOCAL" && item.url) {
      URL.revokeObjectURL(item.url); // Giải phóng bộ nhớ trình duyệt
    }
  };

  // Thêm mới danh sách file vào store
  const addFiles = (files: File[]) => {
    files.forEach((file) => {
      images.value.push(createItem(file));
    });
  };

  // Thêm mới ảnh từ URL có sẵn từ Subjects
  const addUrl = (url: string) => {
    images.value.push({
      id: generateId(),
      url,
      file: null,
      type: "SERVER",
    });
  };

  // Thay thế ảnh tại vị trí cụ thể bằng file
  const replaceFileAt = (index: number, file: File) => {
    const oldItem = images.value[index];
    if (!oldItem) return;

    // Xóa URL của ảnh cũ để tránh memory leak
    revokeItem(oldItem);

    // Thay bằng ảnh mới nhưng giữ nguyên ID cũ (để tránh UI bị giật)
    images.value[index] = {
      ...createItem(file),
      id: oldItem.id,
    };
  };

  // Thay thế ảnh tại vị trí cụ thể bằng URL
  const replaceUrlAt = (index: number, url: string) => {
    const oldItem = images.value[index];
    if (!oldItem) return;

    revokeItem(oldItem);

    images.value[index] = {
      id: oldItem.id,
      url,
      file: null,
      type: "SERVER",
    };
  };

  // Xóa ảnh tại vị trí index
  const removeAt = (index: number) => {
    const item = images.value[index];
    if (item) {
      revokeItem(item); // Xóa URL trước
      images.value.splice(index, 1); // Xóa khỏi mảng
    }
  };

  // Xóa toàn bộ ảnh
  const clearAll = () => {
    images.value.forEach(revokeItem); // Cleanup tất cả URL
    images.value = [];
  };

  // Lấy danh sách File object thuần túy để gửi API
  const filesToUpload = computed(() =>
    images.value.filter((i) => i.file !== null).map((i) => i.file as File),
  );

  return {
    images,
    filesToUpload,
    addFiles,
    addUrl,
    replaceFileAt,
    replaceUrlAt,
    removeAt,
    clearAll,
  };
});
