<script setup lang="ts">
definePageMeta({ layout: "default" });
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-28 lg:pb-8">
    <!-- Page title -->
    <div>
      <h1 class="text-2xl font-black tracking-tight">Settings</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Manage your account preferences and resources.
      </p>
    </div>

    <!-- Subject management section -->
    <div
      class="bg-white dark:bg-[#0d0d0d] p-5 lg:p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm"
    >
      <SettingsSubjectManager />
    </div>
  </div>
</template>

<style scoped></style>
