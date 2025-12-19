<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { faceDetailListItem } from "~/consts";
import type { FaceData } from "~/types";
const props = defineProps<{ modelValue?: FaceData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-5">
    <div>
      <h5 class="category-title border-purple-600">Shape & Expression</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in faceDetailListItem.shapes"
          :key="item.value"
          @click="updateAttr(modelValue, 'shape', item.value, 'single')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'shape', item.value)
              ? 'active-purple'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div>
      <h5 class="category-title border-purple-600">Eyes & Makeup</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in faceDetailListItem.eyes"
          :key="item.value"
          @click="updateAttr(modelValue, 'eyes', item.value, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'eyes', item.value)
              ? 'active-blue'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
        <div class="w-px h-6 bg-gray-700 mx-1"></div>
        <button
          v-for="item in faceDetailListItem.makeup"
          :key="item.value"
          @click="updateAttr(modelValue, 'makeup', item.value, 'multi')"
          class="btn-chip"
          :class="
            isActive(modelValue, 'makeup', item.value)
              ? 'active-pink'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
