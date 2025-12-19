<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { sceneData } from "~/consts";
import type { Scene } from "~/types";
const props = defineProps<{ modelValue?: Scene }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h5 class="category-title border-indigo-600">Environment</h5>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="item in sceneData.backgrounds[0].items"
          :key="item.value"
          @click="
            updateAttr(modelValue!.environment, 'location', item.value, 'multi')
          "
          class="btn-chip"
          :class="
            isActive(modelValue!.environment, 'location', item.value)
              ? 'active-indigo'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
      <label class="lbl">Lighting Atmosphere</label>
      <input
        v-model="modelValue!.environment!.lighting"
        class="inp"
        placeholder="Cinematic, volumetric lighting..."
      />
    </div>

    <div>
      <h5 class="category-title border-indigo-600">Camera & Viewpoint</h5>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="item in sceneData.viewpoints"
          :key="item.value"
          @click="
            updateAttr(modelValue!.tech, 'viewpoint', item.value, 'single')
          "
          class="btn-chip"
          :class="
            isActive(modelValue!.tech, 'viewpoint', item.value)
              ? 'active-indigo'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
      <input
        v-model="modelValue!.tech!.quality"
        class="inp text-gray-500 italic"
        placeholder="High quality, 8k, detailed..."
      />
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
.lbl {
  @apply block text-[10px] text-gray-500 mb-1 font-semibold uppercase tracking-wide;
}
.inp {
  @apply w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-blue-500 transition-all;
}
.inp-area {
  @apply w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-blue-500 resize-none transition-all;
}
</style>
