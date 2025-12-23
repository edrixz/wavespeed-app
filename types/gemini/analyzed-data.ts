export type AiValue = {
  value: string;
  label_vi: string;
};

export type SubjectData = {
  gender?: AiValue;
  age?: AiValue;
  ethnicity?: AiValue;
  bodyType?: AiValue;
  skinTone?: AiValue;
  skinDetails?: AiValue;
  breast?: AiValue;
  nipple?: AiValue;
  pubicHair?: AiValue;
  genitals?: AiValue;
};

export type FaceData = {
  structure?: AiValue; // Nâng cấp: Cấu trúc xương, gò má, cằm
  eyes?: AiValue; // Chi tiết: Đồng tử, mống mắt, lông mi
  eyebrows?: AiValue; // Nâng cấp: Dáng lông mày, độ dày
  nose?: AiValue;
  lips?: AiValue;
  skinTexture?: AiValue; // Chất cảm da (ướt, khô, mịn, sần)
  expression?: AiValue; // Vi biểu cảm
  makeup?: AiValue; // Kỹ thuật makeup chi tiết
};

export type HairData = {
  description?: AiValue; // Tổng quan kiểu tóc và độ bồng bềnh
  color?: AiValue; // Màu sắc (bao gồm cả highlight/lowlight)
  length?: AiValue;
  texture?: AiValue; // Vật lý tóc (mượt, rối, ướt)
};

export type OutfitData = {
  description?: AiValue; // Mô tả tổng quan bộ trang phục
  materials?: AiValue; // Nâng cấp: Tính chất vải (phản chiếu, mờ, xuyên thấu)
  layering?: AiValue; // Nâng cấp: Các lớp quần áo từ trong ra ngoài
  fit?: AiValue; // Độ rủ, độ ôm của vải
  details?: AiValue; // Họa tiết, khóa kéo, phụ liệu
  accessories?: AiValue; // Trang sức, kính, mũ
  fabricInteraction?: AiValue; // Trường mới
};

export type PoseData = {
  action?: AiValue;
  posture?: AiValue;
  headAngle?: AiValue; // Góc nghiêng đầu (tilt/rotation)
  hands?: AiValue; // Vị trí và trạng thái bàn tay
  interaction?: AiValue; // Hành động tương tác
  framing?: AiValue; // Kiểu khung hình (Close-up, Full body, Cowboy shot)
  perspective?: AiValue; // Góc máy (Low angle, Eye level, High angle)
  aspectRatio?: AiValue; // Tỷ lệ khung hình ước tính (16:9, 4:5, 1:1)
};

export type EnvironmentData = {
  location?: AiValue;
  lighting?: AiValue; // Hướng sáng (Backlit, Rim light, Side light)
  lightColor?: AiValue; // Nâng cấp: Nhiệt độ màu (Warm, Cool, Kelvin)
  shadows?: AiValue; // Tính chất bóng đổ (Hard, Soft, Volumetric)
  atmosphere?: AiValue; // Hiệu ứng môi trường (Sương mù, bụi, mưa)
  colorPalette?: AiValue; // Nâng cấp: Hệ màu chủ đạo của toàn ảnh
};

export type TechData = {
  camera?: AiValue;
  lensSettings?: AiValue; // Nhanh/chậm, tiêu cự (85mm, 35mm), độ xóa phông (f-stop)
  filmEffect?: AiValue; // Độ nhiễu hạt (grain), màu phim (Kodak, Fuji)
  artStyle?: AiValue; // Phong cách (Photo, Render 3D, Digital Art)
  postProcessing?: AiValue; // Cách hậu kỳ (Vibrant, Desaturated, Cinematic)
  viewpoint?: AiValue;
};

export type AnalyzedData = {
  subject?: SubjectData;
  face?: FaceData;
  hair?: HairData;
  outfit?: OutfitData;
  pose?: PoseData;
  environment?: EnvironmentData;
  tech?: TechData;
};

export type AnalyzeResponse = {
  result: AnalyzedData;
};
