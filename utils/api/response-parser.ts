/**
 * API Response Parsers
 */

import type { AnalyzedData } from "~/types/entities";

/**
 * Parse WaveSpeed API response
 */
export const parseWaveSpeedResponse = (response: any) => {
  if (!response) return null;

  return {
    imageUrl: response.data?.image_url || response.image_url,
    imageId: response.data?.image_id || response.id,
    generationTime: response.data?.generation_time || 0,
    seed: response.data?.seed,
    status: response.status || "completed",
  };
};

/**
 * Parse Gemini API response
 */
export const parseGeminiResponse = (response: any): AnalyzedData | null => {
  if (!response || !response.candidates || response.candidates.length === 0) {
    return null;
  }

  try {
    const content = response.candidates[0]?.content?.parts?.[0]?.text;
    if (!content) return null;

    // Try to parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed as AnalyzedData;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return null;
  }
};

/**
 * Extract error message from API response
 */
export const extractErrorMessage = (response: any): string => {
  if (typeof response === "string") return response;

  const message =
    response?.error?.message ||
    response?.message ||
    response?.error ||
    "Unknown error occurred";

  return typeof message === "string" ? message : JSON.stringify(message);
};

/**
 * Check if response indicates success
 */
export const isSuccessResponse = (response: any): boolean => {
  if (!response) return false;

  const status = response.status || response.code;
  const successStatuses = ["success", "completed", 200, 201];

  return (
    successStatuses.includes(status) ||
    (response.data && !response.error) ||
    (response.candidates && response.candidates.length > 0)
  );
};

/**
 * Extract pagination info from API response
 */
export const extractPaginationInfo = (response: any) => {
  return {
    total: response.total || response.data?.total || 0,
    page: response.page || response.data?.page || 1,
    pageSize: response.page_size || response.data?.page_size || 20,
    hasMore: response.has_more || false,
  };
};
