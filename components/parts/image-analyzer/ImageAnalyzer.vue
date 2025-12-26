<script setup lang="ts">
import { useImageAnalyzer } from "~/composables";

const toast = useToast();

const store = usePromptBuilderStore();
const { currentSubject } = storeToRefs(store);

const { analyzeImage, isAnalyzing, analyzingMode, cancelAnalysis } =
  useImageAnalyzer();

const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const handleMagicFill = async (mode: "fast" | "pro") => {
  const currentSub = currentSubject.value;
  if (!currentSub) return;

  const targetImageIdx =
    currentSub.refImageIdx !== -1 ? currentSub.refImageIdx : 0;
  const targetImage = images.value[targetImageIdx];

  if (!targetImage) return toast.warning("Please upload an image first!");

  // Đã sử dụng $fetch bên trong để tránh cảnh báo mounted của Nuxt
  await analyzeImage(targetImage.url, mode);
};

// Danh sách tin nhắn ngẫu nhiên để UI trông sinh động hơn
const loadingMessages = [
  "Reading features...",
  "Mapping visual data...",
  "Analyzing textures...",
  "Generating insights...",
  "Refining details...",
];
const currentMsgIdx = ref(0);
let msgInterval: any = null;

const currentMsg = computed(() => loadingMessages[currentMsgIdx.value]);

watch(isAnalyzing, (val) => {
  if (val) {
    msgInterval = setInterval(() => {
      currentMsgIdx.value = (currentMsgIdx.value + 1) % loadingMessages.length;
    }, 2000);
  } else {
    clearInterval(msgInterval);
  }
});
</script>

<template>
  <div class="analyzer-container w-full flex items-center">
    <Transition name="slide-up" mode="out-in">
      <div v-if="isAnalyzing" class="w-full py-1">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="relative w-6 h-6">
              <div
                class="absolute inset-0 bg-green-500/20 rounded-full animate-ping"
              ></div>
              <div
                class="relative flex items-center justify-center h-full text-xs"
              >
                <span v-if="analyzingMode === 'pro'">🧠</span>
                <span v-else>⚡</span>
              </div>
            </div>

            <div class="flex flex-col">
              <span
                class="text-[10px] font-black text-green-400 tracking-widest uppercase"
              >
                AI Magic Processing...
              </span>
              <span class="text-[9px] text-gray-500 italic typing-text">
                {{ currentMsg }}
              </span>
            </div>
          </div>

          <button
            @click="cancelAnalysis(currentSubject?.id!)"
            class="cancel-btn-magic"
          >
            CANCEL
          </button>
        </div>

        <div class="flex gap-1">
          <div
            v-for="i in 5"
            :key="i"
            class="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden relative"
          >
            <div
              class="absolute inset-0 bg-green-500/40 shimmer-effect"
              :style="{ animationDelay: `${i * 0.1}s` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center gap-2">
        <button
          @click="handleMagicFill('fast')"
          :disabled="images.length === 0"
          class="btn-magic btn-fast group"
        >
          <span v-if="analyzingMode === 'fast'" class="animate-spin">⚡</span>
          <span v-else>⚡ Magic Fill</span>
          <div class="custom-tooltip">Fast Analysis (Gemini Flash)</div>
        </button>

        <button
          @click="handleMagicFill('pro')"
          :disabled="images.length === 0"
          class="btn-magic btn-pro group"
        >
          <span v-if="analyzingMode === 'pro'" class="animate-spin">🧠</span>
          <span v-else>🧠 Magic Pro</span>
          <div class="shine-sweep"></div>
          <div class="custom-tooltip">Deep Reasoning (Gemini Pro)</div>
        </button>

        <div class="w-[1px] h-4 bg-gray-800 mx-1"></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.btn-magic {
  @apply relative text-[10px] font-black px-4 py-1.5 rounded border transition-all 
         flex items-center gap-2 overflow-hidden uppercase tracking-tighter;
}

.btn-fast {
  @apply bg-blue-900/10 text-blue-400 border-blue-900/50 hover:border-blue-400 hover:bg-blue-900/30;
}

.btn-pro {
  @apply bg-purple-900/10 text-purple-400 border-purple-900/50 hover:border-purple-400 hover:bg-purple-900/30
         shadow-[0_0_15px_rgba(168,85,247,0.1)];
}

/* Nút Cancel "Ngầu" */
.cancel-btn-magic {
  @apply text-[8px] font-bold px-3 py-1 border border-red-900/50 text-red-500/70 
         hover:text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all rounded;
}

/* Shimmer Effect cho ProgressBar */
.shimmer-effect {
  animation: shimmer-move 1.5s infinite linear;
  width: 50%;
}

@keyframes shimmer-move {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(250%);
  }
}

/* Tooltip tùy chỉnh */
.custom-tooltip {
  @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black 
         text-white text-[9px] rounded opacity-0 group-hover:opacity-100 
         transition-opacity whitespace-nowrap pointer-events-none border border-gray-800;
}

/* Hiệu ứng Shine cho Pro button */
.shine-sweep {
  @apply absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12;
}

/* Typing animation cho tin nhắn */
.typing-text::after {
  content: "...";
  animation: dots 1.5s infinite;
}
@keyframes dots {
  0%,
  20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60% {
    content: "...";
  }
}

/* Transition chuyển đổi UI */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
