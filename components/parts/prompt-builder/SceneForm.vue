<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { sceneData } from "~/consts";
import type { Scene } from "~/types";
const props = defineProps<{ modelValue?: Scene }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h5 class="category-title border-indigo-600">Environment</h5>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="item in sceneData.backgrounds[0].items"
          :key="item.value"
          @click="
            updateAttr(modelValue!.environment, 'location', item.value, 'multi')
          "
          class="btn-chip"
          :class="
            isActive(modelValue!.environment, 'location', item.value)
              ? 'active-indigo'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
      <label class="lbl">Lighting Atmosphere</label>
      <input
        v-model="modelValue!.environment!.lighting"
        class="inp"
        placeholder="Cinematic, volumetric lighting..."
      />
    </div>

    <div>
      <h5 class="category-title border-indigo-600">Camera & Viewpoint</h5>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="item in sceneData.viewpoints"
          :key="item.value"
          @click="
            updateAttr(modelValue!.tech, 'viewpoint', item.value, 'single')
          "
          class="btn-chip"
          :class="
            isActive(modelValue!.tech, 'viewpoint', item.value)
              ? 'active-indigo'
              : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
      <input
        v-model="modelValue!.tech!.quality"
        class="inp text-gray-500 italic"
        placeholder="High quality, 8k, detailed..."
      />
    </div>
  </div>
</template>

<style scoped></style>
