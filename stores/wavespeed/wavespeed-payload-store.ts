import { defineStore } from "pinia";
import { ref } from "vue";

export const useWavespeedPayloadStore = defineStore("wavespeedPayload", () => {
  const modelVersion = ref("v4");
  const width = ref(2752);
  const height = ref(4096);
  const prompt = ref(
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water."
  );
  const negative_prompt = ref(
    "(worst quality:2.0), (low quality:2.0), (normal quality:2.0), lowres, jpeg artifacts, signature, watermark, username, error, (bad anatomy:1.8), (distorted anatomy:1.8), (fused anatomy:1.8), extra limbs, extra fingers, missing fingers, detached limbs, (malformed genitals:1.8), (distorted labia:1.5), (distorted nipples:1.5), extra breasts, extra nipples, (blurred mucosal tissues:1.4), (plastic skin:1.5), (unrealistic skin texture:1.5), (over-retouched:1.4), cartoon, anime, 3d render, cgi, illustration, sketch, drawing, painting, (deformed body proportions:1.4), (unnatural skin folds:1.3), (flat lighting:1.3), (harsh shadows:1.2), (overexposed highlights:1.3), (asymmetric breasts:1.2), (messy pubic hair patterns:1.3)."
  );
  const enableSafetyChecker = ref(false);
  const enableSyncMode = ref(false);
  const enableBase64Output = ref(false);

  // 2. Helper reset (nếu cần)
  const resetPrompt = () => {
    // Logic reset về mặc định nếu cần
    prompt.value =
      "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water.";
    negative_prompt.value =
      "(worst quality:2.0), (low quality:2.0), (normal quality:2.0), lowres, jpeg artifacts, signature, watermark, username, error, (bad anatomy:1.8), (distorted anatomy:1.8), (fused anatomy:1.8), extra limbs, extra fingers, missing fingers, detached limbs, (malformed genitals:1.8), (distorted labia:1.5), (distorted nipples:1.5), extra breasts, extra nipples, (blurred mucosal tissues:1.4), (plastic skin:1.5), (unrealistic skin texture:1.5), (over-retouched:1.4), cartoon, anime, 3d render, cgi, illustration, sketch, drawing, painting, (deformed body proportions:1.4), (unnatural skin folds:1.3), (flat lighting:1.3), (harsh shadows:1.2), (overexposed highlights:1.3), (asymmetric breasts:1.2), (messy pubic hair patterns:1.3).";
  };

  return {
    modelVersion,
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
