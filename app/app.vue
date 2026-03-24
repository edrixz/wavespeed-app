<script setup lang="ts">
const isReady = ref(false);
onMounted(() => {
  isReady.value = true;
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-gray-100 transition-colors">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div v-if="isReady">
      <CommonToastContainer />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
