<script setup lang="ts">
const props = defineProps<{
  previewImages: string[];
}>();

const emit = defineEmits<{
  (e: "files-selected", files: FileList): void;
  (e: "remove-image", index: number): void;
  (e: "replace-image", index: number, file: File): void;
}>();

// Ref cho các input ẩn
const mainInputRef = ref<HTMLInputElement | null>(null);
const replaceInputRef = ref<HTMLInputElement | null>(null);
const replacingIndex = ref<number | null>(null);

// --- ACTIONS ---

// 1. Thêm ảnh mới
const triggerAdd = () => {
  mainInputRef.value?.click();
};
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) emit("files-selected", target.files);
  target.value = "";
};

// 2. Thay thế ảnh
const triggerReplace = (index: number) => {
  replacingIndex.value = index;
  replaceInputRef.value?.click();
};
// Hàm xử lý khi input ẩn chọn được file mới
const onReplaceFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Chỉ lấy file đầu tiên (vì chỉ thay thế 1 ảnh)
  const file = target.files?.[0];

  if (file && replacingIndex.value !== null) {
    // Bắn sự kiện về cha kèm index và file mới
    emit("replace-image", replacingIndex.value, file);
  }

  // Reset
  target.value = "";
  replacingIndex.value = null;
};
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
          @click.stop="emit('remove-image', idx)"
          class="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-gray-300 hover:bg-red-600 hover:text-white transition-colors z-20 backdrop-blur-sm"
          title="Remove image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-3.5 h-3.5"
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
            />
          </svg>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider"
          >Add New</span
        >
      </button>
    </div>
  </div>
</template>
