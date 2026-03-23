<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    maxStars?: number;
    size?: number;
  }>(),
  {
    modelValue: 0,
    maxStars: 5,
    size: 16,
  }
);

const emit = defineEmits(["update:modelValue"]);

const hoverValue = ref(0);

const handleMouseEnter = (index: number) => {
  hoverValue.value = index;
};

const handleMouseLeave = () => {
  hoverValue.value = 0;
};

const setRating = (index: number) => {
  emit("update:modelValue", index);
};
</script>

<template>
  <div
    class="flex items-center gap-0.5"
    @mouseleave="handleMouseLeave"
  >
    <button
      v-for="i in maxStars"
      :key="i"
      type="button"
      @click.stop="setRating(i)"
      @mouseenter="handleMouseEnter(i)"
      class="p-0.5 text-neutral-400 dark:text-gray-500 hover:scale-110 transition-transform focus:outline-none"
      :class="{
        'text-yellow-400 dark:text-yellow-500': i <= (hoverValue || modelValue)
      }"
    >
      <Icon
        :name="i <= (hoverValue || modelValue) ? 'lucide:star' : 'lucide:star'"
        :class="{ 'fill-current': i <= (hoverValue || modelValue) }"
        :size="size"
      />
    </button>
  </div>
</template>
