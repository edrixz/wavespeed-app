import { defineStore } from "pinia";

export const useMoondreamQueryStore = defineStore("moondreamQuery", () => {
  const isGenerating = ref(false);
  const result = ref<string>("");
  const error = ref<string | null>(null);

  // Settings
  const settings = reactive({
    enable_sync_mode: true,
    enable_safety_checker: false,
    reasoning: true, // Bắt buộc bật để AI phân tích khung hình trước
  });

  // --- SYSTEM PROMPT (CREATIVE & CONTEXT-AWARE VERSION) ---
  const defaultPrompt = `
Analyze the image to identify the **Camera Framing** (Close-up, Half-body, or Full-body) and the **Outfit Mechanics** (buttons, zippers, elasticity, straps).

Based strictly on the VISIBLE visual context, write a "Positive Prompt" for Stable Diffusion describing a raw, split-second action of taking these specific clothes off.

INSTRUCTIONS FOR DYNAMIC CREATIVITY:

1. **RESPECT THE FRAMING (Crucial):**
   - If **Close-up/Portrait**: Focus purely on the neckline, straps, or buttons being undone. Describe the reveal of the neck, collarbone, and upper chest. DO NOT describe legs or pants if they are not visible.
   - If **Half-body**: Describe the top being pulled up/open. Focus on the torso, breasts, and stomach reveal.
   - If **Full-body**: Choreograph a coordinated action involving the whole body (e.g., dress pooling at ankles, or stepping out of bottoms while removing the top).

2. **SIMULATE FABRIC PHYSICS:**
   - Don't just say "taking off". Describe *how* the fabric moves based on its material.
   - Examples: Heavy denim slides slowly; tight spandex stretches and snaps; silk glides fluidly; buttons pull tight before popping open.

3. **THE ANATOMICAL REVEAL:**
   - Describe the specific body parts being exposed by *this specific action*.
   - **Mandatory Aesthetics:** Use these keywords for texture: 'turgid hardened nipples', 'real skin texture', 'sweat sheen', 'goosebumps', 'raw photo', '8k'.

4. **OUTPUT FORMAT:**
   - Write ONE continuous, highly descriptive paragraph.
   - Do not write introductory text like "Here is the prompt". Start directly with the description.
`;

  // Prompt mặc định
  const customPrompt = ref<string>(defaultPrompt);

  const setGenerating = (val: boolean) => {
    isGenerating.value = val;
    if (val) error.value = null;
  };

  const setResult = (val: string) => {
    result.value = val;
  };

  const setError = (val: string) => {
    error.value = val;
  };

  return {
    isGenerating,
    result,
    error,
    settings,
    customPrompt,
    defaultPrompt,
    setGenerating,
    setResult,
    setError,
  };
});
