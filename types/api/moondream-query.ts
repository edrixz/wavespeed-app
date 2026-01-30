export interface MoondreamRequestBody {
  enable_sync_mode: boolean;
  enable_safety_checker: boolean;
  image: string; // URL ảnh
  prompt: string;
  reasoning: boolean;
}

export interface MoondreamResponse {
  answer: string;
  reasoning?: any;
}
