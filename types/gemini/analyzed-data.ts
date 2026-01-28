// FILE: types/gemini/analyzed-data.ts

export interface BilingualData {
  value: string; // English Prompt (Dùng để generate)
  label_vi: string; // Vietnamese Display (Dùng để hiển thị UI)
}

export interface AnalyzedDataRaw {
  subject: BilingualData;
  clothing: BilingualData;
  pose: BilingualData;
  lighting: BilingualData;
  background: BilingualData;
  technical: BilingualData;
}

export interface ImageAnalysisResult {
  imageId: string;
  imageUrl: string;
  data: AnalyzedDataRaw;
}

export type AnalysisCategory = keyof AnalyzedDataRaw;
