<script setup lang="ts">
/**
 * Bottom content area for the preset card.
 */
defineProps<{
  title: string;
  size?: string;
  usageCount?: number;
}>();
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20 z-30 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/50 to-transparent">
    <!-- Main Title & Verification -->
    <div class="flex items-center gap-1.5 mb-2.5">
      <h4
        class="text-white font-bold text-lg leading-tight truncate"
        :title="title"
      >
        {{ title }}
      </h4>
      <Icon
        name="lucide:badge-check"
        size="14"
        class="text-blue-400 shrink-0"
      />
    </div>

    <!-- Tags area -->
    <div class="flex items-center gap-1.5 flex-wrap mt-1">
      <span
        v-if="size"
        class="flex items-center gap-1 text-[9px] text-white/90 px-2.5 py-1 bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-full border border-white/10 shadow-sm"
      >
        <Icon name="lucide:scaling" size="10" class="opacity-70" />
        {{ size }}
      </span>
      
      <span
        v-if="usageCount !== null && usageCount !== undefined"
        class="flex items-center gap-1 text-[9px] text-white/90 px-2.5 py-1 bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-full border border-white/10 shadow-sm"
         title="Usage Count"
      >
        <Icon name="lucide:flame" size="10" class="opacity-100 text-orange-400" />
        <span class="font-bold">{{ usageCount }}</span>
      </span>
      <slot name="tags" />
    </div>

    <!-- Rating Slot -->
    <div class="pt-3 mt-3 w-full border-t border-white/10 flex items-center justify-between">
      <slot name="rating" />
    </div>
  </div>
</template>
