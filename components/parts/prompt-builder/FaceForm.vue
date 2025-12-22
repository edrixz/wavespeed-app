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
        type="face"
        field="shape"
        :options="faceDetailListItem.shapes"
        mode="single"
        active-class="active-purple"
      />
    </div>

    <!-- Expression -->
    <div>
      <h5 class="category-title border-purple-600">Expression</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.expression"
        type="face"
        field="expression"
        :options="faceDetailListItem.expression"
        mode="single"
        active-class="active-purple"
      />
    </div>

    <!-- Eyes -->
    <div>
      <h5 class="category-title border-purple-600">Eyes</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.eyes"
        type="face"
        field="eyes"
        :options="faceDetailListItem.eyes"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Makeup -->
    <div>
      <h5 class="category-title border-purple-600">Makeup</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.makeup"
        type="face"
        field="makeup"
        :options="faceDetailListItem.makeup"
        mode="multi"
        active-class="active-pink"
      />
    </div>
  </div>
</template>

<style scoped></style>
