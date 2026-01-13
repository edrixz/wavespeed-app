<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";

const props = defineProps<{
  image: string | null;
  loading: boolean;
}>();

// --- LOGIC FAKE PROGRESS ---
const progress = ref(0);
let progressTimer: ReturnType<typeof setInterval> | null = null;

const statusText = computed(() => {
  if (progress.value < 20) return "Initializing AI Model...";
  if (progress.value < 50) return "Analyzing Prompt & Style...";
  if (progress.value < 85) return "Rendering Pixels...";
  if (progress.value < 100) return "Finalizing Masterpiece...";
  return "Generation Complete";
});

watch(
  () => props.loading,
  (isLoading) => {
    if (isLoading) {
      progress.value = 0;
      // Khởi động thanh tiến trình ảo
      progressTimer = setInterval(() => {
        if (progress.value < 92) {
          // Càng về sau chạy càng chậm để tạo cảm giác AI đang tính toán nặng
          const increment = (100 - progress.value) / 30;
          progress.value += Math.max(0.1, increment);
        }
      }, 400);
    } else {
      if (progressTimer) clearInterval(progressTimer);
      if (props.image) progress.value = 100;
      else progress.value = 0;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer);
});
</script>

<template>
  <div
    class="flex-1 rounded-2xl border border-gray-800 p-1 min-h-[500px] flex items-center justify-center relative overflow-hidden transition-all duration-700 group bg-[#050505] shadow-2xl"
    :class="{ 'border-blue-500/30 ring-1 ring-blue-500/20': loading }"
  >
    <div
      v-if="loading || image"
      class="absolute top-0 left-0 right-0 z-50 p-3 bg-black/40 backdrop-blur-md border-b border-white/5 flex flex-col gap-2"
    >
      <div class="flex justify-between items-center px-1">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span
            class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80"
          >
            {{ loading ? "AI Engine Active" : "Neural Output" }}
          </span>
        </div>
        <span class="text-[10px] font-mono text-gray-500"
          >{{ Math.floor(progress) }}%</span
        >
      </div>
      <div class="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
        <div
          class="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(56,189,248,0.6)]"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <div
      v-if="image"
      class="relative z-30 w-full h-full flex items-center justify-center p-4 lg:p-10"
    >
      <img
        :src="image"
        class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] z-30 animate-reveal"
      />

      <div
        class="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      ></div>
    </div>

    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black"
    >
      <div
        class="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-20"
      >
        <div
          class="w-full h-[100px] bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-scan"
        ></div>
      </div>

      <div
        class="absolute inset-0 filter blur-[80px] opacity-40 mix-blend-screen"
      >
        <div
          class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full animate-blob-slow"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full animate-blob-slow delay-700"
        ></div>
      </div>

      <div class="relative z-30 flex flex-col items-center gap-6">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <div
            class="absolute inset-0 border-t-2 border-b-2 border-blue-500/30 rounded-full animate-spin-slow"
          ></div>
          <div
            class="absolute inset-2 border-r-2 border-l-2 border-cyan-400/20 rounded-full animate-spin-reverse"
          ></div>
          <Icon
            name="lucide:cpu"
            size="32"
            class="text-blue-400 animate-pulse"
          />
        </div>

        <div class="text-center">
          <p
            class="text-blue-100 font-black uppercase tracking-[0.3em] text-xs mb-2"
          >
            {{ statusText }}
          </p>
          <p
            class="text-[9px] text-gray-500 uppercase tracking-widest font-bold"
          >
            Quantum rendering in progress
          </p>
        </div>
      </div>
    </div>

    <div
      v-else-if="!image"
      class="text-center z-10 group-hover:scale-105 transition-transform duration-500"
    >
      <div class="relative inline-block mb-6">
        <Icon name="lucide:wand-sparkles" class="w-16 h-16 text-gray-800" />
        <div
          class="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full blur-md animate-pulse"
        ></div>
      </div>
      <h3 class="text-gray-400 font-black uppercase tracking-[0.4em] text-sm">
        Waiting for spark
      </h3>
      <p class="text-gray-600 text-[10px] mt-2 uppercase tracking-widest">
        Select images and build your prompt
      </p>
    </div>

    <a
      v-if="image && !loading"
      :href="image"
      target="_blank"
      download="wavespeed-ai.png"
      class="absolute bottom-6 right-6 z-40 bg-white/10 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 hover:border-blue-400 shadow-2xl active:scale-95"
    >
      <Icon name="lucide:download" size="14" />
      Download
    </a>
  </div>
</template>

<style scoped>
/* AI Scanning Line Animation */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(400%);
  }
}
.animate-scan {
  animation: scan 3s linear infinite;
}

/* Reveal Image with Blur transition */
@keyframes reveal {
  from {
    opacity: 0;
    filter: blur(20px) scale(0.95);
  }
  to {
    opacity: 1;
    filter: blur(0) scale(1);
  }
}
.animate-reveal {
  animation: reveal 1s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Smooth Blobs */
@keyframes blob-slow {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
.animate-blob-slow {
  animation: blob-slow 10s infinite ease-in-out;
}

/* Spinners */
.animate-spin-slow {
  animation: spin 4s linear infinite;
}
.animate-spin-reverse {
  animation: spin 3s linear reverse infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.delay-700 {
  animation-delay: 700ms;
}
</style>
