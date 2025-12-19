<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { bodyTypeListItem } from "~/consts";
import type { SubjectData } from "~/types";
const props = defineProps<{ modelValue?: SubjectData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-6">
      <label class="lbl">Gender</label>
      <div class="flex bg-gray-800 border border-gray-600 rounded p-1 h-[34px]">
        <div
          v-for="g in ['Female', 'Male']"
          :key="g"
          @click="modelValue!.gender = g"
          class="flex-1 flex items-center justify-center rounded cursor-pointer transition-all text-[10px] font-bold uppercase"
          :class="
            modelValue!.gender === g
              ? g === 'Female'
                ? 'bg-pink-600 text-white'
                : 'bg-blue-600 text-white'
              : 'text-gray-500 hover:bg-gray-700'
          "
        >
          {{ g }}
        </div>
      </div>
    </div>

    <div class="col-span-6">
      <label class="lbl">Age</label>
      <div class="relative">
        <input
          v-model="modelValue!.age"
          type="number"
          class="inp"
          placeholder="20"
        />
        <span
          class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 font-bold"
          >y.o</span
        >
      </div>
    </div>

    <div class="col-span-12">
      <label class="lbl">Body Type & Skin Tone</label>
      <div
        class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar"
      >
        <div
          v-for="group in bodyTypeListItem"
          :key="group.name"
          class="flex gap-2"
        >
          <button
            v-for="item in group.items"
            :key="item.value"
            @click="updateAttr(modelValue, 'bodyType', item.value, 'single')"
            class="btn-chip"
            :class="
              isActive(modelValue, 'bodyType', item.value)
                ? 'active-blue'
                : 'inactive'
            "
          >
            {{ item.label }}
          </button>
        </div>
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
