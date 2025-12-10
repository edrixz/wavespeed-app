<script setup lang="ts">
import type { LogEntry } from "~/types/log-entry";

defineProps<{ logs: LogEntry[] }>();
</script>

<template>
  <div
    class="h-64 bg-[#0d1117] rounded-xl border border-gray-800 px-4 font-mono text-xs overflow-y-auto shadow-inner"
  >
    <div
      class="text-gray-500 font-bold uppercase tracking-wider sticky top-0 bg-[#0d1117] w-full py-4 z-10"
    >
      System Logs
    </div>
    <div class="">
      <div
        v-for="(log, i) in logs"
        :key="i"
        :class="{
          'text-green-400': log.type === 'success',
          'text-red-400': log.type === 'error',
          'text-blue-300': log.type === 'info',
        }"
        class="mb-1.5 border-l-2 pl-2 border-gray-800 hover:bg-gray-900/50 transition-colors"
      >
        <span class="opacity-50 text-gray-500">[{{ log.time }}]</span>
        <span class="ml-1">{{ log.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="text-gray-600 italic">
        Waiting for actions...
      </div>
    </div>
  </div>
</template>

<style scoped></style>
