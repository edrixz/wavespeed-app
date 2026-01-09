/**
 * Data normalization utilities
 * Converts raw data to standardized formats
 */

import { formatTitleCase } from "./text";

/**
 * Normalize gender string to standard values
 * Handles various input formats and converts to enum values
 */
export const normalizeGender = (input: string | undefined): string => {
  if (!input) return "Female";

  const lower = input.toLowerCase();

  // Map các từ đồng nghĩa về chuẩn "Female" / "Male"
  if (["female", "woman", "girl", "lady"].some((w) => lower.includes(w))) {
    return "Female";
  }
  if (["male", "man", "boy", "gentleman"].some((w) => lower.includes(w))) {
    return "Male";
  }

  // Nếu không khớp logic trên thì format Title Case bình thường
  return formatTitleCase(input);
};

/**
 * Normalize object by recursively trimming strings and removing empty values
 * @example normalizeObject({name: " John ", age: "", email: "test@test.com"})
 *          => {name: "John", email: "test@test.com"}
 */
export const normalizeObject = <T extends Record<string, any>>(
  obj: T | undefined
): Partial<T> => {
  if (!obj) return {} as T;
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) result[key] = formatTitleCase(trimmed);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      const normalized = normalizeObject(value);
      if (Object.keys(normalized).length > 0) {
        result[key] = normalized;
      }
    } else if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          (typeof item !== "string" || item.trim() !== "")
      );
      if (filtered.length > 0) result[key] = filtered;
    } else if (value !== false && value !== 0) {
      result[key] = value;
    }
  }

  return result;
};

/**
 * Normalize color hex code
 * @example normalizeColor("fff") => "#FFFFFF"
 */
export const normalizeColor = (color: string | undefined): string => {
  if (!color) return "";
  const hex = color.replace("#", "").toUpperCase();
  if (hex.length === 3) {
    return (
      "#" +
      hex
        .split("")
        .map((char) => char + char)
        .join("")
    );
  }
  return hex.length === 6 ? "#" + hex : "";
};

/**
 * Normalize aspect ratio format
 * @example normalizeAspectRatio("16:9") => "16/9" (for image generation APIs)
 */
export const normalizeAspectRatio = (ratio: string | undefined): string => {
  if (!ratio) return "";
  return ratio.replace(":", "/");
};

/**
 * Normalize URL to ensure it starts with http/https
 */
export const normalizeUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return "https://" + url;
};
