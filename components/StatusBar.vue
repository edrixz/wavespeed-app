<script setup lang="ts">
import type { LogStatus } from "~/types";

const loggerStatus = defineModel<LogStatus>({ required: true });
</script>

<template>
  <div
    class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3 shadow-sm min-h-[50px] transition-colors duration-300"
    :class="{
      'border-blue-500/50 bg-blue-900/10': loggerStatus.type === 'loading',
      'border-green-500/50 bg-green-900/10': loggerStatus.type === 'success',
      'border-red-500/50 bg-red-900/10': loggerStatus.type === 'error',
    }"
  >
    <div class="flex-shrink-0">
      <div
        v-if="loggerStatus.type === 'loading'"
        class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"
      ></div>

      <svg
        v-else-if="loggerStatus.type === 'success'"
        class="w-5 h-5 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>

      <svg
        v-else-if="loggerStatus.type === 'error'"
        class="w-5 h-5 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>

      <svg
        v-else
        class="w-5 h-5 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </div>

    <div class="flex-1 overflow-hidden relative h-6">
      <Transition name="slide-up" mode="out-in">
        <p
          :key="loggerStatus.message"
          class="text-sm font-medium truncate absolute w-full"
          :class="{
            'text-blue-200': loggerStatus.type === 'loading',
            'text-green-300': loggerStatus.type === 'success',
            'text-red-300': loggerStatus.type === 'error',
            'text-gray-300': loggerStatus.type === 'info',
          }"
        >
          {{ loggerStatus.message }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Animation trượt chữ lên khi đổi status */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
