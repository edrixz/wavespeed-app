import { GoogleGenAI } from "@google/genai";
import { analysisSchema } from "~/consts/gemini/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { images, mode } = body;

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw createError({ statusCode: 400, message: "No images provided" });
  }

  const config = useRuntimeConfig();
  if (!config.geminiApiKey) {
    throw createError({ statusCode: 500, message: "Gemini API Key missing" });
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  const modelName =
    mode === "pro" ? "gemini-2.5-flash" : "gemini-2.5-flash-lite";

  // --- NÂNG CẤP SYSTEM PROMPT ---
  const systemPrompt = `
    ROLE: You are a World-Class Director of Photography and AI Prompt Engineer.
    OBJECTIVE: Reverse-engineer the provided image into a hyper-detailed text prompt for Stable Diffusion/Midjourney.
    
    INSTRUCTIONS:
    1. ANALYZE DEEPLY: Don't just say "a girl". Describe "a young woman with porcelain skin, sharp jawline, high cheekbones".
    2. LIGHTING & ATMOSPHERE: Identify specific lighting (volumetric, rim light, chiaroscuro, cinematic, softbox) and mood.
    3. MATERIALITY: Describe textures vividly (silk, matte leather, rusted metal, subsurface scattering on skin).
    4. CAMERA INFO: Estimate focal length (e.g., 85mm portrait), depth of field (bokeh), and angle.
    
    STRICT JSON OUTPUT RULES:
    - You must fill the JSON schema exactly.
    - "value": The high-quality English prompt segment.
    - "label_vi": A professional Vietnamese translation of the "value".
    - Do not include markdown code blocks. Just the raw JSON object.
  `;

  const analyzeSingleImage = async (base64Str: string) => {
    try {
      const cleanBase64 = base64Str.replace(/^data:image\/\w+;base64,/, "");

      const result = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: cleanBase64,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        },
      });

      const jsonText = result.text;
      if (!jsonText) return null;
      return JSON.parse(jsonText);
    } catch (err: any) {
      console.error(`Gemini Error (${modelName}):`, err.message);
      return null;
    }
  };

  try {
    const results = await Promise.all(
      images.map((img: string) => analyzeSingleImage(img)),
    );
    const validResults = results.filter((r) => r !== null);

    if (validResults.length === 0) throw new Error("Analysis failed");

    return validResults;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Gemini API Error",
    });
  }
});
