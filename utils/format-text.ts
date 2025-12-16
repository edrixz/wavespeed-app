export const formatTitleCase = (str: string | undefined) => {
  if (!str) return "";
  const cleanStr = str.trim();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
};
