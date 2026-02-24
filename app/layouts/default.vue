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
    class="flex h-screen bg-[#131314] text-[#E3E3E3] font-sans overflow-hidden relative"
  >
    <CommonToastContainer />

    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-2 left-2 z-[1100] p-2.5 rounded-md backdrop-blur-md border border-white/5 text-gray-400 hover:text-white transition-all duration-300"
    >
      <div class="relative w-2 h-2 flex items-center justify-center">
        <Icon
          name="lucide:menu"
          size="15"
          class="absolute transition-all duration-500 transform"
          :class="
            isSidebarOpen
              ? 'opacity-0 rotate-180 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          "
        />
        <Icon
          name="lucide:x"
          size="15"
          class="absolute transition-all duration-500 transform"
          :class="
            isSidebarOpen
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-0'
          "
        />
      </div>
    </button>

    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-[#131314]/80 backdrop-blur-sm z-50 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <LayoutAppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0 bg-[#131314] relative">
      <div
        class="flex-1 flex flex-col h-full lg:rounded-tl-[24px] lg:my-2 lg:mr-2 bg-[#1E1F20] overflow-hidden border border-[#444746]/30 shadow-2xl relative"
      >
        <LayoutAppHeader class="z-[1000]" />

        <main
          class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-[#0d0d0d]"
        >
          <div class="p-2 pt-20 lg:pt-24 max-w-[1200px] mx-auto w-full">
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
  width: 3px;
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
