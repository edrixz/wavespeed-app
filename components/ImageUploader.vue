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
        class="group relative aspect-square bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-colors"
      >
        <img :src="img" class="w-full h-full object-cover" />

        <div
          class="absolute bottom-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md z-10"
        >
          #{{ idx + 1 }}
        </div>

        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]"
        >
          <button
            @click="triggerReplace(idx)"
            class="p-1.5 rounded-full bg-gray-700 hover:bg-blue-600 text-white transition-colors"
            title="Replace image"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              ></path>
            </svg>
          </button>

          <button
            @click="emit('remove-image', idx)"
            class="p-1.5 rounded-full bg-gray-700 hover:bg-red-600 text-white transition-colors"
            title="Remove image"
            :disabled="previewImages.length <= 1"
            :class="
              previewImages.length <= 1
                ? 'opacity-50 cursor-not-allowed hover:bg-gray-700'
                : ''
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
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
