<script setup lang="ts">
import { useGalleryStore } from "~/stores/common/ui/gallery-store";

const user = useSupabaseUser();
const authStore = useAuthStore();
const isOpen = ref(false);

// Xử lý đóng menu khi click ra ngoài
const menuRef = ref<HTMLElement | null>(null);
const toggleMenu = () => (isOpen.value = !isOpen.value);

const handleLogout = async () => {
  isOpen.value = false;
  const galleryStore = useGalleryStore();
  const loggerStore = useLoggerStore();

  loggerStore.clearMessages();
  galleryStore.clearSession();

  // Thực hiện logout
  await authStore.logout();
};

// Hook để lắng nghe click outside
if (process.client) {
  onMounted(() => {
    window.addEventListener("click", (e) => {
      if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
        isOpen.value = false;
      }
    });
  });
}
</script>

<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all outline-none"
    >
      <div
        class="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-blue-500/10"
      >
        <div
          class="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-[11px] font-black text-white"
        >
          {{ user?.email?.charAt(0).toUpperCase() }}
        </div>
      </div>
      <Icon
        name="lucide:chevron-down"
        size="14"
        class="text-gray-500 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-3 w-64 bg-[#111111] border border-white/5 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-xl"
      >
        <div class="px-4 py-3 border-b border-white/5 mb-2">
          <p
            class="text-[10px] text-gray-500 font-bold uppercase tracking-widest"
          >
            Signed in as
          </p>
          <p class="text-xs font-bold text-white truncate mt-0.5">
            {{ user?.email }}
          </p>
        </div>

        <div class="space-y-1">
          <NuxtLink
            to="/settings"
            class="dropdown-item"
            @click="isOpen = false"
          >
            <Icon name="lucide:settings" size="16" />
            <span>Settings</span>
          </NuxtLink>

          <NuxtLink to="/billing" class="dropdown-item" @click="isOpen = false">
            <Icon name="lucide:credit-card" size="16" />
            <span>Billing</span>
          </NuxtLink>
        </div>

        <div class="h-px bg-white/5 my-2"></div>

        <button
          @click="handleLogout"
          class="dropdown-item text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Icon name="lucide:log-out" size="16" />
          <span>Sign Out</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-item {
  @apply flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-400 transition-all hover:bg-white/5 hover:text-white;
}

/* Animation */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
