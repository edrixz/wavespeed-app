// app/server/api/gemini/segment.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { imageUrl } = body;

    if (!imageUrl)
      throw createError({
        statusCode: 400,
        statusMessage: "Image URL is required",
      });

    // Giả lập thời gian AI phân tích ảnh (2 giây)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // MOCK DATA: Giả lập trả về 2 chủ thể kèm theo ảnh Mask (Base64 trong suốt, có hình khối trắng).
    // Thực tế đây sẽ là mảng chứa Base64 Mask hoặc Polygon coordinates từ AI model.
    return {
      success: true,
      data: {
        subjects: [
          {
            id: "subject-1",
            name: "Chủ thể chính (Người)",
            // Một hàm nhỏ phía Frontend sẽ giả lập vẽ hình tròn vào mask nếu không có base64 thực tế
            mockType: "center-circle",
          },
          {
            id: "subject-2",
            name: "Đồ vật phụ",
            mockType: "bottom-rect",
          },
        ],
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
