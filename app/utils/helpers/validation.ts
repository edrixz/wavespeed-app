/**
 * Common validation utilities
 */

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string | undefined | null): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Check if email is valid (basic validation)
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if hex color is valid
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Check if object has required keys
 */
export const hasRequiredKeys = <T extends Record<string, any>>(
  obj: T,
  requiredKeys: (keyof T)[]
): boolean => {
  return requiredKeys.every((key) => key in obj && obj[key] !== undefined);
};

/**
 * Validate aspect ratio format (e.g., "16:9", "4:3")
 */
export const isValidAspectRatio = (ratio: string): boolean => {
  const ratioRegex = /^\d+:\d+$/;
  return ratioRegex.test(ratio);
};

/**
 * Validate image size (width x height)
 */
export const isValidImageSize = (
  width: number,
  height: number,
  minSize: number = 256,
  maxSize: number = 8192
): boolean => {
  return (
    width >= minSize &&
    width <= maxSize &&
    height >= minSize &&
    height <= maxSize
  );
};
