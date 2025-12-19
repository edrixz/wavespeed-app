<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { faceDetailListItem } from "~/consts";
import type { FaceData } from "~/types";
const props = defineProps<{ modelValue?: FaceData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-5">
    <div>
      <h5 class="category-title border-purple-600">Shape & Expression</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in faceDetailListItem.shapes"
          :key="item.value"
          @click="updateAttr(modelValue, 'shape', item.value, 'single')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'shape', item.value)
              ? 'active-purple'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div>
      <h5 class="category-title border-purple-600">Eyes & Makeup</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in faceDetailListItem.eyes"
          :key="item.value"
          @click="updateAttr(modelValue, 'eyes', item.value, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'eyes', item.value)
              ? 'active-blue'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
        <div class="w-px h-6 bg-gray-700 mx-1"></div>
        <button
          v-for="item in faceDetailListItem.makeup"
          :key="item.value"
          @click="updateAttr(modelValue, 'makeup', item.value, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'makeup', item.value)
              ? 'active-pink'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-chip {
  @apply px-3 py-1.5 rounded border text-[10px] font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 text-left;
}
/* Trạng thái chưa chọn */
.inactive {
  @apply bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200;
}
.active-blue {
  @apply bg-blue-600 border-blue-500 text-white shadow-md ring-1 ring-blue-400;
}
.active-pink {
  @apply bg-pink-600 border-pink-500 text-white shadow-md ring-1 ring-pink-400;
}
.active-purple {
  @apply bg-purple-600 border-purple-500 text-white shadow-md ring-1 ring-purple-400;
}
</style>
