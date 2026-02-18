<script setup lang="ts">
import LayoutAppSidebar from "~/components/layout/AppSidebar.vue";
import LayoutAppHeader from "~/components/layout/AppHeader.vue";

const isSidebarOpen = ref(false);
const route = useRoute();

watch(
  () => route.path,
  () => (isSidebarOpen.value = false),
);
</script>

<template>
  <div
    class="flex h-screen bg-[#131314] text-[#E3E3E3] font-sans overflow-hidden selection:bg-blue-500/30"
  >
    <CommonToastContainer />

    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-[#131314]/80 backdrop-blur-sm z-50 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <LayoutAppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0 bg-[#131314] relative">
      <div
        class="flex-1 flex flex-col h-full lg:rounded-tl-[24px] lg:my-2 lg:mr-2 bg-[#1E1F20] overflow-hidden border border-[#444746]/30 shadow-2xl"
      >
        <LayoutAppHeader @open-menu="isSidebarOpen = !isSidebarOpen" />

        <main
          class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-[#0d0d0d]"
        >
          <div class="p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar cho main content để giống Google Docs */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #444746;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #5e5e5e;
}
</style>
