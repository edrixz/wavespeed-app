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

watch(
  () => props.modelValue,
  () => {
    clearInterval(timer.value);
    countdown.value = 0;
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] bg-[#050505] flex flex-col sm:m-4 sm:rounded-[40px] border border-white/5 overflow-hidden"
      >
        <header
          class="p-6 border-b border-white/5 flex justify-between bg-black/50 backdrop-blur-xl"
        >
          <h2
            class="text-[11px] font-black uppercase tracking-[0.4em] text-white"
          >
            {{ modelValue.title }}
          </h2>
          <button
            @click="$emit('update:modelValue', null)"
            class="text-gray-500"
          >
            ✕
          </button>
        </header>

        <main class="flex-1 overflow-y-auto p-6 sm:p-20 no-scrollbar">
          <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
            <div
              class="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative"
            >
              <img
                :src="modelValue.thumbnail"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
            </div>

            <div class="space-y-8">
              <div
                class="p-8 bg-blue-500/5 rounded-[32px] border border-blue-500/10"
              >
                <p
                  class="text-[11px] text-blue-100/80 font-mono italic leading-relaxed"
                >
                  "{{ modelValue.prompt }}"
                </p>
              </div>
              <div
                v-if="modelValue.negative_prompt"
                class="p-8 bg-red-500/5 rounded-[32px] border border-red-500/10"
              >
                <p class="text-[10px] text-red-100/30 font-mono italic">
                  {{ modelValue.negative_prompt }}
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer
          class="p-8 border-t border-white/5 bg-black/80 flex flex-col sm:flex-row justify-between gap-4"
        >
          <button
            @click="startDelete(modelValue.id)"
            class="px-8 py-4 rounded-2xl text-[9px] font-black uppercase transition-all"
            :class="
              countdown > 0
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-white/5 text-red-500/40 hover:bg-red-500/10'
            "
          >
            {{ countdown > 0 ? `Confirm (${countdown}s)` : "Erase Asset" }}
          </button>
          <button
            @click="handleApply(modelValue)"
            class="sm:w-80 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase shadow-2xl active:scale-95 transition-all"
          >
            Activate Style
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>
