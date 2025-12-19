<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { hairDetailListItem } from "~/consts";
import type { HairData } from "~/types";
const props = defineProps<{ modelValue?: HairData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-5">
    <div>
      <h5 class="category-title border-amber-600">Length & Color</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in hairDetailListItem.lengths"
          :key="item.value"
          @click="updateAttr(modelValue, 'length', item.value, 'single')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'length', item.value)
              ? 'active-amber'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div v-for="group in hairDetailListItem.styleGroups" :key="group.name">
      <h6 class="text-[9px] text-gray-500 uppercase mb-2 ml-2">
        {{ group.name }}
      </h6>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="style in group.items"
          :key="style"
          @click="updateAttr(modelValue, 'style', style, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'style', style) ? 'active-amber' : 'inactive'
          "
        >
          {{ style }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
