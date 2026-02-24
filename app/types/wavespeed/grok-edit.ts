export type GrokEditPayload = {
  image: string;
  prompt: string;
  enable_base64_output: boolean;
  enable_sync_mode: boolean;
  enable_safety_checker: boolean;
};

export type GrokPromptPreset = {
  id: string;
  user_id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  created_at: string | null;
};
