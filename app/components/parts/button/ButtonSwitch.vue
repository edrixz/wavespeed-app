<script lang="ts" setup>
defineProps<{ isEnable: boolean }>();
defineEmits(["toggle"]);
</script>

<template>
  <div
    class="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-full w-fit cursor-pointer select-none"
    @click="$emit('toggle')"
  >
    <div
      class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-full shadow-lg shadow-blue-900/50 transition-all duration-300 ease-out"
      :class="isEnable ? 'translate-x-full left-1' : 'translate-x-0 left-1'"
    ></div>

    <div
      class="relative z-10 px-4 py-1.5 text-xs font-bold transition-colors duration-300 text-center min-w-[3rem]"
      :class="!isEnable ? 'text-white' : 'text-gray-400 hover:text-gray-200'"
    >
      <slot name="opt1" />
    </div>

    <div
      class="relative z-10 px-4 py-1.5 text-xs font-bold transition-colors duration-300 text-center min-w-[3rem]"
      :class="isEnable ? 'text-white' : 'text-gray-400 hover:text-gray-200'"
    >
      <slot name="opt2" />
    </div>
  </div>
</template>

<style scoped></style>
