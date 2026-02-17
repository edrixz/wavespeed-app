/**
 * Text formatting utilities
 */

/**
 * Format string to Title Case (First letter uppercase, rest lowercase)
 * @example formatTitleCase("hello world") => "Hello world"
 */
export const formatTitleCase = (str: string | undefined): string => {
  if (!str) return "";
  const cleanStr = str.trim();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};

/**
 * Join multiple strings with separator, filtering out empty/null values
 * @example joinValid(", ", "a", "", "b") => "a, b"
 */
export const joinValid = (separator: string, ...fields: any[]): string => {
  return fields
    .map((f) => {
      if (!f) return "";
      if (Array.isArray(f)) return f.filter(Boolean).join(", ");
      return String(f).trim();
    })
    .filter((f) => f !== "")
    .join(separator)
    .replace(/\s+/g, " ")
    .replace(/,\./g, ".")
    .replace(/\.$/, "")
    .trim();
};

/**
 * Convert comma-separated string to array of tags
 * @example parseTags("tag1, tag2, tag3") => ["tag1", "tag2", "tag3"]
 */
export const parseTags = (str: string | undefined): string[] => {
  if (!str) return [];
  return str
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
};

/**
 * Slugify string for URL usage
 * @example slugify("Hello World Test") => "hello-world-test"
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Capitalize first letter
 * @example capitalize("hello") => "Hello"
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string to max length with ellipsis
 * @example truncate("Hello World", 5) => "He..."
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
};
