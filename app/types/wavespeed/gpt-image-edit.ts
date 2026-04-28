type Quality = "low" | "medium" | "high";
type Resolution = "1k" | "2k" | "4k";
type AspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3"
  | "4:5"
  | "5:4"
  | "21:9";

export type GptImageEditPayload = {
  images: string[];
  prompt: string;
  resolution: Resolution;
  quality: Quality;
  aspect_ratio: AspectRatio;
  enable_base64_output: boolean;
  enable_sync_mode: boolean;
  enable_safety_checker: boolean;
};

export type GptImagePromptPreset = {
  id: string;
  user_id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  resolution: Resolution;
  quality: Quality;
  aspect_ratio: AspectRatio;
  rating?: number | null;
  usage_count?: number | null;
  created_at: string | null;
};
