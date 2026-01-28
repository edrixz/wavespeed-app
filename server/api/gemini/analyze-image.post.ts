// FILE: server/api/gemini/analyze-image.post.ts
import { GoogleGenAI } from "@google/genai";
import { analysisSchema } from "~/consts/gemini/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { images, mode } = body;

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw createError({ statusCode: 400, message: "No images provided" });
  }

  const config = useRuntimeConfig();

  // Khởi tạo SDK @google/genai
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  // Mapping model name chuẩn của SDK mới
  // Lưu ý: mode 'pro' sẽ dùng flash (mạnh hơn flash-lite) hoặc pro nếu bạn có quyền
  const modelName = mode === "pro" ? "gemini-1.5-flash" : "gemini-1.5-flash-8b";

  // SYSTEM PROMPT CỦA BẠN (High-End Reverse Engineering)
  const systemPrompt = `
    SYSTEM ROLE: You are a High-End Image Reverse-Engineering Expert. Your goal is to deconstruct images into hyper-detailed technical metadata for 99% visual reconstruction.

    CORE INSTRUCTIONS:
    1. QUANTITATIVE DATA: Use numbers and technical units (e.g., "35mm focal length," "85% opacity").
    2. PHOTOREALISM TERMINOLOGY: Use terms like "Subsurface scattering," "Ray-traced reflections," "Chiaroscuro."
    3. MATERIAL PHYSICS: Describe light interaction—sheen, matte finish, fabric tension.
    4. MICRO-DETAILS: Identify pores, weave patterns, skin indentation.
    5. STRICT EMPTY RULE: If a detail is invisible, return empty strings.

    BILINGUAL STRUCTURAL MIRRORING (CRITICAL):
    - "label_vi" MUST mirror the exact structure of "value". 
    - Use commas to separate ideas.
    - Example:
      "value": "Slender build, defined skeletal frame",
      "label_vi": "Vóc dáng mảnh mai, khung xương rõ nét"

    OUTPUT: Return ONLY a valid JSON object following the schema categories (subject, clothing, pose, etc.).
  `;

  // Hàm xử lý từng ảnh
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
          responseSchema: analysisSchema, // Ép kiểu trả về theo Schema đã định nghĩa
        },
      });

      // SDK mới trả về text trực tiếp hoặc qua method text()
      const jsonText = result.text;
      if (!jsonText) return null;
      return JSON.parse(jsonText);
    } catch (err) {
      console.error("Gemini Single Image Error:", err);
      return null; // Bỏ qua ảnh lỗi, không làm chết cả process
    }
  };

  try {
    // Chạy song song để tối ưu tốc độ
    const results = await Promise.all(
      images.map((img: string) => analyzeSingleImage(img)),
    );

    // Lọc bỏ các kết quả null (nếu có ảnh lỗi)
    return results.filter((r) => r !== null);
  } catch (error: any) {
    console.error("Gemini Batch Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Gemini API Error",
    });
  }
});
