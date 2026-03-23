import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { plainPrompt, elementsToRemove } = body;

    if (!plainPrompt) {
      throw createError({
        statusCode: 400,
        statusMessage: "Plain prompt is required",
      });
    }

    if (!elementsToRemove || !Array.isArray(elementsToRemove) || elementsToRemove.length === 0) {
      // If nothing to remove, just return the same prompt
      return {
        success: true,
        data: plainPrompt,
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
You are an automated text parser. Your task is to process a text payload and exclude specific attributes based on the provided list of categories.

Categories to exclude:
[ ${removalList} ]

Instructions:
1. Identify any phrase or sentence in the payload that describes the categories listed above.
2. Exclude those phrases or sentences from the output.
3. Keep the remaining text structure and all other information exactly as it originally appeared.
4. Do not output any conversational text or markdown formatting. Output only the final edited payload.
5. If the payload becomes completely empty, output the word "Empty".

Payload:
${plainPrompt}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
      config: {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      },
    });

    if (response.promptFeedback?.blockReason === "PROHIBITED_CONTENT") {
      throw createError({
        statusCode: 400,
        statusMessage: "Nội dung văn bản (Prompt gốc) có chứa ngôn từ nhạy cảm hoặc vi phạm chính sách của Google (PROHIBITED_CONTENT). Bạn hãy thử dùng một model khác hoặc tự xoá bớt từ khoá nhạy cảm trước khi Thanh tẩy nhé!",
      });
    }

    return {
      success: true,
      data: response.text,
      rawResponse: response
    };
  } catch (error: any) {
    console.error("[Gemini Refine Prompt API Error]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
