/**
 * API Payload Builders
 */

import type { Subject, Scene, AnalyzedData } from "~/types/entities";

/**
 * Xây dựng payload cho WaveSpeed API
 */
export const buildWaveSpeedPayload = (subject: Subject, scene: Scene) => {
  return {
    model: "flux",
    prompt: "", // Will be populated by prompt assembler
    aspect_ratio: subject.pose?.aspectRatio?.value || "1:1",
    guidance: 7.5,
    num_inference_steps: 25,
    safety_tolerance: 2,
  };
};

/**
 * Xây dựng payload cho Gemini Analysis API
 */
export const buildGeminiAnalysisPayload = (imageData: string) => {
  return {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData,
            },
          },
          {
            text: "Analyze this image in detail and return structured JSON with analysis of: subject demographics, face features, hair details, outfit/clothing, pose/action, environment, technical photo details, and suggest aspect ratio.",
          },
        ],
      },
    ],
  };
};

/**
 * Xác thực payload trước khi gửi
 */
export const validatePayload = (payload: any): boolean => {
  if (!payload) return false;
  if (typeof payload !== "object") return false;

  // Validate required fields based on payload type
  if (payload.model && !payload.prompt) return false;
  if (payload.contents && !Array.isArray(payload.contents)) return false;

  return true;
};

/**
 * Xây dựng tham số phân trang
 */
export const buildPaginationParams = (page: number, pageSize: number = 20) => {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
};

/**
 * Xây dựng tham số lọc
 */
export const buildFilterParams = (filters: Record<string, any>) => {
  const params: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params[key] = value;
    }
  });

  return params;
};
