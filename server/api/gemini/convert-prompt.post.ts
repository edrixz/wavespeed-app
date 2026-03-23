import { GoogleGenAI } from "@google/genai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { jsonPrompt } = body;

    if (!jsonPrompt) {
      throw createError({
        statusCode: 400,
        statusMessage: "JSON prompt is required",
      });
    }

    const config = useRuntimeConfig(event);
    if (!config.geminiApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Gemini API Key is missing",
      });
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

    const prompt = `
      Bạn là chuyên gia phân tích và lên cấu trúc prompt cho các mô hình AI tạo ảnh (Midjourney, Stable Diffusion). 
      Nhiệm vụ của bạn là đọc hiểu cấu trúc phân mảnh của một file JSON prompt và chuyển đổi nó thành MỘT đoạn prompt văn bản thuần túy (plain text) bằng TIẾNG ANH.
      
      QUY TẮC TUYỆT ĐỐI: 
      1. KHÔNG sử dụng dấu hoa thị (*), dấu thăng (#) hay định dạng Markdown.
      2. KHÔNG bình luận hay giải thích thêm. Chỉ trả về kết quả.
      3. BẮT BUỘC giữ lại ĐẦY ĐỦ giá trị và ý nghĩa từ nội dung của khối JSON gốc, không được bỏ sót thông tin. Dịch/format những thông tin bị rời rạc thành văn bản tự nhiên, mượt mà bằng Tiếng Anh.
      
      CẤU TRÚC ĐẦU RA BẮT BUỘC: 
      Chuyển đổi các thông tin tương ứng vào các đề mục sau đây. Bạn cần chia đúng nội dung, giữa mỗi mục cách nhau 1 dòng trắng.

      The Subject: [Tổ hợp các chi tiết về chủ thể như Mô tả nhân vật, Biểu cảm, Khuôn mặt, Mắt mũi...]

      Hair & Body: [Tất cả thiết lập về Tóc, Kiểu tóc, Vóc dáng cơ thể, Body...]

      Pose & Composition: [Tư thế, Cấu trúc khung hình, Góc máy camera...]

      Setting & Environment: [Bối cảnh, Môi trường, Hậu cảnh, Thời tiết, Không gian...]

      Photography & Lighting: [Kiểu chụp, Thông số nhiếp ảnh, Phong cách chiếu sáng, Nguồn sáng, Chất lượng...]

      The Vibe & Story: [Năng lượng, Vibe, Concept nghệ thuật, Câu chuyện, Cảm xúc tổng thể...]

      ---
      DỮ LIỆU JSON ĐẦU VÀO CẦN PHÂN TÍCH:
      ${jsonPrompt}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
    });

    return {
      success: true,
      data: response.text,
    };
  } catch (error: any) {
    console.error("[Gemini Convert Prompt API Error]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
