// stores/common/ui/logger-store.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * Logger store for status messages and debugging
 */
export const useLoggerStore = defineStore("logger", () => {
  const messages = ref<
    Array<{
      id: string;
      message: string;
      type: "info" | "success" | "warning" | "error" | "loading";
      timestamp: number;
    }>
  >([]);

  const currentStatus = ref<{
    message: string;
    type: "info" | "success" | "warning" | "error" | "loading";
  }>({
    message: "",
    type: "info",
  });

  /**
   * Set status message
   */
  const setStatus = (
    message: string,
    type: "info" | "success" | "warning" | "error" | "loading" = "info"
  ) => {
    currentStatus.value = { message, type };
    addMessage(message, type);
  };

  /**
   * Add message to log
   */
  const addMessage = (
    message: string,
    type: "info" | "success" | "warning" | "error" | "loading" = "info"
  ) => {
    messages.value.push({
      id: `msg-${Date.now()}`,
      message,
      type,
      timestamp: Date.now(),
    });

    // Keep only last 50 messages
    if (messages.value.length > 50) {
      messages.value.shift();
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    messages.value = [];
  };

  /**
   * Get messages by type
   */
  const getMessagesByType = (type: string) => {
    return messages.value.filter((m) => m.type === type);
  };

  /**
   * Check if has any log message
   */
  const hasLogMessage = computed(() => messages.value.length > 0);

  return {
    messages,
    currentStatus,
    hasLogMessage,
    setStatus,
    addMessage,
    clearMessages,
    getMessagesByType,
  };
});
