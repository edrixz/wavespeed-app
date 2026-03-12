<script setup lang="ts">
import { useImageUploader } from "~/composables/image/use-image-uploader";

const props = defineProps<{
  uploadMulti?: boolean;
}>();

const imageStore = useImagesStore();
const { images } = storeToRefs(imageStore);

const {
  addInputRef,
  replaceInputRef,
  addImage,
  replaceImage,
  onAddChange,
  onReplaceChange,
  removeImage,
} = useImageUploader();
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-end mb-2">
      <label
        class="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-gray-300 transition-colors"
      >
        Reference Images
        <span
          class="text-xs text-gray-500 font-normal"
          v-if="images.length > 0"
        >
          ({{ images.length }} active)
        </span>
      </label>
    </div>

    <input
      v-if="uploadMulti"
      ref="addInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onAddChange"
    />
    <input
      ref="replaceInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceChange"
    />

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        @click="replaceImage(idx)"
        class="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/10 dark:border-gray-700 overflow-hidden hover:border-blue-500 transition-all cursor-pointer hover:opacity-90"
        title="Click to replace image"
      >
        <img :src="img.url" class="w-full h-full object-cover" />

        <button
          v-if="images.length > 1"
          @click.stop="removeImage(idx)"
          class="absolute top-1 right-1 p-1 rounded-full bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-colors z-20 backdrop-blur-sm"
          title="Remove image"
        >
          <PartsIconsClose />
        </button>

        <div
          class="absolute bottom-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md z-10 pointer-events-none"
        >
          #{{ idx + 1 }}
        </div>
      </div>

      <button
        v-if="uploadMulti"
        @click="addImage"
        class="aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/10 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-black/5 dark:hover:bg-gray-800 transition-all group"
      >
        <div
          class="w-8 h-8 rounded-full bg-black/10 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 flex items-center justify-center transition-colors"
        >
          <PartsIconsPlus />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider"
          >Add New</span
        >
      </button>
    </div>
  </div>
</template>
