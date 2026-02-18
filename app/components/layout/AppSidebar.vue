<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
defineEmits(["close"]);

const menuItems = [
  { name: "Dreamer", icon: "lucide:sparkles", path: "/" },
  { name: "Gallery", icon: "lucide:image", path: "/gallery" },
  { name: "System Logs", icon: "lucide:history", path: "/history-logs" },
  { name: "Settings", icon: "lucide:settings", path: "/settings" },
];
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-[500] w-[280px] bg-[#131314] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="h-16 lg:h-[72px] flex items-center px-6 gap-3">
      <div
        class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"
      >
        <Icon name="lucide:waves" size="20" />
      </div>
      <span class="text-[22px] font-normal text-[#E3E3E3] tracking-tight">
        Wavespeed
      </span>

      <button @click="$emit('close')" class="ml-auto lg:hidden text-[#C4C7C5]">
        <Icon name="lucide:x" size="24" />
      </button>
    </div>

    <div class="px-4 mt-2 mb-6">
      <button
        class="flex items-center gap-3 bg-[#A8C7FA] hover:bg-[#D3E3FD] text-[#041E49] w-full px-4 py-3.5 rounded-[16px] transition-colors font-medium text-sm shadow-sm group"
      >
        <Icon
          name="lucide:plus"
          size="20"
          class="group-hover:rotate-90 transition-transform"
        />
        <span>New Project</span>
      </button>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <div v-for="(item, index) in menuItems" :key="item.path">
        <div
          v-if="index === 3"
          class="my-4 border-t border-[#444746]/50 mx-4"
        ></div>

        <NuxtLink :to="item.path" class="nav-item" active-class="active">
          <div class="icon-wrapper">
            <Icon :name="item.icon" size="20" />
          </div>
          <span class="font-medium text-[14px]">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="p-4 mt-auto">
      <div
        class="flex items-center gap-3 p-3 rounded-full hover:bg-[#444746]/30 cursor-pointer transition-colors"
      >
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"
        ></div>
        <div class="flex flex-col">
          <span class="text-xs font-medium text-[#E3E3E3]">Edrixx Space</span>
          <span class="text-[10px] text-[#C4C7C5]">Pro Plan</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Material 3 Navigation Drawer Style */
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-full text-[#C4C7C5] transition-all duration-200 hover:bg-[#444746]/30 hover:text-[#E3E3E3];
}

/* Active State: Pill shape, background color, bold text */
.active {
  @apply bg-[#004A77] text-[#A8C7FA];
}

/* Icon active state */
.active .icon-wrapper {
  @apply text-[#A8C7FA];
}
</style>
