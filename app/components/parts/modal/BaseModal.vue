<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  open: boolean;
  title?: string;
  description?: string;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const close = () => {
  emit("update:open", false);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.open) {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="fixed inset-0 z-100 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" @click="close"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-lg bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all transform flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div v-if="title || $slots.header" class="p-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5 shrink-0">
            <div class="flex-1">
              <slot name="header">
                <h3 class="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                  {{ title }}
                </h3>
                <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ description }}
                </p>
              </slot>
            </div>
            <button @click="close" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 outline-none">
              <Icon name="lucide:x" class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto w-full">
            <slot name="body"></slot>
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-5 border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a] shrink-0">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
