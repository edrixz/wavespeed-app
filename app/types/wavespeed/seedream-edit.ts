export type seedreamEditPayload = {
  images: string[];
  prompt: string;
  negative_prompt: string;
  size: string;
  enable_base64_output: boolean;
  enable_sync_mode: boolean;
  enable_safety_checker: boolean;
};

export type PromptPreset = {
  id: string;
  user_id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  negative_prompt: string | null;
  size: string | null;
  rating?: number | null;
  usage_count?: number | null;
  created_at: string | null;
};
