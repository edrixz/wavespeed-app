<script setup lang="ts">
import { storeToRefs } from "pinia";

// Sử dụng Store chuyên biệt cho Simple Presets]
const simpleStore = useSimplePresetStore();
const { presets, isLoading } = storeToRefs(simpleStore);

// Tự động load dữ liệu khi component được gắn vào]
onMounted(async () => {
  await simpleStore.fetchPresets();
});

const selectedPreset = ref<any | null>(null);

// Hàm xử lý khi bấm Apply từ Dialog]
const handleApply = (preset: any) => {
  simpleStore.applyPreset(preset);
  selectedPreset.value = null; // Đóng dialog sau khi áp dụng]
};
</script>

<template>
  <div class="w-full pt-2 pb-6 space-y-4">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
        <h3
          class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500"
        >
          Quick Styles
        </h3>
      </div>
      <div v-if="isLoading" class="flex gap-1">
        <div class="w-1 h-1 bg-gray-600 rounded-full animate-bounce"></div>
        <div
          class="w-1 h-1 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"
        ></div>
        <div
          class="w-1 h-1 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"
        ></div>
      </div>
    </div>

    <div class="relative group">
      <div
        class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"
      ></div>
      <div
        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"
      ></div>

      <div
        class="flex overflow-x-auto gap-4 px-1 pb-4 no-scrollbar snap-x snap-mandatory"
      >
        <div
          v-if="!isLoading && presets.length === 0"
          class="w-full py-10 text-center border border-dashed border-white/5 rounded-2xl"
        >
          <p
            class="text-[10px] text-gray-600 uppercase font-bold tracking-widest"
          >
            No presets found
          </p>
        </div>

        <div
          v-for="item in presets"
          :key="item.id"
          @click="selectedPreset = item"
          class="flex-none w-[240px] snap-start group/card cursor-pointer"
        >
          <div
            class="relative aspect-[16/9] bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden p-5 transition-all duration-500 hover:border-blue-500/40 hover:bg-white/[0.05] hover:translate-y-[-4px]"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"
            ></div>

            <div class="relative h-full flex flex-col justify-between">
              <div class="flex justify-between items-start">
                <span
                  class="text-[8px] font-black uppercase text-blue-500/80 tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20"
                >
                  {{ item.size || "Auto" }}
                </span>
                <button
                  @click.stop="simpleStore.deletePreset(item.id)"
                  class="opacity-0 group-hover/card:opacity-100 text-gray-600 hover:text-red-500 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <h4
                  class="text-white font-black uppercase text-[11px] tracking-tight mb-1 truncate"
                >
                  {{ item.title }}
                </h4>
                <p
                  class="text-gray-600 text-[9px] line-clamp-1 italic font-medium leading-none"
                >
                  "{{ item.prompt }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="dialog">
      <div
        v-if="selectedPreset"
        class="fixed inset-0 z-[300] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black/90 backdrop-blur-md"
          @click="selectedPreset = null"
        ></div>

        <div
          class="relative bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl space-y-6 overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          ></div>

          <div class="space-y-1">
            <h2
              class="text-white text-xl font-black uppercase tracking-tighter"
            >
              {{ selectedPreset.title }}
            </h2>
            <p
              class="text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em]"
            >
              Quick Style Configuration
            </p>
          </div>

          <div class="space-y-4">
            <div class="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <p
                class="text-[8px] text-gray-500 font-black uppercase mb-2 tracking-widest"
              >
                Positive Prompt
              </p>
              <p
                class="text-[11px] text-gray-300 leading-relaxed font-medium italic"
              >
                "{{ selectedPreset.prompt }}"
              </p>
            </div>

            <div
              v-if="selectedPreset.negative_prompt"
              class="bg-red-500/[0.02] p-4 rounded-2xl border border-red-500/10"
            >
              <p
                class="text-[8px] text-red-500/50 font-black uppercase mb-2 tracking-widest"
              >
                Negative Constraints
              </p>
              <p
                class="text-[11px] text-red-200/40 leading-relaxed font-mono italic"
              >
                {{ selectedPreset.negative_prompt }}
              </p>
            </div>

            <div class="flex gap-4">
              <div
                class="flex-1 bg-white/[0.02] p-3 rounded-xl border border-white/5 text-center"
              >
                <p class="text-[7px] text-gray-600 font-black uppercase mb-1">
                  Canvas Size
                </p>
                <p class="text-[10px] text-blue-400 font-bold font-mono">
                  {{ selectedPreset.size || "Default" }}
                </p>
              </div>
              <div
                class="flex-1 bg-white/[0.02] p-3 rounded-xl border border-white/5 text-center"
              >
                <p class="text-[7px] text-gray-600 font-black uppercase mb-1">
                  Created At
                </p>
                <p class="text-[10px] text-gray-400 font-bold font-mono">
                  {{ new Date(selectedPreset.created_at).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="selectedPreset = null"
              class="flex-1 py-4 bg-white/5 text-gray-500 text-[10px] font-black uppercase rounded-xl hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              @click="handleApply(selectedPreset)"
              class="flex-[2.5] py-4 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              Apply Style
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hiệu ứng Dialog mượt mà] */
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* Snap scrolling] */
.snap-x {
  scroll-snap-type: x mandatory;
}
.snap-start {
  scroll-snap-align: start;
}
</style>
