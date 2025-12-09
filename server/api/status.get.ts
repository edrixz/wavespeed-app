// server/api/status.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const requestId = query.id;

  if (!requestId) {
    throw createError({ statusCode: 400, statusMessage: "Missing Request ID" });
  }

  try {
    const response = await $fetch(
      `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
      {
        headers: {
          Authorization: `Bearer ${config.wavespeedApiKey}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message,
    });
  }
});
