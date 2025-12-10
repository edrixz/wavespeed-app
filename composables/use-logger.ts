import type { LogEntry } from "~/types";

export const useLogger = () => {
  const logs = ref<LogEntry[]>([]);

  const addLog = (
    message: string,
    type: "info" | "error" | "success" = "info"
  ) => {
    logs.value.push({
      time: new Date().toLocaleTimeString(),
      message,
      type,
    });
  };

  return { logs, addLog };
};
