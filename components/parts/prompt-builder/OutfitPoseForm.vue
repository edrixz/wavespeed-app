<script setup lang="ts">
import { poseListItem } from "~/consts";
import type { OutfitData, PoseData } from "~/types";
const props = defineProps<{ outfit?: OutfitData; pose?: PoseData }>();
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
      <PartsPromptBuilderTagSelector
        v-model="pose!.action"
        :options="group.items.map((i) => i.value)"
        mode="multi"
        active-class="active-emerald"
      />
    </div>
  </div>
</template>

<style scoped></style>
