<script setup lang="ts">
const {
  canvasRef,
  isModelLoading,
  isImageProcessing,
  uploadedImage,
  hasMaskContent,
  brushSize,
  activeTool,
  init,
  handleAiSelect,
  startDraw,
  moveDraw,
  stopDraw,
  clear,
} = useMagicEraser();
const fileInput = ref<HTMLInputElement | null>(null);

const onFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") init(ev.target.result);
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div
    class="h-screen flex flex-col lg:grid lg:grid-cols-12 overflow-hidden bg-white dark:bg-black"
  >
    <div
      class="lg:col-span-3 border-r border-black/5 dark:border-white/5 p-4 space-y-4 flex flex-col shrink-0"
    >
      <div
        class="flex items-center gap-3"
      >
        <NuxtLink
          to="/gemini"
          class="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center text-gray-700 dark:text-gray-300"
          ><Icon name="lucide:arrow-left" class="w-5 h-5"
        /></NuxtLink>
        <h2 class="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">Magic Eraser</h2>
      </div>
      <div
        class="p-2 rounded-lg border text-[9px] font-black uppercase flex items-center gap-2"
        :class="
          isModelLoading
            ? 'bg-amber-50 text-amber-600'
            : 'bg-green-50 text-green-600'
        "
      >
        <Icon
          :name="
            isModelLoading
              ? 'lucide:loader-2'
              : 'lucide:check-circle'
          "
          class="w-4 h-4"
          :class="isModelLoading && 'animate-spin'"
        />
        {{ isModelLoading ? "Loading AI..." : "AI Ready" }}
      </div>
      <div v-if="uploadedImage" class="space-y-4">
        <div class="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
          <button
            v-for="t in ['ai', 'brush', 'eraser'] as const"
            :key="t"
            @click="activeTool = t"
            class="flex-1 text-[10px] uppercase font-bold tracking-wider py-2 rounded-lg transition-colors outline-none cursor-pointer"
            :class="activeTool === t ? 'bg-white dark:bg-[#1a1a1a] shadow-sm text-neutral-900 dark:text-white' : 'bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'"
          >
            {{ t === "ai" ? "Auto" : t === "brush" ? "Brush" : "Eraser" }}
          </button>
        </div>
        <div v-if="activeTool !== 'ai'" class="space-y-2">
          <input
            type="range"
            v-model.number="brushSize"
            min="5"
            max="150"
            class="w-full accent-primary"
          />
        </div>
        <button
          @click="clear"
          class="w-full text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-neutral-900 dark:hover:text-white transition-colors py-2 outline-none cursor-pointer"
          >Clear All</button
        >
      </div>
      <button
        v-else
        class="w-full h-20 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors outline-none cursor-pointer"
        @click="fileInput?.click()"
        >Upload Image</button
      >
      <input type="file" ref="fileInput" class="hidden" @change="onFile" />
    </div>
    <div
      class="lg:col-span-9 flex-1 relative bg-gray-50 dark:bg-neutral-900/50 flex items-center justify-center overflow-hidden"
    >
      <div
        v-if="uploadedImage && isImageProcessing"
        class="absolute inset-0 z-30 bg-white/80 flex flex-col items-center justify-center"
      >
        <Icon
          name="lucide:cpu"
          class="w-10 h-10 text-primary animate-pulse"
        />
        <span class="text-[10px] font-black uppercase tracking-widest"
          >Analyzing Image...</span
        >
      </div>
      <canvas
        v-if="uploadedImage"
        ref="canvasRef"
        @click="handleAiSelect"
        @mousedown="startDraw"
        @mousemove="moveDraw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
        @touchstart.passive="
          activeTool === 'ai' ? handleAiSelect($event) : startDraw($event)
        "
        @touchmove.passive="moveDraw"
        @touchend="stopDraw"
        class="max-w-full max-h-full shadow-xl bg-white touch-none cursor-crosshair"
      />
    </div>
  </div>
</template>

<style scoped>
.touch-none {
  touch-action: none;
}
</style>
