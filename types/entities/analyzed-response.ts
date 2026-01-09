import type { AnalyzedData } from "./analyzed-data";

/**
 * Response wrapper for image analysis results
 */
export type AnalyzeResponse = {
  result: AnalyzedData;
};

export type ImageAnalysisStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";
