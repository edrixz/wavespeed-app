/**
 * UI-related types (toast, modal, notifications, etc.)
 */

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
};
