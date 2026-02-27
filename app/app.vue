<script setup lang="ts">
const isReady = ref(false);
onMounted(() => {
  isReady.value = true;
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div v-if="isReady">
      <CommonToastContainer />
    </div>
  </UApp>
</template>

<style>
body {
  margin: 0;
}
</style>
