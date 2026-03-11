<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{
  image: string | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "add-preset"): void;
}>();

const loggerStore = useLoggerStore();

// --- LOGIC FAKE PROGRESS ---
const progress = ref(0);
let progressTimer: ReturnType<typeof setInterval> | null = null;

watch(
  () => props.loading,
  (isLoading) => {
    if (isLoading) {
      progress.value = 0;
      progressTimer = setInterval(() => {
        if (progress.value < 95) {
          const increment = (100 - progress.value) / 40;
          progress.value += Math.max(0.1, increment);
        }
      }, 300);
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
    class="relative flex-1 w-full min-h-[500px] h-full rounded-4xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden bg-neutral-50/50 dark:bg-[#0a0a0a]/50 flex items-center justify-center transition-all duration-700 shadow-sm dark:shadow-2xl group"
    :class="{ 'ring-1 ring-primary-500/30 shadow-[0_0_40px_-10px_var(--color-primary-500)]': loading }"
  >
    <!-- Background mesh gradient / subtle ambient light -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-4xl">
      <div class="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300"></div>
    </div>

    <!-- Status Bar for Progress -->
    <Transition name="fade-slide">
      <div
        v-if="loading || image"
        class="absolute top-4 left-4 right-4 z-50 p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col gap-3 shadow-lg transition-colors"
      >
        <div class="flex justify-between items-center px-1">
          <div class="flex items-center gap-3">
            <div class="relative flex h-2.5 w-2.5">
              <span v-if="loading" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="loading ? 'bg-primary-500' : 'bg-sky-500'"></span>
            </div>
            <span class="text-xs font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">
              {{ loading ? "Processing" : "Generation Complete" }}
            </span>
          </div>
          <span class="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
            {{ Math.floor(progress) }}%
          </span>
        </div>
        <div class="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-full">
          <div
            class="h-full bg-primary-500 transition-all duration-300 ease-out shadow-[0_0_10px_var(--color-primary-500)]"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <Transition name="fade">
      <div
        v-if="loading"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-[#050505]/60 backdrop-blur-xl transition-all duration-500"
      >
        <!-- Ambient video glow -->
        <div class="absolute inset-0 z-0 opacity-40 dark:opacity-30 blur-3xl pointer-events-none scale-150 transition-all duration-1000">
           <video
            src="/video/ai-loader.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover"
          ></video>
        </div>

        <div class="relative z-30 flex flex-col items-center">
          <!-- Video Loader -->
          <div class="relative w-56 h-56 flex items-center justify-center mb-10">
            <!-- Glassy background / depth for the video -->
            <div class="absolute inset-0 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-3xl shadow-xl border border-white/30 dark:border-white/10"></div>
            
            <div class="relative w-48 h-48 overflow-hidden rounded-full shadow-[0_0_50px_rgba(56,189,248,0.2)]">
              <video
                src="/video/ai-loader.mp4"
                autoplay
                loop
                muted
                playsinline
                class="w-full h-full object-cover scale-110"
              ></video>
            </div>

            <!-- Outer ring animations (minimal) -->
            <div class="absolute -inset-2 rounded-full border border-sky-400/20 dark:border-sky-400/10 scale-105 animate-pulse"></div>
          </div>

          <!-- Logger text - Fixed height to prevent shifting -->
          <div class="text-center h-32 flex flex-col items-center justify-center max-w-[320px]">
             <!-- Main message -->
            <Transition name="slide-up" mode="out-in">
              <p
                :key="loggerStore.messages[0]?.message"
                class="text-sm font-bold text-neutral-800 dark:text-neutral-100 tracking-wide drop-shadow-sm mb-4"
              >
                {{ loggerStore.messages[0]?.message || 'Starting processing...' }}
              </p>
            </Transition>
            
            <!-- Secondary status -->
            <div class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <p class="text-[10px] text-neutral-500 dark:text-neutral-500 uppercase tracking-[0.25em] font-black">
                AI CORE ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Result Image -->
    <Transition name="scale-fade">
      <div
        v-if="image && !loading"
        class="relative z-10 w-full h-full p-6 sm:p-12 flex items-center justify-center bg-white dark:bg-[#050505]"
      >
        <img
          :src="image"
          class="xl:max-w-4/5 max-w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] dark:shadow-[0_32px_128px_-16px_rgba(0,0,0,0.9)] ring-1 ring-black/5 dark:ring-white/10 relative z-10 transition-transform duration-700 hover:scale-[1.01]"
          alt="Generated Result"
        />
        
        <!-- Add Preset Button overlay at bottom -->
        <div class="absolute bottom-10 z-50 flex items-center justify-center w-full">
          <UButton
            color="primary"
            variant="solid"
            icon="i-lucide-bookmark-plus"
            size="xl"
            class="rounded-full shadow-2xl shadow-primary-500/30 transition-all hover:scale-105 px-8 font-bold h-14"
            @click="emit('add-preset')"
          >
            Add to Presets
          </UButton>
        </div>
      </div>
    </Transition>

    <!-- Empty State -->
    <Transition name="fade">
      <div
        v-if="!image && !loading"
        class="relative z-10 flex flex-col items-center justify-center p-8 group-hover:scale-[1.02] transition-all duration-700"
      >
        <div class="relative mb-10 flex items-center justify-center w-56 h-56 group/idle">
          <!-- Glassy backdrop (match Loading state exactly) -->
          <div class="absolute inset-0 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-3xl shadow-xl border border-white/30 dark:border-white/10 transition-all duration-700 group-hover/idle:shadow-primary-500/20 group-hover/idle:scale-105"></div>
          
          <!-- Static representation of the AI core -->
          <div class="relative w-48 h-48 overflow-hidden rounded-full shadow-inner">
             <video
                src="/video/ai-loader.mp4"
                class="w-full h-full object-cover opacity-30 grayscale group-hover/idle:grayscale-0 group-hover/idle:opacity-60 transition-all duration-700"
                preload="metadata"
              ></video>
          </div>

          <!-- Outer ring (match Loading state spacing) -->
          <div class="absolute -inset-2 rounded-full border border-sky-400/20 dark:border-sky-400/10 scale-105 opacity-0 group-hover/idle:opacity-100 transition-opacity duration-700"></div>
        </div>

        <!-- Text area - Fixed height matching Loading state -->
        <div class="text-center h-32 flex flex-col items-center justify-center max-w-[320px]">
          <h3 class="text-neutral-900 dark:text-neutral-100 font-black text-2xl tracking-tight mb-2 uppercase drop-shadow-sm leading-tight">
            Awaiting Inspiration
          </h3>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-medium">
            Upload your images and define the prompt to start the neural rendering process.
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Existing Animations */
.animate-scan {
  animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
}

.animate-spin-slow {
  animation: spin 4s linear infinite;
}
.animate-spin-reverse {
  animation: spin 3s linear reverse infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.scale-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.1s;
}
.scale-fade-leave-active {
  transition: all 0.4s ease-in;
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
  filter: blur(8px);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
