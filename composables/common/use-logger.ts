import type { LogStatus } from "~/types";

// Global logger state (Singleton)
const globalLoggerStatus = ref<LogStatus>({
  message: "",
  type: "info",
});

const progress = ref(100);
let autoHideTimer: ReturnType<typeof setTimeout> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

export const useLogger = () => {
  const setStatus = (
    message: string,
    type: "info" | "warning" | "error" | "success" | "loading" = "info"
  ) => {
    // Clear existing timers
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
    if (progressInterval) clearInterval(progressInterval);

    // Update status
    globalLoggerStatus.value = { message, type };
    progress.value = 100;

    // Auto-hide non-loading messages
    if (type !== "loading") {
      const duration = type === "error" ? 10000 : 5000;
      const intervalStep = 100;
      const decrement = 100 / (duration / intervalStep);

      progressInterval = setInterval(() => {
        progress.value -= decrement;
        if (progress.value <= 0) {
          progress.value = 0;
          if (progressInterval) clearInterval(progressInterval);
        }
      }, intervalStep);

      autoHideTimer = setTimeout(() => {
        progress.value = 0;
        globalLoggerStatus.value = {
          message: "",
          type: "info",
        };
      }, duration);
    }
  };

  const clearStatus = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer);
    if (progressInterval) clearInterval(progressInterval);
    globalLoggerStatus.value = { message: "", type: "info" };
    progress.value = 0;
  };

  const loggerStatus = computed(() => globalLoggerStatus.value);
  const hasLogMessage = computed(
    () => globalLoggerStatus.value.message.length > 0
  );

  return {
    status: readonly(globalLoggerStatus),
    progress: readonly(progress),
    setStatus,
    clearStatus,
    loggerStatus,
    hasLogMessage,
  };
};
