<script setup lang="ts">
// Nhận v-model trực tiếp cho object settings
const settings = defineModel<{
  prompt: string;
  width: number;
  height: number;
  enableSafetyChecker: boolean;
  enableSyncMode: boolean;
  enableBase64Output: boolean;
}>({ required: true });

// Danh sách các tỷ lệ mẫu
const ratios = {
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

// Hàm áp dụng tỷ lệ với kích thước lớn nhất (Max 4096)
const applyRatio = (wRatio: number, hRatio: number) => {
  const MAX_SIZE = 4096;
  let newW, newH;

  if (wRatio > hRatio) {
    // Nếu là ảnh ngang: Width max, Height theo tỷ lệ
    newW = MAX_SIZE;
    newH = (MAX_SIZE * hRatio) / wRatio;
  } else if (hRatio > wRatio) {
    // Nếu là ảnh dọc: Height max, Width theo tỷ lệ
    newH = MAX_SIZE;
    newW = (MAX_SIZE * wRatio) / hRatio;
  } else {
    // Vuông
    newW = MAX_SIZE;
    newH = MAX_SIZE;
  }

  // Làm tròn về bội số của 64 để tránh lỗi AI
  settings.value.width = Math.round(newW / 64) * 64;
  settings.value.height = Math.round(newH / 64) * 64;
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium mb-2 text-gray-300">Prompt</label>
      <textarea
        v-model="settings.prompt"
        rows="4"
        class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-3 text-gray-300"
        >Quick Ratios (Max Size)</label
      >
      <div class="space-y-2">
        <div class="flex gap-2">
          <span class="text-xs text-gray-500 w-16 flex items-center"
            >Square:</span
          >
          <button
            v-for="r in ratios.square"
            :key="r.label"
            @click="applyRatio(r.w, r.h)"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-xs transition-colors"
          >
            {{ r.label }}
          </button>
        </div>
        <div class="flex gap-2">
          <span class="text-xs text-gray-500 w-16 flex items-center"
            >Vertical:</span
          >
          <button
            v-for="r in ratios.vertical"
            :key="r.label"
            @click="applyRatio(r.w, r.h)"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-xs transition-colors"
          >
            {{ r.label }}
          </button>
        </div>
        <div class="flex gap-2">
          <span class="text-xs text-gray-500 w-16 flex items-center"
            >Horizontal:</span
          >
          <button
            v-for="r in ratios.horizontal"
            :key="r.label"
            @click="applyRatio(r.w, r.h)"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-xs transition-colors"
          >
            {{ r.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-5 bg-gray-700/30 p-4 rounded-lg border border-gray-700/50"
    >
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs text-gray-400">Width (px)</label>
          <input
            type="number"
            v-model.number="settings.width"
            min="64"
            max="4096"
            step="64"
            class="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none text-blue-400 font-bold"
          />
        </div>
        <input
          type="range"
          v-model.number="settings.width"
          min="64"
          max="4096"
          step="64"
          class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs text-gray-400">Height (px)</label>
          <input
            type="number"
            v-model.number="settings.height"
            min="64"
            max="4096"
            step="64"
            class="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-right text-xs focus:ring-1 focus:ring-blue-500 outline-none text-blue-400 font-bold"
          />
        </div>
        <input
          type="range"
          v-model.number="settings.height"
          min="64"
          max="4096"
          step="64"
          class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <p class="text-[10px] text-center text-gray-500 font-mono mt-1">
        Final Size: {{ settings.width }} x {{ settings.height }}
      </p>
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
