// composables/features/use-settings-form.ts
import { storeToRefs } from "pinia";
import { useWavespeedPayloadStore } from "~/stores/wavespeed-payload-store";

export const useSettingsForm = () => {
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

  // DATA: Định nghĩa các tỷ lệ
  const ratiosData = {
    square: [{ label: "1:1", w: 1, h: 1 }],
    vertical: [
      { label: "3:4", w: 3, h: 4 },
      { label: "2:3", w: 2, h: 3 },
      { label: "9:16", w: 9, h: 16 },
    ],
    horizontal: [
      { label: "4:3", w: 4, h: 3 },
      { label: "3:2", w: 3, h: 2 },
      { label: "16:9", w: 16, h: 9 },
    ],
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
  };
};
