<script setup lang="ts">
import { sceneData } from "~/consts";
import type { Scene } from "~/types";
const props = defineProps<{ modelValue?: Scene }>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h5 class="category-title border-indigo-600">Environment</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.location"
        type="environment"
        field="location"
        :options="sceneData.backgrounds[0].items"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <div>
      <h5 class="category-title border-indigo-600">Lighting Atmosphere</h5>
      <label class="lbl"></label>
      <input
        v-model="modelValue!.environment!.lighting"
        class="inp"
        placeholder="Cinematic, volumetric lighting..."
      />
    </div>

    <div>
      <h5 class="category-title border-indigo-600">Camera & Viewpoint</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.viewpoint"
        type="tech"
        field="viewpoint"
        :options="sceneData.viewpoints"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <div>
      <h5 class="category-title border-indigo-600">Quality</h5>
      <input
        v-model="modelValue!.tech!.quality"
        class="inp text-gray-500 italic"
        placeholder="High quality, 8k, detailed..."
      />
    </div>
  </div>
</template>

<style scoped></style>
