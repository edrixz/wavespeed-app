<script setup lang="ts">
import { hairDetailListItem } from "~/consts";
import type { HairData } from "~/types";
const props = defineProps<{ modelValue?: HairData }>();
</script>

<template>
  <div class="space-y-5">
    <div>
      <h5 class="category-title border-amber-600">Length & Color</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.length"
        type="hair"
        field="length"
        :options="hairDetailListItem.lengths"
        mode="single"
        active-class="active-amber"
      />
    </div>

    <div>
      <h5 class="category-title border-amber-600">Style</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.style"
        type="hair"
        field="style"
        :options="hairDetailListItem.styleGroups"
        mode="multi"
        active-class="active-amber"
      />
    </div>
  </div>
</template>

<style scoped></style>
