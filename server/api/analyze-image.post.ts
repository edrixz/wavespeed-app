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
      You are an expert AI Art Prompter and Photographer. 
      Analyze this image deeply to create a high-quality text-to-image prompt.
      Focus heavily on:
      1. Physical details (skin texture, fabric material, hair physics).
      2. Lighting nuances (direction, color, intensity).
      3. Camera specifics (focal length, depth of field, film grain).
      4. Artistic style and atmosphere.
      
      Be precise. Use professional photography terminology.
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
      statusCode: 500,
      message: error.message || "Failed to analyze image",
      data: error,
    });
  }
});
