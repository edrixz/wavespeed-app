<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLoggerStore } from "~/stores/common/ui/logger-store";

const loggerStore = useLoggerStore();
const { messages } = storeToRefs(loggerStore);

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

/**
 * Filter: Chỉ hiển thị các log quan trọng (Success/Error) cho phần Notification.
 * Các log trung gian (loading/info) sẽ chỉ xuất hiện trong trang chi tiết hoặc Status Bar.
 */
const importantNotifications = computed(() => {
  return [...messages.value]
    .filter((m) => ["success", "error"].includes(m.type))
    .reverse()
    .slice(0, 5); // Lấy 5 thông báo mới nhất
});

// Kiểm tra xem có thông báo chưa đọc không (tùy chọn: có thể mở rộng thêm logic 'isRead' sau này)
const hasUnread = computed(() => importantNotifications.value.length > 0);

// Xử lý đóng Dropdown khi click ra ngoài
if (process.client) {
  onMounted(() => {
    window.addEventListener("click", (e) => {
      if (
        containerRef.value &&
        !containerRef.value.contains(e.target as Node)
      ) {
        isOpen.value = false;
      }
    });
  });
}

// Helper xác định Icon và Màu sắc
const getNotificationUI = (type: string) => {
  switch (type) {
    case "success":
      return {
        icon: "lucide:check-circle",
        color: "text-green-500",
        bg: "bg-green-500/10",
      };
    case "error":
      return {
        icon: "lucide:alert-circle",
        color: "text-red-500",
        bg: "bg-red-500/10",
      };
    default:
      return {
        icon: "lucide:info",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      };
  }
};

/**
 * Format thời gian ngắn gọn
 */
const formatTime = (ts: number) => {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>

<template>
  <div class="relative" ref="containerRef">
    <button
      @click="isOpen = !isOpen"
      class="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all outline-none"
      :class="{ 'text-white bg-white/5': isOpen }"
    >
      <Icon name="lucide:bell" size="20" />

      <span
        v-if="hasUnread"
        class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"
      ></span>
    </button>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-80 bg-[#111111] border border-white/5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden backdrop-blur-2xl"
      >
        <div
          class="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]"
        >
          <h3
            class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
          >
            Notifications
          </h3>
          <button
            @click="loggerStore.clearMessages"
            class="text-[9px] font-bold text-blue-500 uppercase tracking-widest hover:underline"
          >
            Clear
          </button>
        </div>

        <div class="max-h-[350px] overflow-y-auto">
          <div
            v-if="importantNotifications.length === 0"
            class="p-10 text-center space-y-3"
          >
            <Icon
              name="lucide:bell-off"
              size="24"
              class="text-gray-700 mx-auto"
            />
            <p
              class="text-[10px] text-gray-600 uppercase tracking-widest font-bold"
            >
              No new alerts
            </p>
          </div>

          <div
            v-for="log in importantNotifications"
            :key="log.id"
            class="p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-default group"
          >
            <div class="flex gap-4">
              <div
                :class="[
                  'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                  getNotificationUI(log.type).bg,
                ]"
              >
                <Icon
                  :name="getNotificationUI(log.type).icon"
                  :class="getNotificationUI(log.type).color"
                  size="16"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-2">
                  <p
                    class="text-[11px] font-bold text-gray-300 leading-snug group-hover:text-white transition-colors"
                  >
                    {{ log.message }}
                  </p>
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    class="text-[9px] text-gray-600 font-mono uppercase tracking-tighter"
                  >
                    {{ formatTime(log.timestamp) }}
                  </span>
                  <span
                    v-if="log.groupName"
                    class="text-[8px] bg-white/5 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold"
                  >
                    {{ log.groupName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink
          to="/history-logs"
          @click="isOpen = false"
          class="block p-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/5 transition-all border-t border-white/5"
        >
          Check System Logs
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Animation mượt mà cho Dropdown */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-12px) scale(0.98);
  opacity: 0;
}

/* Tùy chỉnh thanh cuộn cho dropdown */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
