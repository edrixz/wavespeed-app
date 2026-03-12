<script setup lang="ts">
definePageMeta({ layout: "default" });
const {
  canvasRef,
  isModelLoading,
  isImageProcessing,
  isProcessing,
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

const fileRef = ref<HTMLInputElement | null>(null);
const onFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (ev.target?.result) init(ev.target.result as string);
  };
  reader.readAsDataURL(file);
};
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-20"
  >
    <div class="lg:col-span-4 space-y-6">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-5 rounded-2xl border border-black/5 space-y-6 lg:sticky lg:top-8"
      >
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/gemini"
            class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
            ><UIcon name="i-heroicons-arrow-left"
          /></NuxtLink>
          <h2 class="text-xl font-black uppercase tracking-tight">
            Magic Eraser
          </h2>
        </div>

        <div
          class="p-3 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2"
          :class="
            isModelLoading
              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
              : 'bg-green-50 dark:bg-green-950/20 text-green-600'
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
          {{ isModelLoading ? "Đang tải AI Model..." : "AI Sẵn sàng" }}
        </div>

        <UButton
          v-if="!uploadedImage"
          block
          color="neutral"
          variant="soft"
          class="h-32 border-2 border-dashed"
          @click="fileRef?.click()"
          >Tải ảnh lên</UButton
        >
        <input type="file" ref="fileRef" class="hidden" @change="onFile" />

        <div v-if="uploadedImage" class="space-y-5">
          <div
            class="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-black/5"
          >
            <UButton
              block
              :variant="activeTool === 'brush' ? 'solid' : 'ghost'"
              color="neutral"
              @click="activeTool = 'brush'"
              class="flex-1 rounded-lg"
              >Cọ vẽ</UButton
            >
            <UButton
              block
              :variant="activeTool === 'eraser' ? 'solid' : 'ghost'"
              color="neutral"
              @click="activeTool = 'eraser'"
              class="flex-1 rounded-lg"
              >Tẩy</UButton
            >
          </div>

          <div class="space-y-3">
            <div
              class="flex justify-between text-[10px] font-black uppercase text-gray-400"
            >
              <span>Brush Size</span><span>{{ brushSize }}px</span>
            </div>
            <input
              type="range"
              v-model.number="brushSize"
              min="5"
              max="150"
              class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-primary"
            />
          </div>

          <UButton
            block
            color="neutral"
            variant="ghost"
            @click="clear"
            :disabled="!hasMaskContent"
            >Xóa vùng chọn</UButton
          >
          <PartsButtonPrimary
            icon="lucide:eraser"
            :loading="isProcessing"
            :disabled="!hasMaskContent"
            >Xác nhận xóa</PartsButtonPrimary
          >
        </div>
      </div>
    </div>

    <div
      class="lg:col-span-8 bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-black/5 min-h-150 flex items-center justify-center relative overflow-hidden"
    >
      <div
        v-if="uploadedImage && (isImageProcessing || isModelLoading)"
        class="absolute inset-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur flex flex-col items-center justify-center text-center p-10"
      >
        <UIcon
          name="i-heroicons-cpu-chip"
          class="w-12 h-12 text-primary animate-pulse mb-4"
        />
        <h3 class="font-black uppercase tracking-tight">
          {{
            isModelLoading ? "Khởi tạo AI..." : "AI đang quét cấu trúc ảnh..."
          }}
        </h3>
      </div>

      <canvas
        v-if="uploadedImage"
        ref="canvasRef"
        @click="handleAiSelect"
        @mousedown="startDraw"
        @mousemove="moveDraw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
        @touchstart.passive="startDraw"
        @touchmove.passive="moveDraw"
        @touchend="stopDraw"
        class="max-w-full max-h-[75vh] shadow-2xl rounded-lg cursor-crosshair border border-black/5"
      />
      <div v-else class="text-center opacity-30 select-none">
        <UIcon name="i-heroicons-photo" class="w-16 h-16 mb-2" />
        <p class="font-black uppercase tracking-widest text-sm">Workspace</p>
      </div>
    </div>
  </div>
</template>
