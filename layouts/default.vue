<script setup lang="ts">
const { hasLogMessage } = useLogger();
const isSidebarOpen = ref(false);
const route = useRoute();
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
          <Transition name="expand">
            <div v-if="hasLogMessage" class="status-bar-wrapper">
              <CommonStatusBar />
            </div>
          </Transition>
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.status-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: #0a0a0a;
  padding-bottom: 1rem;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}
.expand-enter-to,
.expand-leave-from {
  max-height: 120px;
  opacity: 1;
}
</style>
