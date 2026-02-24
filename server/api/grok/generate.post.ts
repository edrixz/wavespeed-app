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

  const ENDPOINTS =
    "https://api.wavespeed.ai/api/v3/x-ai/grok-imagine-image/edit";

  try {
    const response = await $fetch(ENDPOINTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.wavespeedApiKey}`,
      },
      body: body,
    });
    return response;
  } catch (error: any) {
    // --- Log chi tiết lỗi ra Terminal để debug ---
    console.error(
      "❌ WAVESPEED API ERROR:",
      JSON.stringify(error.data, null, 2),
    );

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || "Unknown Error",
      data: error.data,
    });
  }
});
