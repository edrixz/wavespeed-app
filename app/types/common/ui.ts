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

export type LogLevel = "info" | "success" | "warning" | "error" | "loading";

export type LogEntry = {
  timestamp: number;
  level: LogLevel;
  message: string;
};
