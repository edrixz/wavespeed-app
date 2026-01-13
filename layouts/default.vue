<script setup lang="ts">
import LayoutAppSidebar from "~/components/layout/AppSidebar.vue";
import LayoutAppHeader from "~/components/layout/AppHeader.vue";

const isSidebarOpen = ref(false);
const route = useRoute();

// Tự động đóng sidebar khi chuyển trang trên mobile
watch(
  () => route.path,
  () => (isSidebarOpen.value = false)
);
</script>

<template>
  <div class="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
    <CommonToastContainer />

    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <LayoutAppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0">
      <LayoutAppHeader @open-menu="isSidebarOpen = true" />

      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <div class="p-4 lg:p-8 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
