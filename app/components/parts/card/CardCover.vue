<script setup lang="ts">
/**
 * Handles the background and gradient for the Preset Card.
 */
defineProps<{
  thumbnail?: string;
  isVisible: boolean;
}>();
</script>

<template>
  <div
    class="absolute inset-0 transition-all duration-300 bg-neutral-100 dark:bg-neutral-900"
  >
    <img
      v-if="thumbnail"
      :src="thumbnail"
      class="w-full h-full object-cover transition-all duration-300 ease-out will-change-[filter,transform]"
      :class="[
        isVisible
          ? 'blur-0 scale-100 grayscale-0'
          : 'blur-xl scale-[1.05] grayscale-[0.5]'
      ]"
    />
    <div
      v-else
      class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black"
    ></div>

    <!-- Soft Overlay if not visible -->
    <div
      class="absolute inset-0 bg-white/20 dark:bg-black/20 z-10 transition-opacity duration-300 ease-out"
      :class="isVisible ? 'opacity-0' : 'opacity-100'"
    ></div>

    <!-- Bottom gradient to ensure text readability -->
    <div
      class="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/30 to-transparent z-20 pointer-events-none"
    ></div>

    <!-- Hover effect gradient -->
    <div
      class="absolute inset-0 bg-linear-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
    ></div>
  </div>
</template>
