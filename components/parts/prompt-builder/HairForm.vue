<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { hairDetailListItem } from "~/consts";
import type { HairData } from "~/types";
const props = defineProps<{ modelValue?: HairData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-5">
    <div>
      <h5 class="category-title border-amber-600">Length & Color</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in hairDetailListItem.lengths"
          :key="item.value"
          @click="updateAttr(modelValue, 'length', item.value, 'single')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'length', item.value)
              ? 'active-amber'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div v-for="group in hairDetailListItem.styleGroups" :key="group.name">
      <h6 class="text-[9px] text-gray-500 uppercase mb-2 ml-2">
        {{ group.name }}
      </h6>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="style in group.items"
          :key="style"
          @click="updateAttr(modelValue, 'style', style, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'style', style) ? 'active-amber' : 'inactive'
          "
        >
          {{ style }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style chung cho nút bấm dạng thẻ (Chip) */
.btn-chip {
  @apply px-3 py-1.5 rounded border text-[10px] font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 text-left;
}
/* Trạng thái chưa chọn */
.inactive {
  @apply bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200;
}
/* Các màu Active khác nhau để phân biệt từng mục */
.active-purple {
  @apply bg-purple-600 border-purple-500 text-white shadow-md ring-1 ring-purple-400;
}
.active-blue {
  @apply bg-blue-600 border-blue-500 text-white shadow-md ring-1 ring-blue-400;
}
.active-cyan {
  @apply bg-cyan-600 border-cyan-500 text-white shadow-md ring-1 ring-cyan-400;
}
.active-pink {
  @apply bg-pink-600 border-pink-500 text-white shadow-md ring-1 ring-pink-400;
}
.active-orange {
  @apply bg-orange-600 border-orange-500 text-white shadow-md ring-1 ring-orange-400;
}
.active-amber {
  @apply bg-amber-600 border-amber-500 text-white shadow-md ring-1 ring-amber-400;
}
.active-emerald {
  @apply bg-emerald-600 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400;
}
.active-indigo {
  @apply bg-indigo-600 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400;
}
</style>
