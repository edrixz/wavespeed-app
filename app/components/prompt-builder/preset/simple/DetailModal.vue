<script setup lang="ts">
const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const store = useSimplePresetStore();
const countdown = ref(0);
const timer = ref<any>(null);

watch(
  () => props.modelValue,
  () => {
    clearInterval(timer.value);
    countdown.value = 0;
  }
);

const handleApply = (item: any) => {
  store.applyPreset(item);
  emit("update:modelValue", null);
};

const startDelete = (id: string) => {
  if (countdown.value > 0) {
    store.deletePreset(id);
    emit("update:modelValue", null);
  } else {
    countdown.value = 5;
    timer.value = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer.value);
    }, 1000);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="ios-modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[99999] bg-[#050505] flex flex-col h-[100dvh] w-screen touch-none"
      >
        <div class="absolute inset-0 z-0 pointer-events-none ambient-layer">
          <img
            :src="modelValue.thumbnail"
            class="w-full h-full object-cover scale-150 blur-[80px] opacity-30 saturate-150"
          />
          <div class="absolute inset-0 bg-black/60"></div>
        </div>

        <div
          class="relative z-10 flex flex-col h-full max-h-full w-full overflow-hidden sm:m-6 sm:rounded-[32px] sm:border sm:border-white/10 bg-black/20 backdrop-blur-sm main-card will-change-transform"
        >
          <button
            @click="$emit('update:modelValue', null)"
            class="absolute top-4 right-4 z-[100] w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white hover:text-black transition-all active:scale-90 ui-element"
          >
            ✕
          </button>

          <div class="relative w-full h-[38vh] flex-shrink-0 hero-wrapper">
            <img
              :src="modelValue.thumbnail"
              class="w-full h-full object-cover hero-img"
            />
            <div
              class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10"
            ></div>
          </div>

          <main
            class="flex-1 min-h-0 relative z-20 -mt-12 bg-[#080808] rounded-t-[32px] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ui-element content-body flex flex-col"
          >
            <div class="flex-1 overflow-y-auto no-scrollbar pt-8 px-6 pb-28">
              <div class="max-w-2xl mx-auto space-y-6">
                <div
                  class="flex items-start justify-between gap-4 animate-in-up"
                  style="--delay: 0.1s"
                >
                  <h1
                    class="text-2xl font-black uppercase text-white leading-tight tracking-wide"
                  >
                    {{ modelValue.title }}
                  </h1>
                  <span
                    class="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {{ modelValue.size }}
                  </span>
                </div>

                <div class="space-y-4">
                  <div
                    class="p-5 rounded-2xl bg-white/[0.03] border border-white/5 animate-in-up"
                    style="--delay: 0.2s"
                  >
                    <div class="flex items-center gap-2 mb-2 opacity-50">
                      <Icon
                        name="lucide:sparkles"
                        size="12"
                        class="text-blue-400"
                      />
                      <span
                        class="text-[9px] font-bold uppercase tracking-widest text-gray-300"
                        >Prompt</span
                      >
                    </div>
                    <p
                      class="text-[12px] text-gray-300 font-mono leading-relaxed break-words whitespace-pre-wrap"
                    >
                      {{ modelValue.prompt }}
                    </p>
                  </div>

                  <div
                    v-if="modelValue.negative_prompt"
                    class="p-5 rounded-2xl bg-red-500/[0.02] border border-red-500/5 animate-in-up"
                    style="--delay: 0.3s"
                  >
                    <div class="flex items-center gap-2 mb-2 opacity-50">
                      <Icon
                        name="lucide:shield-ban"
                        size="12"
                        class="text-red-400"
                      />
                      <span
                        class="text-[9px] font-bold uppercase tracking-widest text-gray-300"
                        >Negative</span
                      >
                    </div>
                    <p
                      class="text-[11px] text-red-200/50 font-mono leading-relaxed break-words whitespace-pre-wrap"
                    >
                      {{ modelValue.negative_prompt }}
                    </p>
                  </div>

                  <div class="h-10"></div>
                </div>
              </div>
            </div>
          </main>

          <div
            class="absolute bottom-4 left-4 right-4 z-40 animate-in-up ui-element pointer-events-none"
            style="--delay: 0.4s"
          >
            <div
              class="max-w-xl mx-auto p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto"
            >
              <button
                @click="startDelete(modelValue.id)"
                class="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all"
                :class="
                  countdown > 0
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'hover:bg-red-500/20 text-red-400'
                "
              >
                <span v-if="countdown > 0" class="text-[10px] font-bold">{{
                  countdown
                }}</span>
                <Icon v-else name="lucide:trash-2" size="18" />
              </button>
              <button
                @click="handleApply(modelValue)"
                class="flex-1 h-12 bg-white text-black rounded-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
              >
                <span>Activate</span>
                <Icon name="lucide:arrow-right" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Giữ nguyên toàn bộ style Animation cũ */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Bỏ touch-none ở container chính để cho phép scroll nội dung */
/* .touch-none { touch-action: none; } -> XÓA DÒNG NÀY HOẶC CHỈ ÁP DỤNG CHO OVERLAY */

.ios-modal-enter-active {
  transition: opacity 0.5s ease;
}
.ios-modal-enter-from {
  opacity: 0;
}
.ios-modal-enter-active .hero-img {
  animation: imageSettleIn 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}
.ios-modal-enter-active .animate-in-up {
  animation: contentSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: var(--delay);
  transform: translateY(30px);
}

.ios-modal-leave-active {
  transition: opacity 0.4s ease-out;
  transition-delay: 0.1s;
}
.ios-modal-leave-to {
  opacity: 0;
}
.ios-modal-leave-active .hero-img {
  animation: none !important;
  transform: scale(1.3) !important;
  filter: blur(10px) brightness(0.5) !important;
  transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), filter 0.4s ease !important;
}
.ios-modal-leave-active .ui-element {
  animation: none !important;
  transform: translateY(100px) !important;
  opacity: 0 !important;
  transition: all 0.25s cubic-bezier(0.5, 0, 0.75, 0) !important;
}
.ios-modal-leave-active .main-card {
  transform: scale(0.96);
  border-radius: 48px;
  transition: all 0.4s ease;
}

@keyframes imageSettleIn {
  from {
    transform: scale(1.2);
    filter: blur(5px);
  }
  to {
    transform: scale(1);
    filter: blur(0);
  }
}
@keyframes contentSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
