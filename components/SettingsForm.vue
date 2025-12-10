<script setup lang="ts">
// Nhận v-model trực tiếp cho object settings
const settings = defineModel<{
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  enableSafetyChecker: boolean;
  enableSyncMode: boolean;
  enableBase64Output: boolean;
}>({ required: true });

// 1. DATA: Định nghĩa các tỷ lệ
const ratiosData = {
  square: [{ label: "1:1", w: 1, h: 1 }],
  vertical: [
    { label: "3:4", w: 3, h: 4 },
    { label: "2:3", w: 2, h: 3 },
    { label: "9:16", w: 9, h: 16 },
  ],
  horizontal: [
    { label: "4:3", w: 4, h: 3 },
    { label: "3:2", w: 3, h: 2 },
    { label: "16:9", w: 16, h: 9 },
  ],
};

// 2. COMPUTED: Gộp tất cả thành 1 danh sách phẳng để loop 1 lần cho tiện
const ratioList = computed(() => [
  ...ratiosData.square,
  ...ratiosData.vertical,
  ...ratiosData.horizontal,
]);

// 3. LOGIC: Tính style cho nút hiển thị (giữ nguyên logic cũ)
const getButtonStyle = (w: number, h: number) => {
  const BASE_SIZE = 20; // Kích thước chuẩn (px)

  if (w > h) {
    // Ngang
    return { width: `${BASE_SIZE}px`, height: `${(BASE_SIZE * h) / w}px` };
  }
  if (h > w) {
    // Dọc
    return { height: `${BASE_SIZE}px`, width: `${(BASE_SIZE * w) / h}px` };
  }
  // Vuông
  return { width: `${BASE_SIZE * 0.9}px`, height: `${BASE_SIZE * 0.9}px` };
};

// 4. LOGIC: Apply kích thước (giữ nguyên)
const applyRatio = (wRatio: number, hRatio: number) => {
  const MAX_SIZE = 4096;
  let newW, newH;
  if (wRatio > hRatio) {
    newW = MAX_SIZE;
    newH = (MAX_SIZE * hRatio) / wRatio;
  } else if (hRatio > wRatio) {
    newH = MAX_SIZE;
    newW = (MAX_SIZE * wRatio) / hRatio;
  } else {
    newW = MAX_SIZE;
    newH = MAX_SIZE;
  }
  settings.value.width = Math.round(newW / 64) * 64;
  settings.value.height = Math.round(newH / 64) * 64;
};

// Hàm kiểm tra xem tỷ lệ hiện tại có khớp với nút này không
const isActiveRatio = (wRatio: number, hRatio: number) => {
  const currentRatio = settings.value.width / settings.value.height;
  const targetRatio = wRatio / hRatio;

  // So sánh với sai số rất nhỏ (epsilon) để tránh lỗi số học
  return Math.abs(currentRatio - targetRatio) < 0.05;
};
</script>

<template>
  <div class="space-y-5">
    <div>
      <label class="block text-sm font-medium mb-2 text-gray-300">
        Prompt <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="settings.prompt"
        rows="3"
        class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        placeholder="Describe..."
      ></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium mb-2 text-gray-300"
        >Negative</label
      >
      <textarea
        v-model="settings.negative_prompt"
        rows="2"
        class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
        placeholder="Bad quality..."
      ></textarea>
    </div>

    <div class="space-y-5">
      <div>
        <label class="block text-sm font-medium mb-3 text-gray-300"
          >Aspect Ratio</label
        >

        <div
          class="flex flex-wrap gap-2 bg-gray-700/30 p-2 rounded-lg border border-gray-700/50 justify-between"
        >
          <div
            v-for="r in ratioList"
            :key="r.label"
            class="flex flex-col items-center gap-2 group cursor-pointer"
            @click="applyRatio(r.w, r.h)"
          >
            <div class="h-8 w-8 flex items-end justify-center">
              <div
                class="border-2 rounded-[2px] transition-all shadow-sm duration-200"
                :class="
                  isActiveRatio(r.w, r.h)
                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]'
                    : 'bg-gray-600 border-gray-500 group-hover:bg-gray-500 group-hover:border-gray-400'
                "
                :style="getButtonStyle(r.w, r.h)"
              ></div>
            </div>

            <span
              class="text-[10px] font-mono transition-colors duration-200"
              :class="
                isActiveRatio(r.w, r.h)
                  ? 'text-blue-400 font-bold'
                  : 'text-gray-400 group-hover:text-gray-300'
              "
            >
              {{ r.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-2 gap-4 bg-gray-700/30 p-3 rounded-lg border border-gray-700/50"
    >
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-xs text-gray-400">Width</label>
          <input
            type="number"
            v-model.number="settings.width"
            class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
            step="64"
          />
        </div>
        <input
          type="range"
          v-model.number="settings.width"
          min="64"
          max="4096"
          step="64"
          class="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-xs text-gray-400">Height</label>
          <input
            type="number"
            v-model.number="settings.height"
            class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
            step="64"
          />
        </div>
        <input
          type="range"
          v-model.number="settings.height"
          min="64"
          max="4096"
          step="64"
          class="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>

    <div class="space-y-3 p-3 bg-gray-700/30 rounded-lg">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.enableSafetyChecker"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Safety Checker</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.enableSyncMode"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Sync Mode</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.enableBase64Output"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Base64 Output</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
