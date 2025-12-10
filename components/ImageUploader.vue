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

// Helper: Cắt ngắn URL cho gọn (giống UI mẫu)
const truncateUrl = (url: string) => {
  if (url.startsWith("blob:")) return "Local File (Click upload to save)";
  if (url.length > 40)
    return url.substring(0, 15) + "..." + url.substring(url.length - 15);
  return url;
};
</script>

<template>
  <div class="w-full">
    <label
      class="flex items-center gap-1 text-sm font-medium mb-3 text-gray-300"
    >
      images <span class="text-red-500">*</span>
    </label>

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

    <div class="space-y-4">
      <div
        v-for="(img, idx) in previewImages"
        :key="idx"
        class="group p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
      >
        <div class="flex items-center justify-between gap-2 mb-2">
          <div
            class="flex-1 min-w-0 flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded px-2 py-2 text-xs font-mono text-gray-400"
          >
            <span class="truncate select-all flex-1" :title="img">
              {{ truncateUrl(img) }}
            </span>

            <div
              class="flex items-center gap-1 pl-2 border-l border-gray-700 ml-2 shrink-0"
            >
              <button
                @click="triggerReplace(idx)"
                class="text-gray-500 hover:text-blue-400 p-1 rounded hover:bg-gray-800"
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
                @click="previewImages.length > 1 && emit('remove-image', idx)"
                :disabled="previewImages.length <= 1"
                class="p-1 rounded transition-colors"
                :class="
                  previewImages.length <= 1
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-500 hover:text-red-400 hover:bg-gray-800'
                "
                :title="
                  previewImages.length <= 1
                    ? 'Must have at least 1 image'
                    : 'Remove image'
                "
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p class="text-[10px] text-gray-500 mb-2 px-1 truncate">
          Hint: Click folder to replace
        </p>

        <div
          class="w-20 h-20 bg-gray-900 rounded-md border border-gray-700 overflow-hidden relative group-hover:shadow-lg transition-all"
        >
          <img :src="img" class="w-full h-full object-contain" />
        </div>
      </div>
    </div>

    <button
      @click="triggerAdd"
      class="mt-4 flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-all shadow-lg hover:shadow-blue-900/30"
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
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
      Add Item
    </button>
  </div>
</template>
