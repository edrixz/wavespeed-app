// app/components/base/form/BaseCheckboxItem.vue
<script lang="ts" setup>
defineProps<{
  label: string;
}>();

const modelValue = defineModel<boolean>({ required: true });
</script>

<template>
  <label
    class="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
  >
    <span
      class="text-xs text-gray-400 group-hover:text-white transition-colors"
    >
      {{ label }}
    </span>
    <input
      type="checkbox"
      v-model="modelValue"
      class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
    />
  </label>
</template>
