import type { LogStatus } from "~/types";

export const useLogger = () => {
  // Khởi tạo trạng thái mặc định
  const loggerStatus = ref<LogStatus>({
    message: "Ready to generate.",
    type: "info",
  });

  // Hàm set status mới
  const setStatus = (
    message: string,
    type: "info" | "error" | "success" | "loading" = "info"
  ) => {
    loggerStatus.value = { message, type };
  };

  return { loggerStatus, setStatus };
};
