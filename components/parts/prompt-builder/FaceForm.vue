<script setup lang="ts">
import { faceDetailListItem } from "~/consts";
import type { FaceData } from "~/types";
const props = defineProps<{ modelValue?: FaceData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Shape -->
    <div>
      <h5 class="category-title border-purple-600">Structure</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.structure"
        type="face"
        field="structure"
        :options="faceDetailListItem.shapes"
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

    <!-- Eyebrows -->
    <div>
      <h5 class="category-title border-purple-600">Eyebrows</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.eyebrows"
        type="face"
        field="eyebrows"
        :options="faceDetailListItem.eyes"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Nose -->
    <div>
      <h5 class="category-title border-purple-600">Nose</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.nose"
        type="face"
        field="nose"
        :options="faceDetailListItem.eyes"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Lips -->
    <div>
      <h5 class="category-title border-purple-600">Lips</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.lips"
        type="face"
        field="lips"
        :options="faceDetailListItem.eyes"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Skin Texture -->
    <div>
      <h5 class="category-title border-purple-600">Skin Texture</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.skinTexture"
        type="face"
        field="skinTexture"
        :options="faceDetailListItem.eyes"
        mode="multi"
        active-class="active-blue"
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
