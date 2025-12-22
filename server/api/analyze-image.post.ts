import { GoogleGenAI } from "@google/genai";
import { schema } from "~/consts";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageBase64, mode } = body;

  if (!imageBase64) {
    throw createError({ statusCode: 400, message: "No image provided" });
  }

  const config = useRuntimeConfig();

  // KHỞI TẠO SDK MỚI (@google/genai)
  // Lưu ý: SDK này tự động chọn API version mới nhất, tránh lỗi 404
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  // 1. CHỌN MODEL
  // - Fast: Dùng flash-lite (Nhanh, Rẻ)
  // - Pro: Dùng flash (Thông minh, Suy luận sâu)
  const modelName =
    mode === "pro" ? "gemini-2.5-flash" : "gemini-2.5-flash-lite";

  // --- 3. XỬ LÝ ẢNH ---
  let finalBase64Data = "";

  try {
    if (imageBase64.startsWith("http")) {
      const imageResponse = await fetch(imageBase64);
      if (!imageResponse.ok)
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      const arrayBuffer = await imageResponse.arrayBuffer();
      finalBase64Data = Buffer.from(arrayBuffer).toString("base64");
    } else if (imageBase64.includes("base64,")) {
      finalBase64Data = imageBase64.split(",")[1];
    } else {
      finalBase64Data = imageBase64;
    }

    // --- PROMPT MẠNH HƠN ---
    // Yêu cầu AI đóng vai là một chuyên gia nhiếp ảnh
    const systemPrompt = `
      SYSTEM ROLE: You are a High-End Image Reverse-Engineering Expert. Your goal is to deconstruct images into hyper-detailed technical metadata for 90% visual reconstruction.

      INSTRUCTIONS FOR DESCRIPTION FIELDS:
      1. QUANTITATIVE DATA: Use numbers and technical units where possible (e.g., "35mm focal length," "85% opacity," "45-degree angle").
      2. PHOTOREALISM TERMINOLOGY: Use terms like "Subsurface scattering," "Ray-traced reflections," "Chromatic aberration," and "Depth of field."
      3. MATERIAL PHYSICS: Describe how light interacts with surfaces—sheen, matte finish, translucency, or specular highlights.
      4. MICRO-DETAILS: For faces, look for pores, fine lines, and iris textures. For outfits, identify weave patterns and stitching.
      5. STRICT EMPTY RULE: If a detail is truly invisible (e.g., hands are hidden), return exactly "". DO NOT omit any key.

      OUTPUT: Return ONLY a valid JSON object.
    `;

    const result = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: finalBase64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = result.text;

    if (!jsonText) throw new Error("Empty response from AI");

    const cleanedText = jsonText.replace(/```json|```/g, "").trim();

    return { result: JSON.parse(cleanedText) };
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: "Gemini API Error",
      message: error.response?._data?.error?.message || error.message,
      data: error.response?._data,
    });
  }
});
