<script setup lang="ts">
const props = defineProps<{
  previewImages: string[];
}>();

const emit = defineEmits<{
  (e: "files-selected", files: FileList): void;
  (e: "remove-image", index: number): void;
}>();

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) emit("files-selected", target.files);
  // Reset input value
  target.value = "";
};
</script>

<template>
  <div>
    <label class="block text-sm font-medium mb-2 text-gray-300">
      Reference Images
    </label>

    <input
      type="file"
      multiple
      accept="image/*"
      @change="onFileChange"
      class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer mb-3"
    />

    <div
      v-if="previewImages.length > 0"
      class="flex flex-wrap gap-3 p-2 bg-gray-900/50 rounded-lg border border-gray-700"
    >
      <div
        v-for="(img, idx) in previewImages"
        :key="idx"
        class="relative group h-20 w-20 flex-shrink-0"
      >
        <img
          :src="img"
          class="h-full w-full object-cover rounded border border-gray-600"
        />
        <button
          @click="emit('remove-image', idx)"
          class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
