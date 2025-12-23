import { defineStore } from "pinia";
import { ref } from "vue";

export const useWavespeedPayloadStore = defineStore("wavespeedPayload", () => {
  const width = ref(2752);
  const height = ref(4096);
  const prompt = ref(
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water."
  );
  const negative_prompt = ref(
    "low quality, worst quality, out of focus, blurry, deformed, extra limbs, mutated hands, bad anatomy, bad proportions, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, cartoon, anime, 3d render, illustration, painting, drawing, sketch, oil painting, semi-realistic, cgi, unreal engine, octane render."
  );
  const enableSafetyChecker = ref(false);
  const enableSyncMode = ref(false);
  const enableBase64Output = ref(false);

  // 2. Helper reset (nếu cần)
  const resetPrompt = () => {
    // Logic reset về mặc định nếu cần
    prompt.value =
      "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water.";
  };

  return {
    width,
    height,
    prompt,
    negative_prompt,
    enableSafetyChecker,
    enableSyncMode,
    enableBase64Output,
    resetPrompt,
  };
});
