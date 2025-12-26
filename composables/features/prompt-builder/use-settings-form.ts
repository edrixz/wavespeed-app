// composables/features/use-settings-form.ts
import { storeToRefs } from "pinia";
import { useWavespeedPayloadStore } from "~/stores/wavespeed-payload-store";

export const useSettingsForm = () => {
  const toast = useToast();
  const payloadStore = useWavespeedPayloadStore();

  // Destructure refs để dùng trực tiếp trong template với v-model
  const {
    width,
    height,
    prompt,
    negative_prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
  } = storeToRefs(payloadStore);

  const isBuilderMode = ref(false);

  // --- LOGIC: Toggle Mode ---
  const toggleBuilderMode = () => {
    isBuilderMode.value = !isBuilderMode.value;
  };

  const applySimplePreset = (data: {
    prompt: string;
    negative_prompt: string;
    size: string;
  }) => {
    // 1. Cập nhật Text]
    prompt.value = data.prompt;
    negative_prompt.value = data.negative_prompt || "";

    // 2. Xử lý Size (Tách 2752*4096 -> width: 2752, height: 4096)]
    const [w, h] = data.size.split("*");
    width.value = parseInt(w);
    height.value = parseInt(h);

    toast.success("Applied Simple Preset!");
  };

  // --- LOGIC: Reset ---
  const resetToDefault = () => {
    payloadStore.resetPrompt();
    // Mặc định về Ultra Portrait như cấu hình ban đầu của bạn
    width.value = 2752;
    height.value = 4096;
  };

  return {
    // State
    isBuilderMode,
    width,
    height,
    prompt,
    negative_prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,

    // Computed & Methods
    resetToDefault,
    toggleBuilderMode,
    applySimplePreset,
  };
};
