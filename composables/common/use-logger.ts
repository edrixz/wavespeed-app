// composables/useLogger.ts
import { useLoggerStore } from "~/stores/common/ui/logger-store";

const globalLoggerStatus = ref({
  message: "",
  type: "info" as "info" | "warning" | "error" | "success" | "loading",
});

const progress = ref(100);
let autoHideTimer: any = null;
let progressInterval: any = null;

export const useLogger = () => {
  const loggerStore = useLoggerStore();

  const setStatus = (
    message: string,
    type: "info" | "warning" | "error" | "success" | "loading" = "info"
  ) => {
    if (autoHideTimer) clearTimeout(autoHideTimer);
    if (progressInterval) clearInterval(progressInterval);

    globalLoggerStatus.value = { message, type };
    progress.value = 100;

    // LƯU VÀO STORE: Đẩy vào lịch sử thông báo
    loggerStore.addMessage(message, type);

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
        globalLoggerStatus.value = { message: "", type: "info" };
      }, duration);
    }
  };

  const clearStatus = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer);
    if (progressInterval) clearInterval(progressInterval);
    globalLoggerStatus.value = { message: "", type: "info" };
    progress.value = 0;
  };

  return {
    status: readonly(globalLoggerStatus),
    progress: readonly(progress),
    setStatus,
    clearStatus,
    hasLogMessage: computed(() => globalLoggerStatus.value.message.length > 0),
  };
};
