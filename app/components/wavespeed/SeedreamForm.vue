<script lang="ts" setup>
const payloadStore = useSeedreamPayloadStore();

const {
  width,
  height,
  prompt,
  negative_prompt,
  enableSafetyChecker,
  enableSyncMode,
  enableBase64Output,
} = storeToRefs(payloadStore);
</script>

<template>
  <div class="space-y-2 animate-fade-in">
    <div class="flex justify-between items-center ml-1">
      <div class="flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
        <span
          class="text-[9px] font-black text-blue-400/80 uppercase tracking-widest"
        >
          Prompt
        </span>
      </div>
    </div>

    <div class="relative group overflow-hidden rounded-xl">
      <textarea
        v-model="prompt"
        rows="14"
        class="w-full bg-blue-600/[0.03] border border-blue-600/20 rounded-xl p-4 text-[10px] text-blue-200/60 font-mono italic leading-relaxed outline-none focus:border-blue-600/40 focus:bg-blue-600/[0.06] transition-all resize-none no-scrollbar"
        placeholder="Describe your vision..."
      />
    </div>
  </div>

  <div class="space-y-2 animate-fade-in">
    <div class="flex justify-between items-center ml-1">
      <div class="flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-red-500/50 rounded-full"></div>
        <span
          class="text-[9px] font-black text-red-500/80 uppercase tracking-widest"
        >
          Negative Prompt
        </span>
      </div>
    </div>

    <div class="relative group overflow-hidden rounded-xl">
      <textarea
        v-model="negative_prompt"
        rows="14"
        class="w-full bg-red-500/[0.03] border border-red-500/20 rounded-xl p-4 text-[10px] text-red-200/60 font-mono italic leading-relaxed outline-none focus:border-red-500/40 focus:bg-red-500/[0.06] transition-all resize-none no-scrollbar"
        placeholder="Avoid these elements..."
      />
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
</style>
