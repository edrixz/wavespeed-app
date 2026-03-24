<script setup lang="ts">
import { useRatio } from "~/composables/common/use-ratio";
import { type Ref } from "vue";

const width = defineModel<number>("width");
const height = defineModel<number>("height");

const { ratioList, applyRatio, isActiveRatio, getButtonStyle } = useRatio(
  width.value !== undefined ? (width as Ref<number>) : undefined,
  height.value !== undefined ? (height as Ref<number>) : undefined
);
</script>

<template>
  <div class="space-y-3">
    <span class="text-xs font-medium text-gray-500 dark:text-[#C4C7C5] ml-1"
      >Aspect Ratio</span
    >

    <div class="flex flex-wrap gap-2">
      <button
        v-for="ratio in ratioList"
        :key="ratio.label"
        @click="applyRatio(ratio.w, ratio.h)"
        class="group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-xs font-medium"
        :class="[
          isActiveRatio(ratio.w, ratio.h)
            ? 'bg-blue-600 border-blue-600 text-white dark:bg-[#A8C7FA] dark:border-[#A8C7FA] dark:text-[#041E49]' /* Active: Style Code Wiki */
            : 'bg-transparent border-black/10 text-gray-600 hover:bg-black/5 hover:border-black/20 dark:border-[#444746] dark:text-[#C4C7C5] dark:hover:bg-[#444746]/30 dark:hover:border-[#8E918F]' /* Inactive */,
        ]"
      >
        <span
          class="block border rounded-[1px] transition-colors"
          :class="
            isActiveRatio(ratio.w, ratio.h)
              ? 'border-white dark:border-[#041E49]'
              : 'border-gray-400 dark:border-[#C4C7C5]'
          "
          :style="getButtonStyle(ratio.w, ratio.h)"
        ></span>

        {{ ratio.label }}
      </button>
    </div>
  </div>
</template>
