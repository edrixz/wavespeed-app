<script setup lang="ts">
import { faceDetailListItem } from "~/consts";
import type { FaceData } from "~/types";
const props = defineProps<{ modelValue?: FaceData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Shape -->
    <div>
      <h5 class="category-title border-purple-600">Shape</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.shape"
        :options="faceDetailListItem.shapes.map((i) => i.value)"
        mode="single"
        active-class="active-purple"
      />
    </div>

    <!-- Expression -->
    <div>
      <h5 class="category-title border-purple-600">Expression</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.expression"
        :options="faceDetailListItem.expression.map((i) => i.value)"
        mode="single"
        active-class="active-purple"
      />
    </div>

    <!-- Eyes -->
    <div>
      <h5 class="category-title border-purple-600">Eyes</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.eyes"
        :options="faceDetailListItem.eyes.map((i) => i.value)"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Makeup -->
    <div>
      <h5 class="category-title border-purple-600">Makeup</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.makeup"
        :options="faceDetailListItem.makeup.map((i) => i.value)"
        mode="multi"
        active-class="active-pink"
      />
    </div>
  </div>
</template>

<style scoped></style>
