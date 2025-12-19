<script setup lang="ts">
defineProps<{ title: string; color: string; isOpen: boolean }>();
defineEmits(["toggle"]);
</script>

<template>
  <div
    class="mb-4 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
  >
    <button
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
    >
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-wide"
          :class="`text-${color}-300`"
          >{{ title }}</span
        >
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <Transition name="expand">
      <div v-show="isOpen" class="p-4 bg-gray-900/50 border-t border-gray-700">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 1000px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
