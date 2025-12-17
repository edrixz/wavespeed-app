import { defineStore } from "pinia";
import type { Scene, Subject } from "~/types";

export const usePromptBuilderStore = defineStore("promptBuilder", () => {
  const { setStatus } = useLogger();
  const payloadStore = useWavespeedPayloadStore();
  const { prompt } = storeToRefs(payloadStore);

  // --- 1. STATE (Dữ liệu) ---
  const subjects = ref<Subject[]>([
    {
      id: "sub-1",
      refImageIdx: 0,
      role: "The main subject",
      gender: "Female",
      bodyType: "Petite",
      faceShape: "",
      skin: "Realistic Skin Details, Natural Skin Texture, Highly Detailed Skin, Pore-level Skin Detail",
      eyes: "",
      hairLength: "",
      hairColor: "",
      hairStyle: "",
      makeup: "",
      clothes: "",
      pose: "",
      expression: "Looking at camera",
      age: "",
      nose: "",
      lips: "",
      freckles: "",
      iris: "",
    },
    {
      id: "sub-2",
      refImageIdx: 1,
      role: "The man",
      gender: "Male",
      bodyType: "Fit",
      faceShape: "",
      skin: "Realistic Skin Details, Natural Skin Texture, Highly Detailed Skin, Pore-level Skin Detail",
      eyes: "",
      hairLength: "",
      hairColor: "",
      hairStyle: "",
      makeup: "",
      clothes: "",
      pose: "",
      expression: "Looking at camera",
      age: "",
      nose: "",
      lips: "",
      freckles: "",
      iris: "",
    },
  ]);

  const activeSubjectId = ref("sub-1");

  const scene = ref<Scene>({
    interaction:
      "hardcore sex, Covered in sweat, flirty, sweaty, (Different Sex Positions: The man was touching the girl's vagina while his other hand was squeezing her breasts.)", // e.g. "Holding hands", "Walking together"
    background: "Keep location as in Image #1",
    viewpoint: "",
    lighting: "",
    camera: "Shot on Sony A7R V, 85mm Lens, f/1.4",
    film: "",
    quality:
      "Photorealistic detail, 8k uhd, high-resolution skin, natural lighting. (breathtaking realistic) , (pale skin) , (huge tits:1.2) , naked tits, huge tits, hard nipples, wet skin, realistic, stunning colorful picture, award-winning photo. best shadows, realistic, wet, huge tits, (hard nipples) , hyperrealistic. High-end beauty retouch, micro-contrast boosted for realistic skin texture, film grain, color grading with cinematic tones",
  });

  const addSubject = () => {
    const newId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    subjects.value.push({
      id: newId,
      refImageIdx: -1,
      role: subjects.value.length === 0 ? "The woman" : "The man",
      gender: "Male",
      age: "",
      bodyType: "",
      skin: "Detailed skin texture, pores",
      faceShape: "",
      eyes: "",
      nose: "",
      lips: "",
      freckles: "",
      expression: "Looking at camera",
      makeup: "",
      hairColor: "",
      hairStyle: "",
      hairLength: "",
      clothes: "",
      pose: "",
      iris: "",
    });
    // Tự động switch sang subject mới tạo
    activeSubjectId.value = newId;
  };

  const removeSubject = (id: string) => {
    // 1. Tìm vị trí
    const index = subjects.value.findIndex((s) => s.id === id);
    if (index === -1) return;

    // 2. Chặn xóa nếu chỉ còn 1 người (Luôn giữ lại ít nhất 1)
    if (subjects.value.length <= 1) {
      alert("Cannot remove the last subject!");
      return;
    }

    // 3. Nếu đang xóa đúng cái Tab đang Active -> Phải chuyển Active sang người bên cạnh
    if (activeSubjectId.value === id) {
      // Ưu tiên lấy người đứng trước, nếu không có thì lấy người đứng sau
      const newActive = subjects.value[index - 1] || subjects.value[index + 1];
      if (newActive) {
        activeSubjectId.value = newActive.id;
      }
    }

    // 4. Thực hiện xóa
    subjects.value.splice(index, 1);
  };

  const currentSubject = computed(() => {
    return subjects.value.find((s) => s.id === activeSubjectId.value);
  });

  const generatedPrompt = computed(() => {
    if (!scene.value || subjects.value.length === 0) return "";

    // A. Setup Viewpoint
    let p = `${scene.value.viewpoint || "A shot"} of `;

    // B. List Roles
    const rolesList = subjects.value
      .map((s) => {
        const ageGender = `${s.age || ""} ${s.gender}`.trim();
        const isNaked = s.clothes === "" ? "nude" : "";
        const refFace =
          s.refImageIdx !== -1
            ? ` (Reference Face: Image #${s.refImageIdx + 1})`
            : "";
        return `a ${isNaked} ${ageGender}${refFace}`.trim();
      })
      .join(" and ");
    p += `${rolesList}. `;

    // C. Interaction
    if (subjects.value.length > 1 && scene.value.interaction) {
      p += `They are ${scene.value.interaction}. `;
    }

    // D. Loop Details (Logic nối chuỗi của bạn)
    subjects.value.forEach((s) => {
      let desc = "";
      // Body
      if (s.bodyType) desc += `with ${s.bodyType} body. `;
      // Face
      if (s.faceShape) desc += `Face: ${s.faceShape}. `;
      // Skin (Gộp skin + freckles)
      const skinParts = [s.skin, s.freckles].filter(Boolean).join(", ");
      if (skinParts) desc += `Skin: ${skinParts}. `;
      // Eyes
      const eyeParts = [s.eyes, s.iris].filter(Boolean).join(", ");
      if (eyeParts) desc += `Eyes: ${eyeParts}. `;
      // Hair
      const hairParts = [s.hairLength, s.hairColor, s.hairStyle]
        .filter(Boolean)
        .join(" ");
      if (hairParts) desc += `Hair: ${hairParts}. `;

      if (s.makeup) desc += `Makeup: ${s.makeup}. `;
      if (s.clothes) desc += `Wearing ${s.clothes}. `;

      // Pose
      let poseDesc = s.pose || "";
      if (s.expression) poseDesc += `, ${s.expression}`;
      // Clean pose string logic...
      if (poseDesc) desc += `Pose: ${poseDesc}. `;

      p += desc;
    });

    // E. Scene & Tech
    if (scene.value.background) p += `Background: ${scene.value.background}. `;
    if (scene.value.lighting) p += `Lighting: ${scene.value.lighting}. `;

    const tech = [scene.value.camera, scene.value.film, scene.value.quality]
      .filter(Boolean)
      .join(", ");
    if (tech) p += `${tech}.`;

    return p;
  });

  const applyToWavespeedPayload = () => {
    if (!generatedPrompt.value) return;

    // Gán giá trị từ Builder sang Wavespeed payload
    prompt.value = generatedPrompt.value;

    // (Tùy chọn) Hiệu ứng thông báo nhỏ
    setStatus(`Applied to main prompt!`, "success");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt.value);
    // Nếu bạn muốn bấm Copy là nó tự điền vào Settings luôn thì gọi hàm apply tại đây:
    applyToWavespeedPayload();
  };

  return {
    subjects,
    activeSubjectId,
    currentSubject,
    scene,
    addSubject,
    removeSubject,
    applyToWavespeedPayload,
    copyToClipboard,
    generatedPrompt,
  };
});
