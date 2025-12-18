import type { LogStatus } from "~/types";

// 1. Đưa state ra ngoài hàm để nó trở thành Global (Singleton)
// Chỉ khởi tạo 1 lần duy nhất trong suốt vòng đời App
const globalLoggerStatus = ref<LogStatus>({
  message: "",
  type: "info",
});

const progress = ref(100); // Biến phần trăm
let autoHideTimer: ReturnType<typeof setTimeout> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

export const useLogger = () => {
  // 2. Hàm setStatus cập nhật vào biến Global đó
  const setStatus = (
    message: string,
    type: "info" | "warning" | "error" | "success" | "loading" = "info"
  ) => {
    // Xóa tất cả timer đang chạy
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
    }
    if (progressInterval) clearInterval(progressInterval);

    // 2. Cập nhật Status
    globalLoggerStatus.value = { message, type };
    progress.value = 100; // Reset thanh progress về đầy

    // 3. Nếu không phải là trạng thái 'loading', tự động xóa sau 15s
    // (Thường loading sẽ chờ xử lý xong mới gọi setStatus khác nên không nên tự xóa)
    if (type !== "loading") {
      const duration = 10000; // 15 giây
      const intervalStep = 100; // Cập nhật mỗi 100ms
      const decrement = 100 / (duration / intervalStep);

      // Chạy thanh progress ngược
      progressInterval = setInterval(() => {
        progress.value -= decrement;
        if (progress.value <= 0) {
          progress.value = 0;
          if (progressInterval) clearInterval(progressInterval);
        }
      }, intervalStep);

      // Timer để ẩn message
      autoHideTimer = setTimeout(() => {
        // 1. Reset progress về 0 trước để tạo hiệu ứng kết thúc thanh bar
        progress.value = 0;

        // 2. Đợi một chút rồi mới xóa message để kích hoạt hiệu ứng trượt layout
        setTimeout(() => {
          clearStatus();
        }, 200);
      }, duration);
    }
  };

  const clearStatus = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer);
    if (progressInterval) clearInterval(progressInterval);
    globalLoggerStatus.value = { message: "", type: "info" };
    progress.value = 0;
  };

  const hasLogMessage = computed(() => globalLoggerStatus.value.message !== "");

  // 3. Trả về biến Global
  return {
    hasLogMessage,
    loggerStatus: globalLoggerStatus,
    progress,
    setStatus,
    clearStatus,
  };
};
