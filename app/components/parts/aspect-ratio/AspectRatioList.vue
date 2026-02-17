<script setup lang="ts">
const { ratioList, isActiveRatio, applyRatio, getButtonStyle } = useRatio();
</script>

<template>
  <div class="space-y-5">
    <div>
      <label class="block text-sm font-medium mb-3 text-gray-300"
        >Aspect Ratio</label
      >

      <div
        class="flex flex-wrap gap-2 bg-gray-700/30 p-2 rounded-lg border border-gray-700/50 justify-center"
      >
        <div
          v-for="r in ratioList"
          :key="r.label"
          class="flex flex-col items-center gap-2 group cursor-pointer"
          @click="applyRatio(r.w, r.h)"
        >
          <div class="h-8 w-8 flex items-end justify-center">
            <div
              class="border-2 rounded-[2px] transition-all shadow-sm duration-200"
              :class="
                isActiveRatio(r.w, r.h)
                  ? 'bg-blue-600 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]'
                  : 'bg-gray-600 border-gray-500 group-hover:bg-gray-500 group-hover:border-gray-400'
              "
              :style="getButtonStyle(r.w, r.h)"
            ></div>
          </div>

          <span
            class="text-[10px] font-mono transition-colors duration-200"
            :class="
              isActiveRatio(r.w, r.h)
                ? 'text-blue-400 font-bold'
                : 'text-gray-400 group-hover:text-gray-300'
            "
          >
            {{ r.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
