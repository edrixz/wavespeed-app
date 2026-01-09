/**
 * Stores barrel export
 * Organized by domain: common, image, prompt, wavespeed
 * Direct exports used to prevent circular dependencies with auto-imports
 */

// Common stores (Auth & UI)
export { useAuthStore } from "./common/auth-store";
export { useToastStore } from "./common/ui/toast-store";
export { useLoggerStore } from "./common/ui/logger-store";

// Image stores
export { useImageStore } from "./image/image-store";
export { useUploadImageStore } from "./image/upload-image-store";

// Prompt stores
export { usePromptBuilderStore } from "./prompt/prompt-builder-store";
export { useAiGeneratedPromptStore } from "./prompt/ai-generated-prompt-store";
export { usePresetStore } from "./prompt/preset-store";
export { useSimplePresetStore } from "./prompt/simple-prompt-preset-store";

// WaveSpeed stores
export { useWavespeedPayloadStore } from "./wavespeed/wavespeed-payload-store";
