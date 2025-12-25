<script setup lang="ts">
const toastStore = useToastStore();

const icons: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const colors: Record<string, string> = {
  success: "border-green-500/50 text-green-400 bg-green-500/10",
  error: "border-red-500/50 text-red-400 bg-red-500/10",
  info: "border-blue-500/50 text-blue-400 bg-blue-500/10",
  warning: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-6 right-6 z-[2000] flex flex-col gap-3 w-full max-w-[320px] pointer-events-none"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-500"
          :class="colors[toast.type]"
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center border border-current text-[10px] font-black"
          >
            {{ icons[toast.type] }}
          </span>
          <p class="text-[11px] font-bold uppercase tracking-wider flex-1">
            {{ toast.message }}
          </p>
          <button
            @click="toastStore.removeToast(toast.id)"
            class="opacity-40 hover:opacity-100 text-xs"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}
.toast-leave-active {
  position: absolute;
}
</style>
