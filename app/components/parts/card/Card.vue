<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardBase from "./CardBase.vue";
import CardCover from "./CardCover.vue";
import CardBadge from "./CardBadge.vue";
import CardContent from "./CardContent.vue";
import PartsRatingStarRating from "../rating/StarRating.vue";

const props = defineProps<{
  item: any;
  isVisible: boolean;
}>();
const emit = defineEmits(["select", "toggle-visibility", "save-rating"]);

// Rating state
const currentRating = ref(props.item.rating || 0);

// Calculate if rating has changed from saved state
const isRatingChanged = computed(() => {
  const originalRating = props.item.rating || 0;
  return currentRating.value !== originalRating;
});

// Reset internal state if props update from DB
watch(
  () => props.item.rating,
  (newVal) => {
    currentRating.value = newVal || 0;
  }
);

const handleSaveRating = () => {
  emit("save-rating", { id: props.item.id, rating: currentRating.value });
};

const handleCancelRating = () => {
  currentRating.value = props.item.rating || 0;
};
</script>

<template>
  <CardBase @click="$emit('select', item)">
    <CardCover :thumbnail="item.thumbnail" :is-visible="isVisible" />

    <CardBadge label="Preset" />

    <!-- Action buttons for saving/canceling rating change -->
    <div
      v-if="isRatingChanged"
      class="absolute top-3 right-3 z-40 flex items-center gap-1.5 bg-black/60 p-1 rounded-lg backdrop-blur-md shadow-lg border border-white/10"
      @click.stop
    >
      <button
        @click="handleCancelRating"
        class="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-rose-500 text-white transition-all shadow-sm"
        title="Cancel"
      >
        <Icon name="lucide:x" size="14" />
      </button>
      <button
        @click="handleSaveRating"
        class="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-emerald-500 text-white transition-all shadow-sm"
        title="Save Rating"
      >
        <Icon name="lucide:check" size="14" />
      </button>
    </div>

    <CardContent :title="item.title" :size="item.size" :usage-count="item.usage_count">
      <template #rating>
        <div @click.stop class="bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
          <PartsRatingStarRating v-model="currentRating" :size="12" />
        </div>
      </template>
    </CardContent>
  </CardBase>
</template>
