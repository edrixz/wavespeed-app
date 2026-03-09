<script setup lang="ts">
/**
 * Wrapper component for the Preset Card.
 * Shapes the card and handles base interactive effects.
 */
</script>

<template>
  <div
    class="relative h-full w-full rounded-[32px] overflow-hidden group cursor-pointer border border-black/10 dark:border-white/5 transition-all duration-500 hover:border-blue-500/40"
  >
    <slot />
  </div>
</template>
