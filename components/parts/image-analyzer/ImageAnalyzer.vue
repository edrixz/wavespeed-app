<script setup lang="ts">
import { useImageAnalyzer, useLogger } from "~/composables";

const store = usePromptBuilderStore();
const { currentSubject } = storeToRefs(store);

// --- GEMINI INTEGRATION ---
const { setStatus } = useLogger();
const { analyzeImage, isAnalyzing, analyzingMode } = useImageAnalyzer();

const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const handleMagicFill = async (mode: "fast" | "pro") => {
  // 1. Xác định ảnh cần phân tích (Giữ nguyên logic cũ)
  const currentSub = currentSubject.value;
  if (!currentSub) return;

  let targetImageIdx = 0;
  if (currentSub && currentSub.refImageIdx !== -1) {
    targetImageIdx = currentSub.refImageIdx;
  }
  const targetImage = images.value[targetImageIdx];
  if (!targetImage) return alert("Please upload an image first!");

  // 2. Gọi API
  const data = await analyzeImage(targetImage.url, mode);

  if (data && currentSub) {
    // --- A. MAP IDENTITY (SUBJECT) ---
    if (data.subject) {
      if (data.subject.gender)
        currentSub.gender = normalizeGender(data.subject.gender);
      if (data.subject.age) currentSub.age = data.subject.age;
      if (data.subject.bodyType) currentSub.bodyType = data.subject.bodyType;

      // Gộp Skin Tone + Skin Texture vào trường Skin
      const skinParts = [];
      if (data.subject.skinTone) skinParts.push(data.subject.skinTone);
      if (data.subject.ethnicity) skinParts.push(data.subject.ethnicity); // Thêm chủng tộc vào skin/body description
      if (data.face?.skinTexture) skinParts.push(data.face.skinTexture);
      currentSub.skin = skinParts.join(", ");
    }

    // --- B. MAP FACE & MAKEUP ---
    if (data.face) {
      currentSub.eyes = data.face.eyes || "";
      currentSub.expression = data.face.expression || "";

      // Gộp Makeup + Lips + Face Shape
      const faceFeatures = [];
      if (data.face.shape) faceFeatures.push(`${data.face.shape}`);
      if (data.face.nose) faceFeatures.push(data.face.nose);
      if (data.face.lips) faceFeatures.push(data.face.lips);
      if (data.face.makeup) currentSub.makeup = data.face.makeup;
      // Gán vào faceReference (hoặc trường nào bạn dùng để tả mặt chi tiết)
      // currentSub.faceReference = faceFeatures.join(', ')
    }

    // --- C. MAP HAIR ---
    if (data.hair) {
      currentSub.hairColor = data.hair.color || "";
      currentSub.hairLength = data.hair.length || "";
      // Gộp Style + Texture
      const hairStyleParts = [];
      if (data.hair.style) hairStyleParts.push(data.hair.style);
      if (data.hair.texture) hairStyleParts.push(data.hair.texture);
      currentSub.hairStyle = hairStyleParts.join(", ");
    }

    // --- D. MAP OUTFIT (Quần áo) ---
    if (data.outfit) {
      const clothesParts = [];
      if (data.outfit.mainClothing) clothesParts.push(data.outfit.mainClothing);
      if (data.outfit.fabric) clothesParts.push(data.outfit.fabric); // Thêm chất liệu (Silk...)
      if (data.outfit.details) clothesParts.push(data.outfit.details);
      if (data.outfit.accessories) clothesParts.push(data.outfit.accessories); // Thêm phụ kiện (Hoa...)
      currentSub.clothes = clothesParts.join(", ");
    }

    // --- E. MAP POSE ---
    if (data.pose) {
      const poseParts = [];
      if (data.pose.action) poseParts.push(data.pose.action);
      if (data.pose.posture) poseParts.push(data.pose.posture);
      if (data.pose.hands) poseParts.push(data.pose.hands); // Quan trọng: Tay cầm hoa
      if (data.pose.headAngle) poseParts.push(data.pose.headAngle);
      currentSub.pose = poseParts.join(", ");
    }

    // --- F. MAP GLOBAL SCENE (Background & Lighting) ---
    if (data.environment) {
      // Gộp Location + Atmosphere + Shadows
      const bgParts = [];
      if (data.environment.location) bgParts.push(data.environment.location);
      if (data.environment.atmosphere)
        bgParts.push(data.environment.atmosphere);
      if (data.environment.shadows) bgParts.push(data.environment.shadows);
      store.scene.background = bgParts.join(", ");

      if (data.environment.lighting)
        store.scene.lighting = data.environment.lighting;
    }

    // --- G. MAP TECH (Camera & Quality) ---
    if (data.tech) {
      const camParts = [];
      if (data.tech.camera) camParts.push(data.tech.camera);
      if (data.tech.lens) camParts.push(data.tech.lens);
      if (data.tech.filmStock) camParts.push(data.tech.filmStock);
      if (data.tech.viewpoint) camParts.push(data.tech.viewpoint);
      store.scene.camera = camParts.join(", ");

      // Nếu bạn có trường Quality riêng
      if (data.tech.quality) store.scene.quality = data.tech.quality;
    }

    // Thông báo nhỏ (Optional)
    setStatus("Magic Fill applied successfully!", "success");
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      @click="handleMagicFill('fast')"
      :disabled="isAnalyzing || images.length === 0"
      class="relative group text-[10px] font-bold px-3 py-1.5 rounded border transition-all flex items-center gap-1.5 overflow-hidden"
      :class="
        isAnalyzing
          ? 'bg-gray-800 text-gray-500 border-gray-700'
          : 'bg-gradient-to-br from-blue-900 to-gray-900 hover:from-blue-800 hover:to-gray-800 text-blue-300 border-blue-700/50 hover:border-blue-500'
      "
    >
      <span v-if="analyzingMode === 'fast'" class="animate-spin">⚡</span>
      <span v-else>⚡ Magic Fill</span>

      <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      >
        Fast Analysis (Gemini Flash)
      </div>
    </button>

    <button
      @click="handleMagicFill('pro')"
      :disabled="isAnalyzing || images.length === 0"
      class="relative group text-[10px] font-bold px-3 py-1.5 rounded border transition-all flex items-center gap-1.5 overflow-hidden"
      :class="
        isAnalyzing
          ? 'bg-gray-800 text-gray-500 border-gray-700'
          : 'bg-gradient-to-br from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-300 border-purple-700/50 hover:border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
      "
    >
      <span v-if="analyzingMode === 'pro'" class="animate-spin">🧠</span>
      <span v-else>🧠 Magic Pro</span>

      <div
        class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
      ></div>

      <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      >
        Deep Reasoning (Gemini Pro)
      </div>
    </button>

    <div class="w-[1px] h-4 bg-gray-700 mx-1"></div>
  </div>
</template>
