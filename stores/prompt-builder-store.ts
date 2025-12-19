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
      subject: {
        gender: "Female",
        age: "",
        ethnicity: "",
        bodyType: "",
        skinTone: "",
      },
      face: {
        shape: "",
        eyes: "",
        nose: "",
        lips: "",
        skinTexture: "",
        expression: "",
        makeup: "",
      },
      hair: {
        color: "",
        style: "",
        length: "",
        texture: "",
      },
      outfit: {
        mainClothing: "",
        fabric: "",
        fit: "",
        details: "",
        accessories: "",
      },
      pose: {
        action: "",
        posture: "",
        headAngle: "",
        hands: "",
      },
    },
  ]);

  const activeSubjectId = ref("sub-1");

  const scene = ref<Scene>({
    environment: {
      location: "Keep location as in Image #1",
      lighting: "",
      shadows: "",
      atmosphere: "",
    },
    tech: {
      camera: "Sony A7R V",
      lens: "85mm Lens f/1.4",
      filmStock: "",
      quality: "",
      viewpoint:
        "Photorealistic detail, 8k uhd, high-resolution skin, natural lighting. (breathtaking realistic) , (pale skin) , (huge tits:1.2) , naked tits, huge tits, hard nipples, wet skin, realistic, stunning colorful picture, award-winning photo. best shadows, realistic, wet, huge tits, (hard nipples) , hyperrealistic. High-end beauty retouch, micro-contrast boosted for realistic skin texture, film grain, color grading with cinematic tones",
    },
  });

  const addSubject = () => {
    const newId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    subjects.value.push({
      id: newId,
      refImageIdx: -1,
      subject: {
        gender: "Female",
        age: "",
        ethnicity: "",
        bodyType: "",
        skinTone: "",
      },
      face: {
        shape: "",
        eyes: "",
        nose: "",
        lips: "",
        skinTexture: "",
        expression: "",
        makeup: "",
      },
      hair: {
        color: "",
        style: "",
        length: "",
        texture: "",
      },
      outfit: {
        mainClothing: "",
        fabric: "",
        fit: "",
        details: "",
        accessories: "",
      },
      pose: {
        action: "",
        posture: "",
        headAngle: "",
        hands: "",
      },
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

  const buildSinglePrompt = (s: Subject, scene: Scene): string => {
    const p = [];

    // 1. Identity & Body
    if (s.subject) {
      const age = s.subject.age ? `${s.subject.age} y.o` : "";
      p.push(
        `Subject: A ${age} ${s.subject.ethnicity || ""} ${
          s.subject.gender || "person"
        }, ${s.subject.bodyType || ""}, ${s.subject.skinTone || ""} skin.`
      );
    }

    // 2. Face Features
    if (s.face) {
      p.push(
        `Face: ${s.face.shape || ""} shape, ${
          s.face.eyes || "detailed"
        } eyes, ${s.face.lips || ""} lips, ${
          s.face.expression || "neutral"
        } expression, ${s.face.makeup || "no makeup"}.`
      );
    }

    // 3. Hair
    if (s.hair) {
      p.push(
        `Hair: ${s.hair.length || ""} ${s.hair.style || ""} ${
          s.hair.color || ""
        } hair, ${s.hair.texture || ""}.`
      );
    }

    // 4. Outfit & Pose
    if (s.outfit)
      p.push(
        `Outfit: ${s.outfit.mainClothing || ""} made of ${
          s.outfit.fabric || ""
        }, ${s.outfit.accessories || ""}.`
      );
    if (s.pose)
      p.push(`Action: ${s.pose.action || ""}, ${s.pose.posture || ""}.`);

    // 5. Environment & Tech
    if (scene.environment)
      p.push(
        `Environment: ${scene.environment.location || ""}, ${
          scene.environment.atmosphere || ""
        }, ${scene.environment.lighting || ""} lighting.`
      );
    if (scene.tech)
      p.push(
        `Technical: ${scene.tech.viewpoint || ""}, Shot on ${
          scene.tech.camera || ""
        }, ${scene.tech.quality || "high quality"}.`
      );

    return p.filter(Boolean).join(" ");
  };

  const buildMultiPrompt = (subjects: Subject[], scene: Scene): string => {
    const p = [];

    // 1. Interaction Context (Quan trọng nhất - đặt lên đầu)
    const interaction = subjects[0]?.pose?.action || "standing together";
    p.push(`Composition: Two people in a scene, ${interaction}.`);

    // 2. Describe Subject A
    const s1 = subjects[0];
    if (s1) {
      p.push(
        `[Subject A]: ${s1.subject?.gender || "Person"}, ${
          s1.hair?.color || ""
        } hair, wearing ${s1.outfit?.mainClothing || ""}.`
      );
    }

    // 3. Describe Subject B
    const s2 = subjects[1];
    if (s2) {
      p.push(
        `[Subject B]: ${s2.subject?.gender || "Person"}, ${
          s2.hair?.color || ""
        } hair, wearing ${s2.outfit?.mainClothing || ""}.`
      );
    }

    // 4. Shared Environment & Tech
    if (scene.environment)
      p.push(
        `Background: ${scene.environment.location || ""}, ${
          scene.environment.lighting || ""
        } lighting.`
      );
    if (scene.tech)
      p.push(
        `Style: ${scene.tech.viewpoint || ""}, ${scene.tech.quality || ""}.`
      );

    return p.filter(Boolean).join(" ");
  };

  const generatedPrompt = computed(() => {
    if (subjects.value.length === 0) return "";

    // Nếu chỉ có 1 người -> Dùng hàm chi tiết
    if (subjects.value.length === 1) {
      return buildSinglePrompt(subjects.value[0], scene.value);
    }

    // Nếu có từ 2 người trở lên -> Dùng hàm tương tác
    return buildMultiPrompt(subjects.value, scene.value);
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
