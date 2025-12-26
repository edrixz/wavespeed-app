<script setup lang="ts">
const {
  isBuilderMode,
  prompt,
  negative_prompt,
  width,
  height,
  enableSafetyChecker,
  enableBase64Output,
  enableSyncMode,
  resetToDefault,
  toggleBuilderMode,
} = useSettingsForm();
</script>

<template>
  <div class="space-y-5">
    <div class="flex justify-between items-center mb-2">
      <label class="text-sm font-medium text-gray-300">Prompt Mode</label>
      <PartsButtonSwitch
        @toggleBuilder="toggleBuilderMode"
        :is-builder-mode="isBuilderMode"
      />
    </div>

    <template v-if="isBuilderMode">
      <div class="max-w-7xl mx-auto">
        <section class="mt-3">
          <PartsPromptBuilderPresetGallery />
        </section>
      </div>
      <PromptBuilder />
    </template>

    <template v-else>
      <section class="animate-fade-in">
        <LazyPartsPromptBuilderPresetSimpleGallery />
      </section>

      <div class="space-y-2">
        <div class="flex justify-between">
          <label class="text-sm font-medium text-gray-300">
            Prompt <span class="text-red-500">*</span>
          </label>
          <span
            class="text-xs text-gray-500 cursor-pointer hover:text-blue-400 transition-colors"
            @click="resetToDefault"
            >Reset Default</span
          >
        </div>
        <textarea
          v-model="prompt"
          rows="6"
          class="inp w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none resize-none placeholder-gray-600 transition-all shadow-inner"
          placeholder="Describe what you want to see..."
        />
      </div>

      <div class="space-y-2">
        <span
          class="text-[9px] font-black text-red-500/80 uppercase tracking-widest ml-1"
        >
          System: Negative Prompt
        </span>
        <div
          class="p-4 bg-red-500/5 rounded-xl border border-red-500/20 text-[10px] text-red-200/60 font-mono italic leading-relaxed"
        >
          {{ negative_prompt || "No negative constraints defined." }}
        </div>
      </div>

      <PartsAspectRatioList />

      <div
        class="grid grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-2xl border border-white/5"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label
              class="text-[10px] font-black uppercase text-gray-500 tracking-widest"
              >Width</label
            >
            <input
              type="number"
              v-model.number="width"
              class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
              step="64"
            />
          </div>
          <input
            type="range"
            v-model.number="width"
            min="64"
            max="4096"
            step="64"
            class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label
              class="text-[10px] font-black uppercase text-gray-500 tracking-widest"
              >Height</label
            >
            <input
              type="number"
              v-model.number="height"
              class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
              step="64"
            />
          </div>
          <input
            type="range"
            v-model.number="height"
            min="64"
            max="4096"
            step="64"
            class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-2 p-4 bg-gray-800/20 rounded-2xl border border-white/5"
      >
        <label
          class="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
        >
          <span
            class="text-xs text-gray-400 group-hover:text-white transition-colors"
            >Safety Checker</span
          >
          <input
            type="checkbox"
            v-model="enableSafetyChecker"
            class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
        </label>
        <label
          class="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
        >
          <span
            class="text-xs text-gray-400 group-hover:text-white transition-colors"
            >Sync Mode (Real-time)</span
          >
          <input
            type="checkbox"
            v-model="enableSyncMode"
            class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
        </label>
        <label
          class="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
        >
          <span
            class="text-xs text-gray-400 group-hover:text-white transition-colors"
            >Base64 Output</span
          >
          <input
            type="checkbox"
            v-model="enableBase64Output"
            class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
        </label>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Hiệu ứng mượt mà khi chuyển đổi] */
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom range slider cho chuyên nghiệp hơn] */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
</style>
