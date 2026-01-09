import { storeToRefs } from "pinia";
import { useWavespeedPayloadStore } from "~/stores";

// server/api/generate.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const modelVersion = getHeader(event, "x-model-version") || "v4.5";
  const body = await readBody(event);

  if (!config.wavespeedApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API Key not configured",
    });
  }

  const ENDPOINTS = {
    v4: "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4/edit",
    "v4.5": "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4.5/edit",
  };

  const targetUrl =
    ENDPOINTS[modelVersion as keyof typeof ENDPOINTS] || ENDPOINTS["v4.5"];

  try {
    console.log(`[${modelVersion.toUpperCase()}] `);
    console.log(`[${targetUrl}] `);

    const response = await $fetch(targetUrl, {
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
