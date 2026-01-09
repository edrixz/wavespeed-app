/**
 * Common stores - Authentication & UI
 * Avoid circular dependencies by using direct imports instead of ./ui/index.ts
 */
export { useAuthStore } from "./auth-store";

// UI stores - exported separately to prevent circular dependencies
export { useToastStore } from "./ui/toast-store";
export { useLoggerStore } from "./ui/logger-store";
