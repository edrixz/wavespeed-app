<script setup lang="ts">
import {
  hairDescriptionListItem,
  hairColorListItem,
  hairLengthListItem,
  hairTextureListItem,
} from "~/consts/list-items/hair";
import type { HairData } from "~/types/entities";
const props = defineProps<{ modelValue?: HairData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Description -->
    <div>
      <h5 class="category-title border-amber-600">Description</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.description"
        type="hair"
        field="description"
        :options="hairDescriptionListItem"
        mode="multi"
        active-class="active-amber"
      />
    </div>

    <!-- Color -->
    <div>
      <h5 class="category-title border-amber-600">Color</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.color"
        type="hair"
        field="color"
        :options="hairColorListItem"
        mode="multi"
        active-class="active-amber"
      />
    </div>

    <!-- Length -->
    <div>
      <h5 class="category-title border-amber-600">Length</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.length"
        type="hair"
        field="length"
        :options="hairLengthListItem"
        mode="single"
        active-class="active-amber"
      />
    </div>

    <!-- Texture -->
    <div>
      <h5 class="category-title border-amber-600">Texture</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.texture"
        type="hair"
        field="texture"
        :options="hairTextureListItem"
        mode="multi"
        active-class="active-amber"
      />
    </div>
  </div>
</template>

<style scoped></style>
