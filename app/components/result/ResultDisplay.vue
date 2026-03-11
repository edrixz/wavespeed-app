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
              <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="loading ? 'bg-primary-500' : 'bg-green-500'"></span>
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

        <div class="relative z-30 flex flex-col items-center gap-10">
          <!-- Video Loader -->
          <div class="relative w-48 h-48 flex items-center justify-center">
            <!-- Glassy background / depth for the video -->
            <div class="absolute inset-2 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-3xl shadow-2xl border border-white/30 dark:border-white/10"></div>
            
            <div class="relative w-full h-full overflow-hidden rounded-full shadow-[0_0_50px_rgba(56,189,248,0.3)]">
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
            <div class="absolute -inset-2 rounded-full border border-sky-400/20 dark:border-sky-400/10 scale-110 animate-pulse"></div>
          </div>

          <!-- Logger text -->
          <div class="text-center space-y-4 max-w-[280px]">
             <!-- Main message -->
            <Transition name="slide-up" mode="out-in">
              <p
                :key="loggerStore.messages[0]?.message"
                class="text-sm font-bold text-neutral-800 dark:text-neutral-100 tracking-wide drop-shadow-sm"
              >
                {{ loggerStore.messages[0]?.message || 'Starting processing...' }}
              </p>
            </Transition>
            
            <!-- Secondary status -->
            <div class="flex flex-col items-center gap-2">
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
        class="relative z-10 flex flex-col items-center justify-center text-center p-8 group-hover:scale-[1.02] transition-all duration-700"
      >
        <div class="relative mb-8 flex items-center justify-center w-56 h-56 group/idle">
          <!-- Glassy backdrop for the static image -->
          <div class="absolute inset-0 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 shadow-xl transition-all duration-700 group-hover/idle:shadow-primary-500/20 group-hover/idle:scale-110"></div>
          
          <!-- Static representation of the AI core -->
          <div class="relative w-48 h-48 overflow-hidden rounded-full shadow-inner">
             <!-- We use the video with autoplay=false and a specific time, 
                  or just show the icon if no static image is provided yet. 
                  Given the request, I'll use the video as a static frame if possible, 
                  or an overlay with an icon if the video isn't loaded. -->
             <video
                src="/video/ai-loader.mp4"
                class="w-full h-full object-cover opacity-40 grayscale group-hover/idle:grayscale-0 group-hover/idle:opacity-70 transition-all duration-700"
                preload="metadata"
              ></video>
          </div>
        </div>

        <h3 class="text-neutral-900 dark:text-neutral-100 font-black text-2xl tracking-tight mb-3 uppercase drop-shadow-sm">
          Awaiting Inspiration
        </h3>
        <p class="text-neutral-500 dark:text-neutral-400 text-sm max-w-[320px] leading-relaxed font-medium">
          Upload your images and define the prompt to start the neural rendering process.
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Real Water Orb Complex Animation */
.water-orb-container {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(2, 132, 199, 0.2);
  transform: translateZ(0); 
}

.dark .water-orb-container {
  background: linear-gradient(180deg, #0f172a 0%, #082f49 100%);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.water-wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  border-radius: 40%;
  animation: spin-wave 6s linear infinite;
  transform-origin: 50% 50%;
}

.wave1 {
  background: rgba(125, 211, 252, 0.8);
  animation-duration: 5s;
  border-radius: 42%;
}
.dark .wave1 {
  background: rgba(14, 165, 233, 0.5);
}

.wave2 {
  background: rgba(167, 139, 250, 0.6); /* tinted slightly purple like reference */
  animation-duration: 7s;
  animation-direction: reverse;
  border-radius: 45%;
}
.dark .wave2 {
  background: rgba(124, 58, 237, 0.4);
}

.wave3 {
  background: rgba(56, 189, 248, 0.8);
  animation-duration: 6s;
  border-radius: 38%;
}
.dark .wave3 {
  background: rgba(2, 132, 199, 0.8);
}

@keyframes spin-wave {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.glass-highlight-top {
  position: absolute;
  top: 5%;
  left: 15%;
  width: 70%;
  height: 30%;
  background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%);
  border-radius: 50%;
  pointer-events: none;
}
.dark .glass-highlight-top {
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
}

.glass-highlight-bottom {
  position: absolute;
  bottom: 5%;
  left: 20%;
  width: 60%;
  height: 20%;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(2px);
}

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
