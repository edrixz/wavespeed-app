<script setup lang="ts">
import { useRatio } from "~/composables/common/use-ratio";

const { ratioList, applyRatio, isActiveRatio, getButtonStyle } = useRatio();
</script>

<template>
  <div class="space-y-3">
    <span class="text-xs font-medium text-[#C4C7C5] ml-1">Aspect Ratio</span>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="ratio in ratioList"
        :key="ratio.label"
        @click="applyRatio(ratio.w, ratio.h)"
        class="group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-xs font-medium"
        :class="[
          isActiveRatio(ratio.w, ratio.h)
            ? 'bg-[#A8C7FA] border-[#A8C7FA] text-[#041E49]' /* Active: Style Code Wiki */
            : 'bg-transparent border-[#444746] text-[#C4C7C5] hover:bg-[#444746]/30 hover:border-[#8E918F]' /* Inactive */,
        ]"
      >
        <span
          class="block border rounded-[1px] transition-colors"
          :class="
            isActiveRatio(ratio.w, ratio.h)
              ? 'border-[#041E49]'
              : 'border-[#C4C7C5]'
          "
          :style="getButtonStyle(ratio.w, ratio.h)"
        ></span>

        {{ ratio.label }}
      </button>
    </div>
  </div>
</template>
