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
      class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
    >
      {{ label }}
    </span>
    <input
      type="checkbox"
      v-model="modelValue"
      class="w-4 h-4 text-blue-500 bg-black/5 dark:bg-gray-700 border-black/10 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors"
    />
  </label>
</template>
