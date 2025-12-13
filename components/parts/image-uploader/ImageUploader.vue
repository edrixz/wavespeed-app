<script setup lang="ts">
import { useImageUploader } from "~/composables";

const {
  previewImages,
  mainInputRef,
  replaceInputRef,
  triggerAdd,
  triggerReplace,
  onFileChange,
  onReplaceFileChange,
  removeImage,
} = useImageUploader();
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-end mb-2">
      <label class="flex items-center gap-1 text-sm font-medium text-gray-300">
        Reference Images
        <span
          class="text-xs text-gray-500 font-normal"
          v-if="previewImages.length > 0"
        >
          ({{ previewImages.length }} active)
        </span>
      </label>
    </div>

    <input
      ref="mainInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
    <input
      ref="replaceInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceFileChange"
    />

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="(img, idx) in previewImages"
        :key="idx"
        @click="triggerReplace(idx)"
        class="group relative aspect-square bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all cursor-pointer hover:opacity-90"
        title="Click to replace image"
      >
        <img :src="img" class="w-full h-full object-cover" />

        <button
          v-if="previewImages.length > 1"
          @click.stop="removeImage(idx)"
          class="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-gray-300 hover:bg-red-600 hover:text-white transition-colors z-20 backdrop-blur-sm"
          title="Remove image"
        >
          <IconsClose />
        </button>

        <div
          class="absolute bottom-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md z-10 pointer-events-none"
        >
          #{{ idx + 1 }}
        </div>
      </div>

      <button
        @click="triggerAdd"
        class="aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/30 text-gray-400 hover:text-blue-400 hover:border-blue-500 hover:bg-gray-800 transition-all group"
      >
        <div
          class="w-8 h-8 rounded-full bg-gray-700 group-hover:bg-blue-900/50 flex items-center justify-center transition-colors"
        >
          <IconsPlus />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider"
          >Add New</span
        >
      </button>
    </div>
  </div>
</template>
