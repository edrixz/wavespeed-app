<script setup lang="ts">
const props = defineProps<{ modelValue: any }>(); // Nhận currentSubject

const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const toggleRefImage = (imgIdx: number) => {
  // Nếu bấm vào ảnh đã chọn thì bỏ chọn (-1), nếu chưa thì chọn ảnh đó
  props.modelValue.refImageIdx =
    props.modelValue.refImageIdx === imgIdx ? -1 : imgIdx;
};
</script>

<template>
  <div
    class="mb-5 bg-black/30 p-4 rounded-xl border border-gray-700/50 backdrop-blur-md"
  >
    <label
      class="text-[10px] text-gray-400 font-bold uppercase mb-3 flex justify-between items-center"
    >
      <span class="flex items-center gap-1.5">
        <svg
          class="w-3 h-3 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Link Face ID
      </span>
      <span
        v-if="modelValue.refImageIdx !== -1"
        class="text-blue-400 text-[9px] font-black animate-pulse bg-blue-500/10 px-2 py-0.5 rounded"
      >
        LINKED TO IMAGE #{{ modelValue.refImageIdx + 1 }}
      </span>
    </label>

    <div class="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
      <div
        @click="modelValue.refImageIdx = -1"
        class="h-14 w-14 rounded-lg flex-shrink-0 flex items-center justify-center cursor-pointer border-2 transition-all text-[10px] font-bold"
        :class="
          modelValue.refImageIdx === -1
            ? 'bg-gray-700 border-blue-500 text-blue-400'
            : 'bg-gray-800 border-gray-700 text-gray-600 hover:border-gray-500'
        "
      >
        NONE
      </div>

      <div
        v-for="(img, idx) in images"
        :key="idx"
        @click="toggleRefImage(idx)"
        class="h-14 w-14 rounded-lg flex-shrink-0 cursor-pointer border-2 relative overflow-hidden transition-all group"
        :class="
          modelValue.refImageIdx === idx
            ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105'
            : 'border-gray-700 opacity-50 hover:opacity-100'
        "
      >
        <img :src="img.url" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          v-if="modelValue.refImageIdx !== idx"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
            />
          </svg>
        </div>
        <div
          class="absolute top-0 right-0 bg-blue-600 text-white text-[8px] px-1.5 font-black rounded-bl shadow-lg"
        >
          #{{ idx + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>
