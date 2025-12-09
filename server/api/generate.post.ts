// server/api/generate.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!config.wavespeedApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API Key not configured",
    });
  }

  const url = "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4.5/edit";

  try {
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.wavespeedApiKey}`,
      },
      body: body,
    });
    return response;
  } catch (error: any) {
    // --- QUAN TRỌNG: Log chi tiết lỗi ra Terminal để debug ---
    console.error(
      "❌ WAVESPEED API ERROR:",
      JSON.stringify(error.data, null, 2)
    );

    // Trả lỗi chi tiết về Client thay vì lỗi chung chung
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || "Unknown Error",
      data: error.data, // Gửi kèm data lỗi
    });
  }
});
