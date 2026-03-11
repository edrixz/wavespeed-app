// app/components/base/form/BaseCheckboxItem.vue
<script lang="ts" setup>
defineProps<{
  label: string;
}>();

const modelValue = defineModel<boolean>({ required: true });
</script>

<template>
  <label
    class="flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
  >
    <span
      class="text-xs text-gray-700 dark:text-gray-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
    >
      {{ label }}
    </span>
    <UCheckbox v-model="modelValue" color="info" />
  </label>
</template>
