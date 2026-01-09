<script lang="ts" setup>
defineProps<{ isEnable: boolean }>();
defineEmits(["toggle"]);
</script>

<template>
  <div class="bg-gray-700 p-1 rounded-lg flex text-xs font-bold">
    <button
      @click="$emit('toggle')"
      class="px-3 py-1 rounded transition-all"
      :class="
        !isEnable
          ? 'bg-blue-600 text-white shadow'
          : 'text-gray-400 hover:text-gray-200'
      "
    >
      <slot name="opt1" />
    </button>
    <button
      @click="$emit('toggle')"
      class="px-3 py-1 rounded transition-all"
      :class="
        isEnable
          ? 'bg-blue-600 text-white shadow'
          : 'text-gray-400 hover:text-gray-200'
      "
    >
      <slot name="opt2" />
    </button>
  </div>
</template>

<style scoped></style>
