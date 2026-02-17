<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
defineEmits(["close"]);

const menuItems = [
  { name: "Dreamer", icon: "lucide:zap", path: "/" },
  { name: "Gallery", icon: "lucide:image", path: "/gallery" },
  { name: "System Logs", icon: "lucide:terminal", path: "/history-logs" },
  { name: "Settings", icon: "lucide:settings", path: "/settings" },
];
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-[500] w-72 bg-[#0d0d0d] border-r border-white/5 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-6 flex items-center justify-between">
      <h1 class="text-xl font-black uppercase tracking-[0.4em] text-blue-500">
        Wavespeed
      </h1>
      <button @click="$emit('close')" class="lg:hidden text-gray-500">
        <Icon name="lucide:x" size="24" />
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-2 mt-4">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        active-class="active"
      >
        <Icon :name="item.icon" size="18" />
        <span>{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-white/5 hover:text-white;
}
.active {
  @apply bg-blue-600/10 text-blue-500;
}
</style>
