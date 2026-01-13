<script setup lang="ts">
const { status, progress, hasLogMessage } = useLogger();
</script>

<template>
  <Transition name="expand">
    <div v-if="hasLogMessage" class="status-bar-wrapper">
      <div class="flex items-center gap-3">
        <Icon
          v-if="status.type === 'loading'"
          name="lucide:loader-2"
          class="animate-spin"
        />
        <span class="text-xs uppercase font-black">{{ status.message }}</span>
      </div>
      <div
        :style="{ width: `${progress}%` }"
        class="h-1 bg-blue-500 mt-2 transition-all"
      ></div>
    </div>
  </Transition>
</template>

<style scoped></style>
