/**
 * API-specific response types
 */

export type GenerateTaskResponse = {
  taskId: string;
  status: string;
  createdAt?: string;
};

export type ImageAnalysisResponse = {
  success: boolean;
  data: any;
  error?: string;
};

export type PresetListResponse = {
  success: boolean;
  data: any[];
  total: number;
};
