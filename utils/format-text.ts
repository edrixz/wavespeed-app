export const formatTitleCase = (str: string | undefined): string => {
  if (!str) return "";
  const cleanStr = str.trim();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};
