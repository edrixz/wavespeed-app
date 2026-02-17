// stores/toastStore.ts
import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  /**
   * Thêm một thông báo mới
   */
  const addToast = (
    message: string,
    type: ToastType = "success",
    duration = 3000
  ) => {
    const id = Date.now();
    toasts.value.push({ id, message, type, duration });

    // Tự động xóa sau thời gian chỉ định
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, addToast, removeToast };
});
