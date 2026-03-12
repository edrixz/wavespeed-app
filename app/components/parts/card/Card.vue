<script setup lang="ts">
import CardBase from "./CardBase.vue";
import CardCover from "./CardCover.vue";
import CardBadge from "./CardBadge.vue";
import CardContent from "./CardContent.vue";

const props = defineProps<{
  item: any;
  isVisible: boolean;
}>();
const emit = defineEmits(["select", "toggle-visibility"]);
</script>

<template>
  <CardBase @click="$emit('select', item)">
    <CardCover :thumbnail="item.thumbnail" :is-visible="isVisible" />

    <CardBadge label="Preset" />

    <CardContent :title="item.title" :size="item.size" />
  </CardBase>
</template>
