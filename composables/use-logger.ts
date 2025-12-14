import type { LogStatus } from "~/types";

// 1. Đưa state ra ngoài hàm để nó trở thành Global (Singleton)
// Chỉ khởi tạo 1 lần duy nhất trong suốt vòng đời App
const globalLoggerStatus = ref<LogStatus>({
  message: "Ready to generate.",
  type: "info",
});

export const useLogger = () => {
  // 2. Hàm setStatus cập nhật vào biến Global đó
  const setStatus = (
    message: string,
    type: "info" | "warning" | "error" | "success" | "loading" = "info"
  ) => {
    console.log(`[Logger] ${type.toUpperCase()}: ${message}`);
    
    // Gán object mới để trigger reactivity
    globalLoggerStatus.value = { message, type };
  };

  // 3. Trả về biến Global
  return { 
    loggerStatus: globalLoggerStatus, 
    setStatus 
  };
};
