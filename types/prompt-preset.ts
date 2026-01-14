import type { AnalyzedData } from "./gemini";

export type PromptPreset = {
  id: string;
  title: string;
  category: "Fine Art" | "Portrait" | "Cinematic" | "Studio" | "Street";
  thumbnail: string; // Ảnh mẫu gen từ prompt này
  data: AnalyzedData;
};

export type SimplePreset = {
  id: string;
  user_id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  negative_prompt: string | null;
  size: string | null;
  created_at: string | null;
};
