<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
defineEmits(["close"]);

const menuItems = [
  { name: "Seedream AI", icon: "lucide:sparkles", path: "/" },
  { name: "Grok AI", icon: "grok", path: "/grok" },
  { name: "Gemini", icon: "gemini", path: "/gemini" },
  { name: "Gallery", icon: "lucide:image", path: "/gallery" },
  { name: "System Logs", icon: "lucide:history", path: "/history-logs" },
  { name: "Settings", icon: "lucide:settings", path: "/settings" },
];
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-1001 w-70 bg-neutral-50 dark:bg-[#131314] flex flex-col transition-all duration-300 lg:static lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="h-12 flex items-center px-6 pl-12">
      <span
        class="text-[22px] font-normal text-neutral-900 dark:text-[#E3E3E3] tracking-tight transition-all duration-700 delay-150"
        :class="
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        "
      >
        SPEED AI
      </span>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <div v-for="(item, index) in menuItems" :key="item.path">
        <div
          v-if="index === 3"
          class="my-4 border-t border-black/10 dark:border-[#444746]/50 mx-4"
        ></div>

        <NuxtLink :to="item.path" class="nav-item" active-class="active">
          <div class="icon-wrapper">
            <PartsIconsGrok v-if="item.icon === 'grok'" />
            <PartsIconsGemini v-if="item.icon === 'gemini'" />
            <Icon v-else :name="item.icon" size="20" />
          </div>
          <span class="font-medium text-[14px]">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="p-4 mt-auto">
      <div
        class="flex items-center gap-3 p-3 rounded-full hover:bg-black/5 dark:hover:bg-[#444746]/30 cursor-pointer transition-colors"
      >
        <div
          class="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500"
        ></div>
        <div class="flex flex-col">
          <span class="text-xs font-medium text-neutral-900 dark:text-[#E3E3E3]"
            >Edrixx Space</span
          >
          <span class="text-[10px] text-gray-500 dark:text-[#C4C7C5]"
            >Pro Plan</span
          >
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Material 3 Navigation Drawer Style */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  color: theme("colors.gray.500", #6b7280);
  transition: all 0.2s;
}
.dark .nav-item {
  color: #c4c7c5;
}
.nav-item:hover {
  background-color: theme("colors.black/5", rgba(0, 0, 0, 0.05));
  color: theme("colors.neutral.900", #111827);
}
.dark .nav-item:hover {
  background-color: rgba(68, 71, 70, 0.3);
  color: #e3e3e3;
}

/* Active State: Pill shape, background color, bold text */
.active {
  background-color: theme("colors.blue.100", #dbeafe);
  color: theme("colors.blue.600", #2563eb);
}
.dark .active {
  background-color: #004a77;
  color: #a8c7fa;
}

/* Icon active state */
.active .icon-wrapper {
  color: theme("colors.blue.600", #2563eb);
}
.dark .active .icon-wrapper {
  color: #a8c7fa;
}
</style>
