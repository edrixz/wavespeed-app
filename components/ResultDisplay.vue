<script setup lang="ts">
defineProps<{
  image: string | null;
  loading: boolean;
}>();
</script>

<template>
  <div
    class="flex-1 bg-gray-800 rounded-xl border border-gray-700 p-4 min-h-[400px] flex items-center justify-center relative"
  >
    <img
      v-if="image"
      :src="image"
      class="max-w-full max-h-[600px] object-contain rounded shadow-2xl"
    />

    <div v-else-if="loading" class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
      ></div>
      <p class="text-gray-400 animate-pulse">AI đang xử lý...</p>
    </div>

    <div v-else class="text-gray-500 text-center">
      <p class="text-4xl mb-2">🎨</p>
      <p>Kết quả sẽ hiển thị tại đây</p>
    </div>

    <a
      v-if="image"
      :href="image"
      download="generated-image.png"
      class="absolute bottom-4 right-4 bg-gray-900/80 hover:bg-black text-white px-4 py-2 rounded transition-opacity"
    >
      Download
    </a>
  </div>
</template>
