<script setup lang="ts">
import {
  outfitDescriptionListItem,
  materialsListItem,
  layeringListItem,
  fitListItem,
  detailsListItem,
  accessoriesListItem,
} from "~/consts";
import type { OutfitData } from "~/types";

const props = defineProps<{ modelValue?: OutfitData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Description -->
    <div>
      <h5 class="category-title border-purple-600">Description</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.description"
        type="outfit"
        field="description"
        :options="outfitDescriptionListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Materials -->
    <div>
      <h5 class="category-title border-purple-600">Materials</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.materials"
        type="outfit"
        field="materials"
        :options="materialsListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Layering -->
    <div>
      <h5 class="category-title border-purple-600">Layering</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.layering"
        type="outfit"
        field="layering"
        :options="layeringListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Fit -->
    <div>
      <h5 class="category-title border-purple-600">Fit</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.fit"
        type="outfit"
        field="fit"
        :options="fitListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Details -->
    <div>
      <h5 class="category-title border-purple-600">Details</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.details"
        type="outfit"
        field="details"
        :options="detailsListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Accessories -->
    <div>
      <h5 class="category-title border-purple-600">Accessories</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.accessories"
        type="outfit"
        field="accessories"
        :options="accessoriesListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>
  </div>
</template>

<style scoped></style>
