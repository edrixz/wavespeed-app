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

// Trạng thái để kích hoạt hiệu ứng Reset]
const isResetting = ref(false);

const handleReset = () => {
  isResetting.value = true; // Kích hoạt class animation]
  resetToDefault(); // Gọi logic xóa dữ liệu]
  
  // Tắt hiệu ứng sau khi hoàn tất (600ms khớp với CSS)]
  setTimeout(() => {
    isResetting.value = false;
  }, 600);
};
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
        <PartsPromptBuilderPresetSimpleGallery />
      </section>

      <div class="space-y-2 animate-fade-in">
        <div class="flex justify-between items-center ml-1">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-[9px] font-black text-blue-400/80 uppercase tracking-widest">
              Input: Positive Vision
            </span>
          </div>
          <button 
            @click="handleReset"
            :disabled="isResetting"
            class="text-[8px] text-gray-600 hover:text-blue-400 italic uppercase font-bold transition-all active:scale-95 disabled:opacity-30"
          >
            [ Reset System ]
          </button>
        </div>

        <div class="relative group overflow-hidden rounded-xl">
          <textarea
            v-model="prompt"
            rows="14"
            class="w-full bg-blue-600/[0.03] border border-blue-600/20 rounded-xl p-4 text-[10px] text-blue-200/60 font-mono italic leading-relaxed outline-none focus:border-blue-600/40 focus:bg-blue-600/[0.06] transition-all resize-none no-scrollbar"
            placeholder="Describe your vision..."
          />
          
          <div v-if="isResetting" class="absolute inset-0 pointer-events-none z-10">
            <div class="sweep-light"></div>
          </div>
        </div>
      </div>

      <div class="space-y-2 animate-fade-in">
        <div class="flex justify-between items-center ml-1">
          <div class="flex items-center gap-1.5">
             <div class="w-1.5 h-1.5 bg-red-500/50 rounded-full"></div>
             <span class="text-[9px] font-black text-red-500/80 uppercase tracking-widest">
               System: Negative Constraints
             </span>
          </div>
          <button 
            @click="handleReset"
            :disabled="isResetting"
            class="text-[8px] text-gray-600 hover:text-red-500 italic uppercase font-bold transition-all active:scale-95"
          >
            [ Clear All ]
          </button>
        </div>

        <div class="relative group overflow-hidden rounded-xl">
          <textarea
            v-model="negative_prompt"
            rows="14"
            class="w-full bg-red-500/[0.03] border border-red-500/20 rounded-xl p-4 text-[10px] text-red-200/60 font-mono italic leading-relaxed outline-none focus:border-red-500/40 focus:bg-red-500/[0.06] transition-all resize-none no-scrollbar"
            placeholder="Avoid these elements..."
          />
          
          <div v-if="isResetting" class="absolute inset-0 pointer-events-none z-10">
            <div class="sweep-light red-sweep"></div>
          </div>
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

/* Hiệu ứng tia sáng quét ngang] */
.sweep-light {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(59, 130, 246, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(59, 130, 246, 0.1),
    transparent
  );
  transform: skewX(-20deg);
  animation: sweep 0.6s ease-out forwards;
}

/* Biến thể màu đỏ cho Negative Prompt] */
.red-sweep {
  background: linear-gradient(
    to right,
    transparent,
    rgba(239, 68, 68, 0.1),
    rgba(255, 255, 255, 0.5),
    rgba(239, 68, 68, 0.1),
    transparent
  );
}

@keyframes sweep {
  0% { left: -100%; }
  100% { left: 160%; }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
