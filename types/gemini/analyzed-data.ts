export type SubjectData = {
  gender?: string;
  age?: string;
  ethnicity?: string;
  bodyType?: string;
  skinTone?: string;
  skinDetails?: string;
};

export type FaceData = {
  structure?: string; // Nâng cấp: Cấu trúc xương, gò má, cằm
  eyes?: string; // Chi tiết: Đồng tử, mống mắt, lông mi
  eyebrows?: string; // Nâng cấp: Dáng lông mày, độ dày
  nose?: string;
  lips?: string;
  skinTexture?: string; // Chất cảm da (ướt, khô, mịn, sần)
  expression?: string; // Vi biểu cảm
  makeup?: string; // Kỹ thuật makeup chi tiết
};

export type HairData = {
  description?: string; // Tổng quan kiểu tóc và độ bồng bềnh
  color?: string; // Màu sắc (bao gồm cả highlight/lowlight)
  length?: string;
  texture?: string; // Vật lý tóc (mượt, rối, ướt)
};

export type OutfitData = {
  description?: string; // Mô tả tổng quan bộ trang phục
  materials?: string; // Nâng cấp: Tính chất vải (phản chiếu, mờ, xuyên thấu)
  layering?: string; // Nâng cấp: Các lớp quần áo từ trong ra ngoài
  fit?: string; // Độ rủ, độ ôm của vải
  details?: string; // Họa tiết, khóa kéo, phụ liệu
  accessories?: string; // Trang sức, kính, mũ
};

export type PoseData = {
  action?: string;
  posture?: string;
  headAngle?: string; // Góc nghiêng đầu (tilt/rotation)
  hands?: string; // Vị trí và trạng thái bàn tay
  // Bổ sung các trường quan trọng cho Composition (Bố cục)
  framing?: string; // Kiểu khung hình (Close-up, Full body, Cowboy shot)
  perspective?: string; // Góc máy (Low angle, Eye level, High angle)
  aspectRatio?: string; // Tỷ lệ khung hình ước tính (16:9, 4:5, 1:1)
};

export type EnvironmentData = {
  location?: string;
  lighting?: string; // Hướng sáng (Backlit, Rim light, Side light)
  lightColor?: string; // Nâng cấp: Nhiệt độ màu (Warm, Cool, Kelvin)
  shadows?: string; // Tính chất bóng đổ (Hard, Soft, Volumetric)
  atmosphere?: string; // Hiệu ứng môi trường (Sương mù, bụi, mưa)
  colorPalette?: string; // Nâng cấp: Hệ màu chủ đạo của toàn ảnh
};

export type TechData = {
  camera?: string;
  lensSettings?: string; // Nhanh/chậm, tiêu cự (85mm, 35mm), độ xóa phông (f-stop)
  filmEffect?: string; // Độ nhiễu hạt (grain), màu phim (Kodak, Fuji)
  artStyle?: string; // Phong cách (Photo, Render 3D, Digital Art)
  postProcessing?: string; // Cách hậu kỳ (Vibrant, Desaturated, Cinematic)
  viewpoint?: string;
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
