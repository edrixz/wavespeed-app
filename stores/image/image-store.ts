import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { DEFAULT_IMAGE_URL } from "~/consts";
import type { ImageItem } from "~/types";

export const useImageStore = defineStore("images", () => {
  // --- STATE ---
  const images = ref<ImageItem[]>([
    {
      id: "default-img",
      url: DEFAULT_IMAGE_URL,
      file: null,
      type: "SERVER",
    },
  ]);

  // --- INTERNAL HELPERS (Không export, chỉ dùng nội bộ) ---
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

  // --- ACTIONS (Hành động sửa đổi dữ liệu) ---
  /** Thêm mới danh sách file vào store */
  const addFiles = (files: File[]) => {
    files.forEach((file) => {
      images.value.push(createItem(file));
    });
  };

  /** Thay thế ảnh tại vị trí cụ thể (dùng cho Crop/Edit) */
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

  /** Xóa ảnh tại vị trí index */
  const removeAt = (index: number) => {
    const item = images.value[index];
    if (item) {
      revokeItem(item); // Xóa URL trước
      images.value.splice(index, 1); // Xóa khỏi mảng
    }
  };

  /** Xóa toàn bộ ảnh (Dùng khi reset form hoặc logout) */
  const clearAll = () => {
    images.value.forEach(revokeItem); // Cleanup tất cả URL
    images.value = [];
  };

  // --- GETTERS (Computed) ---
  /** Lấy danh sách File object thuần túy để gửi API */
  const filesToUpload = computed(() =>
    images.value.filter((i) => i.file !== null).map((i) => i.file as File)
  );

  return {
    images,
    filesToUpload,
    addFiles,
    replaceFileAt,
    removeAt,
    clearAll,
  };
});
