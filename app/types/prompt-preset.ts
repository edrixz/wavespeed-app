import type { AnalyzedData } from "./gemini";

export type PromptPreset = {
  id: string;
  title: string;
  category: "Fine Art" | "Portrait" | "Cinematic" | "Studio" | "Street";
  thumbnail: string; // Ảnh mẫu gen từ prompt này
  data: AnalyzedData;
};
