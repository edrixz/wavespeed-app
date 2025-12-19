<script lang="ts" setup>
defineProps<{ isBuilderMode: boolean }>();
defineEmits(["toggleBuilder"]);
</script>

<template>
  <div class="bg-gray-700 p-1 rounded-lg flex text-xs font-bold">
    <button
      @click="$emit('toggleBuilder')"
      class="px-3 py-1 rounded transition-all"
      :class="
        !isBuilderMode
          ? 'bg-gray-600 text-white shadow'
          : 'text-gray-400 hover:text-gray-200'
      "
    >
      Simple
    </button>
    <button
      @click="$emit('toggleBuilder')"
      class="px-3 py-1 rounded transition-all"
      :class="
        isBuilderMode
          ? 'bg-blue-600 text-white shadow'
          : 'text-gray-400 hover:text-gray-200'
      "
    >
      Builder
    </button>
  </div>
</template>

<style scoped></style>
