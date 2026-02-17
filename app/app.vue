<script setup lang="ts">
const isReady = ref(false);
onMounted(() => {
  isReady.value = true;
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <div v-if="isReady">
    <ToastContainer />
  </div>
</template>

<style>
/* Đảm bảo nền luôn đồng nhất từ Server để tránh nháy class */
body {
  background-color: #050505;
  margin: 0;
}
</style>
