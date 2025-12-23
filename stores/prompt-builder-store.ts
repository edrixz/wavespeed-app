import { defineStore } from "pinia";
import type { Scene, Subject } from "~/types";

export const usePromptBuilderStore = defineStore("promptBuilder", () => {
  const { setStatus } = useLogger();
  const payloadStore = useWavespeedPayloadStore();
  const { prompt } = storeToRefs(payloadStore);

  // --- 1. STATE (Dữ liệu) ---
  const subjects = ref<Subject[]>([createDefaultSubject("sub-1", 0)]);

  const activeSubjectId = ref("sub-1");

  const scene = ref<Scene>(createDefaultScene());

  const addSubject = () => {
    const newId = `sub-${Date.now()}`;
    subjects.value.push(createDefaultSubject(newId));
    activeSubjectId.value = newId;
    setStatus("New subject added", "info");
  };

  const removeSubject = (id: string) => {
    const index = subjects.value.findIndex((s) => s.id === id);
    if (index === -1) return;
    if (subjects.value.length <= 1)
      return alert("Cannot remove the last subject!");

    if (activeSubjectId.value === id) {
      const newActive = subjects.value[index - 1] || subjects.value[index + 1];
      activeSubjectId.value = newActive.id;
    }
    subjects.value.splice(index, 1);
  };

  // 1. Computed: Preview prompt cho từng Subject riêng lẻ
  const subjectPreviews = computed(() => {
    return subjects.value.map((s) => ({
      id: s.id,
      // Chỉ build phần mô tả nhân vật, không kèm Scene chung
      prompt: getSubjectBlock(s),
    }));
  });

  // 2. Logic Build Multi-Prompt (Tối ưu cho 90-99% reconstruction)
  const buildMultiPrompt = (subs: Subject[], sc: Scene): string => {
    const p: string[] = [];

    // Tổng quan bối cục tương tác
    const interaction = subs[0]?.pose?.action || "interacting together";
    p.push(
      `[Composition]: A multi-subject scene featuring ${subs.length} people, ${interaction}.`
    );

    // Chi tiết từng Subject (Sử dụng block từ utils)
    subs.forEach((s, idx) => {
      const label = `[Subject ${String.fromCharCode(65 + idx)}]`;
      p.push(`${label}: ${getSubjectBlock(s)}`);
    });

    // Bối cảnh chung & Kỹ thuật
    const { environment, technical } = getSceneBlock(sc);
    p.push(`[Environment]: ${environment}.`);
    p.push(`[Technical Style]: ${technical}.`);

    const ar = subs[0]?.pose?.aspectRatio
      ? `--ar ${subs[0].pose.aspectRatio.replace(":", "/")}`
      : "";
    return `${p.join(" ")} ${ar}`.trim();
  };

  // 3. Final Preview Prompt
  const generatedPrompt = computed(() => {
    if (subjects.value.length === 0) return "";

    return subjects.value.length === 1
      ? assemblePrompt(subjects.value[0], scene.value)
      : buildMultiPrompt(subjects.value, scene.value);
  });

  // Final Negative Prompt (New)
  const generatedNegativePrompt = computed(() => {
    if (subjects.value.length === 0) return "";
    // Lấy tech của scene làm gốc để tạo negative prompt
    const combinedData = {
      ...subjects.value[0],
      ...scene.value,
    } as any;
    return assembleNegativePrompt(combinedData);
  });

  // --- 4. COMPUTED ---
  const currentSubject = computed(() =>
    subjects.value.find((s) => s.id === activeSubjectId.value)
  );

  // --- 5. UTILS ---
  const applyToWavespeedPayload = () => {
    if (!generatedPrompt.value) return;
    prompt.value = generatedPrompt.value;
    setStatus(`Prompt reconstructed and applied!`, "success");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt.value);
    applyToWavespeedPayload();
  };

  return {
    subjects,
    activeSubjectId,
    currentSubject,
    scene,
    subjectPreviews,
    generatedPrompt,
    generatedNegativePrompt,
    addSubject,
    removeSubject,
    applyToWavespeedPayload,
    copyToClipboard,
  };
});

// --- HELPER: Tạo cấu trúc Subject mặc định ---
const createDefaultSubject = (id: string, refIdx: number = -1): Subject => ({
  id,
  refImageIdx: refIdx,
  subject: {
    gender: "Female",
    age: "",
    ethnicity: "",
    bodyType: "",
    skinTone: "",
    skinDetails: "",
    breast: "",
    nipple: "",
    pubicHair: "",
    genitals: "",
  },
  face: {
    structure: "",
    eyes: "",
    eyebrows: "",
    nose: "",
    lips: "",
    skinTexture: "",
    expression: "",
    makeup: "",
  },
  hair: {
    description: "",
    color: "",
    length: "",
    texture: "",
  },
  outfit: {
    description: "",
    materials: "",
    layering: "",
    fit: "",
    details: "",
    accessories: "",
    fabricInteraction: "",
  },
  pose: {
    action: "",
    posture: "",
    headAngle: "",
    hands: "",
    interaction: "",
    framing: "",
    perspective: "",
    aspectRatio: "",
  },
});

const createDefaultScene = (): Scene => ({
  environment: {
    location: "Keep location as in Image #1",
    lighting: "",
    lightColor: "",
    shadows: "",
    atmosphere: "",
    colorPalette: "",
  },
  tech: {
    camera: "Hasselblad H6D-100c medium format digital camera",
    lensSettings: "eighty-five millimeter prime lens at f1.4 for creamy bokeh",
    filmEffect: "",
    artStyle: "",
    postProcessing: "",
    viewpoint: "",
  },
});
