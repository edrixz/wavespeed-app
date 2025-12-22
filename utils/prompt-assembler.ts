// utils/prompt-assembler.ts
import type { Subject, Scene, AnalyzedData } from "~/types";

/**
 * Nối các thành phần với dấu câu thông minh.
 * Nếu là câu hoàn chỉnh (kết thúc bằng dấu chấm), nó sẽ giữ nguyên.
 */
export const joinValid = (separator: string, ...fields: any[]) => {
  return fields
    .map((f) => {
      if (!f) return "";
      if (Array.isArray(f)) return f.filter(Boolean).join(", ");
      return String(f).trim();
    })
    .filter((f) => f !== "")
    .join(separator)
    .replace(/\s+/g, " ")
    .replace(/,\./g, ".")
    .trim();
};

/**
 * Bóc tách chi tiết nhân vật (Subject + Face + Hair + Outfit + Pose)
 */
export const getSubjectBlock = (s: Subject) => {
  const sub = s.subject;
  const face = s.face;
  const hair = s.hair;
  const outfit = s.outfit;
  const pose = s.pose;

  // Khối nhận dạng & Đặc điểm cơ thể
  const identity = joinValid(
    ", ",
    sub?.gender,
    sub?.age,
    sub?.ethnicity,
    sub?.bodyType,
    sub?.skinTone,
    sub?.skinDetails
  );

  // Khối gương mặt & Tóc
  const facial = joinValid(
    ", ",
    face?.structure,
    face?.eyes,
    face?.eyebrows,
    face?.nose,
    face?.lips,
    face?.skinTexture,
    face?.expression,
    face?.makeup
  );
  const hairStyle = joinValid(
    ", ",
    hair?.description,
    hair?.color,
    hair?.length,
    hair?.texture
  );

  // Khối trang phục
  const clothing = joinValid(
    ", ",
    outfit?.description,
    outfit?.materials,
    outfit?.layering,
    outfit?.fit,
    outfit?.details,
    outfit?.accessories
  );

  // Khối tư thế
  const action = joinValid(
    ", ",
    pose?.action,
    pose?.posture,
    pose?.headAngle,
    pose?.hands
  );

  // Kết hợp thành một đoạn văn mô tả nhân vật mượt mà
  return `A ${identity}. Face features: ${facial}. Hairstyle: ${hairStyle}. Wearing: ${clothing}. Pose: ${action}.`;
};

/**
 * Bóc tách bối cảnh & Kỹ thuật nhiếp ảnh
 */
export const getSceneBlock = (sc: Scene) => {
  const env = sc.environment;
  const tech = sc.tech;

  const environment = joinValid(
    ", ",
    env?.location,
    env?.lighting,
    env?.lightColor,
    env?.shadows,
    env?.atmosphere,
    env?.colorPalette
  );
  const technical = joinValid(
    ", ",
    tech?.artStyle,
    tech?.camera,
    tech?.lensSettings,
    tech?.filmEffect,
    tech?.postProcessing,
    tech?.viewpoint
  );

  return { environment, technical };
};

/**
 * Hàm assemble cho Single Subject
 */
export const assemblePrompt = (s: Subject, sc: Scene): string => {
  const subjectPart = getSubjectBlock(s);
  const { environment, technical } = getSceneBlock(sc);

  const framing = joinValid(", ", s.pose?.framing, s.pose?.perspective);
  const ar = s.pose?.aspectRatio
    ? `--ar ${s.pose.aspectRatio.replace(":", "/")}`
    : "";

  // Cấu trúc: [Chủ thể] [Bố cục] [Môi trường] [Kỹ thuật] [Tham số]
  return `${subjectPart} Framing: ${framing}. Environment: ${environment}. Technical style: ${technical}. ${ar}`.trim();
};

/**
 * Tạo Negative Prompt dựa trên dữ liệu phân tích kỹ thuật
 */
export const assembleNegativePrompt = (data: AnalyzedData): string => {
  const negatives: string[] = [
    "low quality, worst quality, out of focus, blurry, deformed, extra limbs, mutated hands, bad anatomy, bad proportions, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
  ];

  // 1. Loại trừ phong cách nghệ thuật nếu là ảnh chụp (Sửa lỗi image_1559d0.png)
  if (data.tech?.artStyle?.toLowerCase().includes("photo")) {
    negatives.push(
      "cartoon, anime, 3d render, illustration, painting, drawing, sketch, oil painting, semi-realistic, cgi, unreal engine, octane render"
    );
  }

  // 2. Loại trừ nhiễu hạt nếu tech.filmEffect là sạch (Dựa trên dữ liệu mẫu của bạn)
  if (
    data.tech?.filmEffect?.toLowerCase().includes("minimal") ||
    data.tech?.filmEffect?.includes("no film effect")
  ) {
    negatives.push(
      "film grain, dust, scratches, chromatic aberration, light leaks, vintage effect, sepia, vignette"
    );
  }

  // 3. Loại trừ khuyết điểm da nếu face.skinTexture là mịn (Dựa trên dữ liệu mẫu của bạn)
  if (
    data.face?.skinTexture?.toLowerCase().includes("smooth") ||
    data.face?.skinTexture?.includes("no visible wrinkles")
  ) {
    negatives.push(
      "acne, skin blemishes, wrinkles, moles, scars, age spots, skin spots, large pores"
    );
  }

  // 4. Loại trừ các yếu tố văn bản
  negatives.push(
    "text, watermark, signature, username, error, logo, words, letters, digits"
  );

  return negatives.join(", ");
};
