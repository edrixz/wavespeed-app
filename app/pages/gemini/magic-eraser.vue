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
      class="lg:col-span-3 border-r border-black/5 p-4 space-y-4 flex flex-col shrink-0"
    >
      <div
        class="flex items-center gap-3 font-black uppercase text-[10px] tracking-widest"
      >
        <NuxtLink
          to="/gemini"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          ><UIcon name="i-heroicons-arrow-left"
        /></NuxtLink>
        <h2>Magic Eraser</h2>
      </div>
      <div
        class="p-2 rounded-lg border text-[9px] font-black uppercase flex items-center gap-2"
        :class="
          isModelLoading
            ? 'bg-amber-50 text-amber-600'
            : 'bg-green-50 text-green-600'
        "
      >
        <UIcon
          :name="
            isModelLoading
              ? 'i-heroicons-arrow-path'
              : 'i-heroicons-check-circle'
          "
          :class="isModelLoading && 'animate-spin'"
        />
        {{ isModelLoading ? "Loading AI..." : "AI Ready" }}
      </div>
      <div v-if="uploadedImage" class="space-y-4">
        <div class="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
          <UButton
            v-for="t in ['ai', 'brush', 'eraser'] as const"
            :key="t"
            block
            :variant="activeTool === t ? 'solid' : 'ghost'"
            color="neutral"
            @click="activeTool = t"
            class="flex-1 text-[10px] capitalize"
          >
            {{ t === "ai" ? "Auto" : t === "brush" ? "Brush" : "Eraser" }}
          </UButton>
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
        <UButton
          color="neutral"
          variant="ghost"
          @click="clear"
          class="w-full text-[10px] font-bold"
          >Clear All</UButton
        >
      </div>
      <UButton
        v-else
        block
        color="neutral"
        variant="soft"
        class="h-20 border-2 border-dashed rounded-xl"
        @click="fileInput?.click()"
        >Upload Image</UButton
      >
      <input type="file" ref="fileInput" class="hidden" @change="onFile" />
    </div>
    <div
      class="lg:col-span-9 flex-1 relative bg-gray-50 flex items-center justify-center overflow-hidden"
    >
      <div
        v-if="uploadedImage && isImageProcessing"
        class="absolute inset-0 z-30 bg-white/80 flex flex-col items-center justify-center"
      >
        <UIcon
          name="i-heroicons-cpu-chip"
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
