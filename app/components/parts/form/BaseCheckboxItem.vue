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
    <input type="checkbox" v-model="modelValue" class="w-4 h-4 text-blue-500 bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/20 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 transition-colors cursor-pointer" />
  </label>
</template>
