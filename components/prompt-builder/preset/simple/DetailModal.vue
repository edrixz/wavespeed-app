<script setup lang="ts">
const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const store = useSimplePresetStore();
const countdown = ref(0);
const timer = ref<any>(null);

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
    <Transition name="modal-ios">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] bg-[#050505] flex flex-col sm:m-4 sm:rounded-[40px] border border-white/5 overflow-hidden shadow-2xl"
      >
        <header
          class="p-6 border-b border-white/5 flex justify-between bg-black/50 backdrop-blur-xl z-20"
        >
          <div class="animate-item" style="--delay: 1">
            <h2
              class="text-[11px] font-black uppercase text-white tracking-[0.4em]"
            >
              {{ modelValue.title }}
            </h2>
            <div class="h-0.5 w-8 bg-blue-600 mt-1"></div>
          </div>
          <button
            @click="$emit('update:modelValue', null)"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </header>

        <main class="flex-1 overflow-y-auto p-6 sm:p-20 no-scrollbar">
          <div
            class="max-w-5xl mx-auto grid lg:grid-cols-12 gap-16 items-start"
          >
            <div class="lg:col-span-5 animate-item" style="--delay: 2">
              <div
                class="aspect-[3/4] rounded-[48px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group"
              >
                <img
                  :src="modelValue.thumbnail"
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                ></div>
              </div>
            </div>

            <div class="lg:col-span-7 space-y-10">
              <div class="space-y-4 animate-item" style="--delay: 3">
                <span
                  class="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-4"
                  >Positive Vector</span
                >
                <div
                  class="p-8 bg-blue-500/[0.03] rounded-[40px] border border-blue-500/10 backdrop-blur-sm"
                >
                  <p
                    class="text-[12px] text-blue-100/80 font-mono italic leading-relaxed tracking-tight"
                  >
                    "{{ modelValue.prompt }}"
                  </p>
                </div>
              </div>

              <div
                v-if="modelValue.negative_prompt"
                class="space-y-4 animate-item"
                style="--delay: 4"
              >
                <span
                  class="text-[9px] font-black text-red-500/50 uppercase tracking-widest ml-4"
                  >Negative Buffer</span
                >
                <div
                  class="p-8 bg-red-500/[0.03] rounded-[40px] border border-red-500/10 backdrop-blur-sm"
                >
                  <p
                    class="text-[11px] text-red-100/30 font-mono italic leading-relaxed tracking-tight"
                  >
                    {{ modelValue.negative_prompt }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer
          class="p-8 border-t border-white/5 bg-black/80 flex flex-col sm:flex-row justify-between gap-6 animate-item"
          style="--delay: 5"
        >
          <button
            @click="startDelete(modelValue.id)"
            class="px-10 py-4 rounded-2xl text-[9px] font-black uppercase transition-all"
            :class="
              countdown > 0
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-white/5 text-red-500/40 hover:bg-red-500/10'
            "
          >
            {{
              countdown > 0
                ? `Confirm Erasure (${countdown}s)`
                : "De-authorize Asset"
            }}
          </button>
          <button
            @click="handleApply(modelValue)"
            class="sm:w-[400px] py-5 bg-white text-black rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
          >
            Inject Parameters
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-ios-enter-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-ios-leave-active {
  transition: all 0.5s cubic-bezier(0.7, 0, 0.84, 0);
}
.modal-ios-enter-from {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}
.modal-ios-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-item {
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay) * 0.15s + 0.3s);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
