// server/api/gemini/analyze.post.ts
import { GoogleGenAI } from "@google/genai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { imageUrl } = body;

    if (!imageUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: "Image URL is required",
      });
    }

    const config = useRuntimeConfig(event);
    if (!config.geminiApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Gemini API Key is missing in server configuration.",
      });
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch image from URL: ${imageResponse.statusText}`,
      );
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Prompt đã được làm sạch hoàn toàn khỏi Markdown
    const prompt = `
      Bạn là chuyên gia phân tích hình ảnh AI. 
      YÊU CẦU TỐI THƯỢNG: Trả về kết quả hoàn toàn bằng VĂN BẢN THUẦN TÚY (PLAIN TEXT). TUYỆT ĐỐI KHÔNG sử dụng bất kỳ ký tự Markdown nào như dấu sao (*), dấu thăng (#), hay dấu gạch ngang (-). 

      Nhiệm vụ của bạn gồm 2 phần. Bạn BẮT BUỘC phải đặt chính xác chuỗi ký tự "[SPLIT_TOKEN_HERE]" vào giữa 2 phần này.

      PHẦN A: PHÂN TÍCH TIẾNG VIỆT
      Viết thành các đoạn văn ngắn gọn, không dùng gạch đầu dòng:
      1. Đối tượng chính: Mô tả tuổi, sắc tộc, phong cách, khuôn mặt, biểu cảm, làn da, vóc dáng, tóc, makeup.
      2. Trang phục và phụ kiện: Mô tả outfit, chất liệu, phụ kiện.
      3. Tư thế và Bố cục: Mô tả tư thế, góc máy.
      4. Bối cảnh và Môi trường: Mô tả không gian, ánh sáng.
      5. Cảm xúc và Câu chuyện: Mô tả năng lượng, câu chuyện.

      [SPLIT_TOKEN_HERE]

      PHẦN B: PROMPT TIẾNG ANH
      Viết prompt tiếng Anh chi tiết. KHÔNG dùng gạch đầu dòng. Viết theo format sau:

      1. THE SUBJECT
      Description: [Mô tả chi tiết]
      Face and Makeup: [Mô tả chi tiết]
      Hair: [Mô tả chi tiết]
      Physique and Pose: [Mô tả chi tiết]

      2. CLOTHING AND ACCESSORIES
      Outfit: [Mô tả chi tiết]
      Accessories: [Mô tả chi tiết]

      3. SETTING AND ATMOSPHERE
      Environment: [Mô tả chi tiết]
      Details: [Mô tả chi tiết]
      Lighting: [Mô tả chi tiết]

      4. PHOTOGRAPHY STYLE
      Style: [Mô tả chi tiết]
      Shot Type: [Mô tả chi tiết]
      Texture and Depth: [Mô tả chi tiết]

      5. VIBE AND STORY
      Concept: [Mô tả chi tiết]
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType,
          },
        },
      ],
    });

    return {
      success: true,
      data: response.text,
    };
  } catch (error: any) {
    console.error("[Gemini Analyze API Error]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
