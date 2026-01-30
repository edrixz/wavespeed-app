import {
  MoondreamRequestBody,
  MoondreamResponse,
} from "~/types/api/moondream-query";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Đọc body theo đúng chuẩn MoondreamRequestBody
  const body = await readBody<MoondreamRequestBody>(event);

  if (!config.wavespeedApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API Key not configured",
    });
  }

  // Validate cơ bản
  if (!body.image || !body.image.startsWith("http")) {
    throw createError({ statusCode: 400, message: "Invalid image URL" });
  }

  const ENDPOINT =
    "https://api.wavespeed.ai/api/v3/wavespeed-ai/moondream3-preview/query";

  try {
    console.log(`[MOONDREAM] Analysis Request: ${body.image}`);

    // Forward thẳng body sang Wavespeed
    const response = await $fetch<MoondreamResponse>(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.wavespeedApiKey}`,
      },
      body: body, // Gửi nguyên cục body đã chuẩn
    });

    return { result: response.answer };
  } catch (error: any) {
    console.error("❌ MOONDREAM ERROR:", error.data || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || "Moondream Failed",
      data: error.data,
    });
  }
});
