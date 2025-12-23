// utils/prompt-preview-vi.ts
import type { Subject, Scene } from "~/types";
import { joinValid } from "./prompt-assembler"; // Tái sử dụng hàm joinValid cũ

/**
 * Bóc tách chi tiết nhân vật bằng Tiếng Việt
 */
export const getSubjectBlockVi = (s: Subject) => {
  const { subject: sub, face, hair, outfit, pose } = s;

  // 1. Nhận diện danh tính
  const identity = joinValid(
    ", ",
    sub?.gender?.label_vi,
    sub?.age?.label_vi,
    sub?.ethnicity?.label_vi,
    sub?.bodyType?.label_vi,
    sub?.skinTone?.label_vi,
    sub?.skinDetails?.label_vi
  );

  // 2. Thu thập tag Giải phẫu & Trang phục (Dựa trên cấu trúc Tag-to-Tag)
  const anatomyTags = joinValid(
    ", ",
    sub?.breast?.label_vi,
    sub?.nipple?.label_vi,
    sub?.genitals?.label_vi,
    sub?.pubicHair?.label_vi
  );

  const clothingTags = joinValid(
    ", ",
    outfit?.description?.label_vi,
    outfit?.materials?.label_vi,
    outfit?.layering?.label_vi,
    outfit?.fit?.label_vi,
    outfit?.details?.label_vi,
    outfit?.accessories?.label_vi
  );

  const interactionTags = outfit?.fabricInteraction?.label_vi || "";

  // 3. Logic Tương tác Hình thể & Vải (Phản chiếu cấu trúc value)
  let bodyAndClothingStr = "";

  if (anatomyTags && clothingTags) {
    const interactionPrefix = interactionTags
      ? `${interactionTags}:`
      : "hé lộ nghệ thuật";
    bodyAndClothingStr = `Mặc ${clothingTags}, ${interactionPrefix}, có thể thấy chi tiết cơ thể gồm ${anatomyTags}.`;
  } else if (anatomyTags) {
    bodyAndClothingStr = `Ảnh khỏa thân nghệ thuật: làm nổi bật chi tiết ${anatomyTags}.`;
  } else if (clothingTags) {
    bodyAndClothingStr = `Mặc ${clothingTags}${
      interactionTags ? ` với hiệu ứng ${interactionTags}` : ""
    }.`;
  }

  // 4. Gương mặt & Tóc
  const facial = joinValid(
    ", ",
    face?.structure?.label_vi,
    face?.eyes?.label_vi,
    face?.eyebrows?.label_vi,
    face?.nose?.label_vi,
    face?.lips?.label_vi,
    face?.skinTexture?.label_vi,
    face?.expression?.label_vi,
    face?.makeup?.label_vi
  );

  const hairStyle = joinValid(
    ", ",
    hair?.description?.label_vi,
    hair?.color?.label_vi,
    hair?.length?.label_vi,
    hair?.texture?.label_vi
  );

  // 5. Tư thế & Hành động (Sử dụng từ nối tự nhiên)
  const poseBase = joinValid(
    ", ",
    pose?.action?.label_vi,
    pose?.posture?.label_vi,
    pose?.headAngle?.label_vi,
    pose?.hands?.label_vi
  );
  const poseInteraction = pose?.interaction?.label_vi || "";

  let posePart = "";
  if (poseBase && poseInteraction) {
    posePart = `Tư thế: ${poseBase}, trong khi đang ${poseInteraction}.`;
  } else if (poseInteraction) {
    posePart = `Tư thế: đang thực hiện ${poseInteraction}.`;
  } else if (poseBase) {
    posePart = `Tư thế: ${poseBase}.`;
  }

  const faceTag = facial ? `Đặc điểm khuôn mặt: ${facial}.` : "";
  const hairStyleTag = hairStyle ? `Kiểu tóc: ${hairStyle}.` : "";

  return `Một nhân vật ${identity}. ${bodyAndClothingStr} ${faceTag} ${hairStyleTag} ${posePart}`.trim();
};

/**
 * Bóc tách bối cảnh bằng Tiếng Việt
 */
export const getSceneBlockVi = (sc: Scene) => {
  const env = sc.environment;
  const tech = sc.tech;

  const environment = joinValid(
    ", ",
    env?.location?.label_vi,
    env?.lighting?.label_vi,
    env?.lightColor?.label_vi,
    env?.shadows?.label_vi,
    env?.atmosphere?.label_vi,
    env?.colorPalette?.label_vi
  );
  const technical = joinValid(
    ", ",
    tech?.artStyle?.label_vi,
    tech?.camera?.label_vi,
    tech?.lensSettings?.label_vi,
    tech?.filmEffect?.label_vi,
    tech?.postProcessing?.label_vi,
    tech?.viewpoint?.label_vi
  );

  return { environment, technical };
};

/**
 * Hàm tổng hợp Preview Tiếng Việt hoàn chỉnh
 */
export const assemblePromptVi = (s: Subject, sc: Scene): string => {
  const subjectPart = getSubjectBlockVi(s);
  const { environment, technical } = getSceneBlockVi(sc);

  const framing = joinValid(
    ", ",
    s.pose?.framing?.label_vi,
    s.pose?.perspective?.label_vi
  );

  const framingTag = framing ? `Bố cục: ${framing}.` : "";
  const environmentTag = environment ? `Môi trường: ${environment}.` : "";
  const technicalTag = technical ? `Kỹ thuật: ${technical}.` : "";

  return `${subjectPart} ${framingTag} ${environmentTag} ${technicalTag}`.trim();
};
