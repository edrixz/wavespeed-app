import { defineStore } from "pinia";
import { ref } from "vue";

export const useWavespeedPayloadStore = defineStore("wavespeedPayload", () => {
  const width = ref(2752);
  const height = ref(4096);
  const prompt = ref(
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water."
  );
  const negative_prompt = ref(
    "blurry, low quality, jpeg artifacts, ugly, deformed, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, signature, watermark, bad feet, distorted, mutation."
  );
  const enableSafetyChecker = ref(false);
  const enableSyncMode = ref(false);
  const enableBase64Output = ref(false);

  // 2. Helper reset (nếu cần)
  const resetSettings = () => {
    // Logic reset về mặc định nếu cần
  };

  return {
    width,
    height,
    prompt,
    negative_prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
    resetSettings,
  };
});
