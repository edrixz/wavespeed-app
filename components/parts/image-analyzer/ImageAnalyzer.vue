<script setup lang="ts">
import { useImageAnalyzer, useLogger } from "~/composables";
import { normalizeObject } from "~/utils/normalize";
import type { AnalyzedData } from "~/types";

const store = usePromptBuilderStore();
const { currentSubject } = storeToRefs(store);

// --- GEMINI INTEGRATION ---
const { setStatus } = useLogger();
const { analyzeImage, isAnalyzing, analyzingMode } = useImageAnalyzer();

const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const mapMagicFillToStore = (data: AnalyzedData) => {
  // 1. VALIDATION: Kiểm tra xem có Subject nào đang được chọn không
  if (!store.currentSubject) {
    setStatus("Please select a subject tab first", "warning");
    return;
  }

  // 2. MAPPING CHARACTER DATA (Dành cho nhân vật hiện tại)
  // Chúng ta sử dụng hàm normalizeObject để dữ liệu đồng bộ với UI
  if (data.subject) {
    store.currentSubject.subject = normalizeObject(data.subject);
  }

  if (data.face) {
    store.currentSubject.face = normalizeObject(data.face);
  }

  if (data.hair) {
    store.currentSubject.hair = normalizeObject(data.hair);
  }

  if (data.outfit) {
    store.currentSubject.outfit = normalizeObject(data.outfit);
  }

  if (data.pose) {
    store.currentSubject.pose = normalizeObject(data.pose);
  }

  // 3. MAPPING GLOBAL SCENE (Dữ liệu bối cảnh dùng chung)
  if (data.environment) {
    store.scene.environment = normalizeObject(data.environment);
  }

  if (data.tech) {
    store.scene.tech = normalizeObject(data.tech);
  }
  setStatus("Magic Fill completed successfully!", "success");
};

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
  const response = await analyzeImage(targetImage.url, mode);

  if (response && currentSub) {
    // 3. Gọi hàm map để đổ dữ liệu vào Store
    mapMagicFillToStore(response);
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
