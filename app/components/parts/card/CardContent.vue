<script setup lang="ts">
/**
 * Bottom content area for the preset card.
 */
defineProps<{
  title: string;
  size?: string;
}>();
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 p-5 z-30 flex flex-col justify-end">

    <!-- Main Title & Verification -->
    <div class="flex items-center gap-1.5 mb-2.5">
      <h4
        class="text-white font-bold text-lg leading-tight truncate"
        :title="title"
      >
        {{ title }}
      </h4>
      <Icon name="lucide:badge-check" size="14" class="text-blue-400 shrink-0" />
    </div>

    <!-- Tags area -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <span
        v-if="size"
        class="flex items-center gap-1 text-[9px] text-white/90 px-2.5 py-1 bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-full border border-white/10"
      >
        <Icon name="lucide:scaling" size="10" class="opacity-70" />
        {{ size }}
      </span>
      <slot name="tags" />
    </div>
  </div>
</template>
