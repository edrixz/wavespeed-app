// utils/prompt-assembler.ts
import type { Subject, Scene, AnalyzedData } from "~/types";

/**
 * Nối các thành phần với dấu câu thông minh.
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
    .replace(/\.$/, "")
    .trim();
};

/**
 * Bóc tách chi tiết nhân vật (Subject + Anatomy + Face + Hair + Outfit + Pose)
 */
export const getSubjectBlock = (s: Subject) => {
  const sub = s.subject;
  const face = s.face;
  const hair = s.hair;
  const outfit = s.outfit;
  const pose = s.pose;

  // 1. Nhận diện danh tính
  const identity = joinValid(
    ", ",
    sub?.gender,
    sub?.age,
    sub?.ethnicity,
    sub?.bodyType,
    sub?.skinTone,
    sub?.skinDetails
  );

  // 2. Kiểm tra sự hiện diện của Anatomy và Clothing
  const anatomyTags = joinValid(
    ", ",
    sub?.breast,
    sub?.nipple,
    sub?.genitals,
    sub?.pubicHair
  );
  const clothingTags = joinValid(
    ", ",
    outfit?.description,
    outfit?.materials,
    outfit?.layering,
    outfit?.fit,
    outfit?.details,
    outfit?.accessories
  );
  const interactionTags = outfit?.fabricInteraction || "";

  // 3. Logic xử lý Khối Cơ thể & Trang phục (Interaction Logic)
  let bodyAndClothingStr = "";

  if (anatomyTags && clothingTags) {
    // Trường hợp: Mặc đồ nhưng để lộ (Revealing / Editorial)
    // Nếu có cả hai: Tập trung vào sự va chạm vật lý giữa vải và da
    const interactionPrefix = interactionTags
      ? `${interactionTags}:`
      : "artfully revealing";
    bodyAndClothingStr = `Wearing ${clothingTags}, ${interactionPrefix}, can see body details including ${anatomyTags}.`;
  } else if (anatomyTags) {
    // Trường hợp: Khỏa thân hoàn toàn (Fine Art Nude)
    bodyAndClothingStr = `Fine art nude photography: showcasing detailed of ${anatomyTags}.`;
  } else if (clothingTags) {
    // Trường hợp: Thời trang tiêu chuẩn
    bodyAndClothingStr = `Wearing ${clothingTags}${
      interactionTags ? ` with ${interactionTags}` : ""
    }.`;
  } else {
    // Fallback: Nếu không chọn gì
    bodyAndClothingStr = "";
  }

  // 4. Khối gương mặt & Tóc
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

  // 5. Khối tư thế
  const poseBase = joinValid(
    ", ",
    pose?.action,
    pose?.posture,
    pose?.headAngle,
    pose?.hands
  );
  const poseInteraction = pose?.interaction || "";
  // Tạo câu văn tự nhiên: [Tư thế] trong khi [Hành động]
  let posePart = "";
  if (poseBase && poseInteraction) {
    posePart = `Pose: ${poseBase}, while ${poseInteraction}.`;
  } else if (poseInteraction) {
    posePart = `Pose: performing ${poseInteraction}.`;
  } else {
    posePart = `Pose: ${poseBase}.`;
  }

  const faceTag = facial ? `Face features: ${facial}.` : "";
  const hairStyleTag = hairStyle ? `Hairstyle: ${hairStyle}.` : "";
  const poseTag =
    poseBase === "" && poseInteraction === "" ? "" : `${posePart}`;

  return `A ${identity}. ${bodyAndClothingStr} ${faceTag} ${hairStyleTag} ${poseTag}`;
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

  const framingTag = framing ? `Framing: ${framing}.` : "";
  const environmentTag = environment ? `Environment: ${environment}.` : "";
  const technicalTag = technical ? `Technical style: ${technical}.` : "";

  return `${subjectPart} ${framingTag} ${environmentTag} ${technicalTag} ${ar}`.trim();
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
