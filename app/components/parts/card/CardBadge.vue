<script setup lang="ts">
/**
 * Top-left badge for the preset card. Use for categories or labels (e.g., '✨ Preset').
 */
defineProps<{
  label: string;
  icon?: string;
}>();
</script>

<template>
  <div
    class="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10"
  >
    <Icon v-if="icon" :name="icon" size="10" class="text-white" />
    <span class="text-[10px] font-medium text-white tracking-wide">
      {{ label }}
    </span>
  </div>
</template>
