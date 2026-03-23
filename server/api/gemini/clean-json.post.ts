import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { jsonPrompt, elementsToRemove } = body;

    if (!jsonPrompt) {
      throw createError({
        statusCode: 400,
        statusMessage: "JSON prompt is required",
      });
    }

    if (!elementsToRemove || !Array.isArray(elementsToRemove) || elementsToRemove.length === 0) {
      return {
        success: true,
        data: jsonPrompt,
      };
    }

    const config = useRuntimeConfig(event);
    if (!config.geminiApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Gemini API Key is missing",
      });
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

    const removalList = elementsToRemove.join(", ");

    const prompt = `
Bạn là chuyên gia xử lý dữ liệu JSON. Nhiệm vụ của bạn là đọc một đoạn JSON Payload và lược bỏ các thông tin không cần thiết.

Hãy TÌM VÀ XOÁ BỎ hoàn toàn bất kỳ field (khoá) hoặc đoạn giá trị nào mô tả về các danh mục sau:
[ ${removalList} ]

QUY TẮC:
1. Bạn phải giữ nguyên vẹn cấu trúc JSON gốc (giữ nguyên các key khác, mảng, object...).
2. Chỉ xoá thông tin liên quan đến các danh mục bị yêu cầu.
3. Không tự ý bịa thêm dữ liệu. 
4. Trả về KẾT QUẢ ĐẦU RA LÀ JSON THUẦN TUÝ. KHÔNG sử dụng ký tự đánh dấu markdown như \`\`\`json. Không giải thích gì thêm.

--- JSON ĐẦU VÀO ---
${jsonPrompt}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
    });

    if (response.promptFeedback?.blockReason === "PROHIBITED_CONTENT") {
      throw createError({
        statusCode: 400,
        statusMessage: "Nội dung JSON gốc chứa từ khoá vi phạm chính sách nội dung của Google. Hệ thống đã huỷ tiến trình làm sạch. Vui lòng tự chỉnh sửa lại các từ khoá cực đoan trước khi thử lại.",
      });
    }

    let cleanJson = response.text || "";
    // Xoá viền markdown nếu AI vẫn cố chấp trả về
    cleanJson = cleanJson.replace(/^```json\n?/i, "").replace(/\n?```$/i, "");

    return {
      success: true,
      data: cleanJson,
      rawResponse: response
    };
  } catch (error: any) {
    console.error("[Gemini Clean JSON API Error]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
