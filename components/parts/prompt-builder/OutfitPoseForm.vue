<script setup lang="ts">
import { usePromptBuilder } from "~/composables";
import { poseListItem } from "~/consts";
import type { OutfitData, PoseData } from "~/types";
const props = defineProps<{ outfit?: OutfitData; pose?: PoseData }>();
const { updateAttr, isActive } = usePromptBuilder();
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="lbl">Main Clothing & Fabric</label>
      <input
        v-model="outfit!.mainClothing"
        class="inp mb-2"
        placeholder="e.g. Silk summer dress"
      />
      <input
        v-model="outfit!.fabric"
        class="inp"
        placeholder="e.g. Transparent clear water material"
      />
    </div>

    <div v-for="group in poseListItem" :key="group.name">
      <h5 class="category-title border-emerald-600">{{ group.name }}</h5>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in group.items"
          :key="item.value"
          @click="updateAttr(pose, 'action', item.value, 'multi')"
          class="btn-chip"
          :class="
            isActive(pose, 'action', item.value) ? 'active-emerald' : 'inactive'
          "
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
