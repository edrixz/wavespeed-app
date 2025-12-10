export type LogEntry = {
  time: string;
  message: string;
  type: "info" | "error" | "success";
};
