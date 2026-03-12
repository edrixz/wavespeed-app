<script setup lang="ts">
import { storeToRefs } from "pinia";
import { refDebounced } from "@vueuse/core";

const promptPresetStore = useSeedreamPromptPresetStore();
const { promptPresets, isLoading } = storeToRefs(promptPresetStore);

const searchQuery = ref("");
const debouncedSearchQuery = refDebounced(searchQuery, 50);

const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);
const isWaitingForImages = ref(true);
const isSearchFocused = ref(false);
const isGlobalBlurVisible = ref(false);

const filteredStyleAssets = computed(() => {
  if (!debouncedSearchQuery.value.trim()) return promptPresets.value;
  const q = debouncedSearchQuery.value.toLowerCase();
  return promptPresets.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q),
  );
});

onMounted(async () => {
  isWaitingForImages.value = true;
  await promptPresetStore.fetchPreset();
  setTimeout(() => {
    isWaitingForImages.value = false;
  }, 800);
});
</script>

<template>
  <div class="w-full space-y-2">
    <div class="grid grid-rows-2">
      <div class="flex flex-col justify-between">
        <div class="flex items-center justify-between gap-3 w-full">
          <div class="flex items-center gap-3">
            <h2
              class="text-2xl font-black text-neutral-900 dark:text-white tracking-tight"
            >
              Prompt Presets
            </h2>
            <div
              class="p-2 rounded bg-black/5 dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 text-[10px] font-bold text-gray-500 dark:text-gray-400"
            >
              {{ promptPresets.length }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Global Blur Toggle Button -->
            <button
              @click="isGlobalBlurVisible = !isGlobalBlurVisible"
              class="w-9 h-9 rounded-full bg-black/5 dark:bg-[#1A1A1A] border border-black/10 dark:border-white/5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-all duration-200"
              :title="
                isGlobalBlurVisible
                  ? 'Hide original images'
                  : 'Show original images'
              "
            >
              <Icon
                :name="isGlobalBlurVisible ? 'lucide:eye' : 'lucide:eye-off'"
                size="16"
              />
            </button>

            <button
              @click="showCreateDialog = true"
              class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all duration-200 border border-black/5 dark:border-white/5 shadow-md"
            >
              <Icon name="lucide:plus" size="18" />
            </button>
          </div>
        </div>

        <h3
          class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1"
        >
          Library
        </h3>
      </div>

      <div class="flex items-center justify-between gap-3">
        <div class="relative group transition-all w-full md:max-w-xs">
          <div
            class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
          >
            <Icon
              name="lucide:search"
              size="14"
              class="text-neutral-400 group-focus-within:text-neutral-700 dark:text-gray-500 dark:group-focus-within:text-gray-300 transition-colors"
            />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search collections..."
            class="w-full bg-white/50 hover:bg-white/80 focus:bg-white dark:bg-[#1A1A1A]/50 dark:hover:bg-[#1A1A1A]/80 dark:focus:bg-[#1A1A1A] border border-neutral-200/60 focus:border-neutral-300 dark:border-white/5 dark:focus:border-white/10 rounded-2xl py-2 pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-600 outline-none transition-all duration-300 backdrop-blur-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <Icon name="lucide:x" size="14" />
          </button>
        </div>
      </div>
    </div>

    <div class="relative w-full">
      <div
        class="flex overflow-x-auto gap-4 px-6 pb-4 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth min-h-60 items-start"
      >
        <template v-if="isLoading || isWaitingForImages">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-none w-50 sm:w-60 aspect-3/4 rounded-4xl bg-black/5 dark:bg-[#121212] border border-black/5 dark:border-white/5 relative overflow-hidden snap-start"
          >
            <div
              class="absolute inset-0 shimmer-flat dark:opacity-100 opacity-50"
            ></div>
          </div>
        </template>

        <template v-else>
          <TransitionGroup name="fade-scale" tag="div" class="flex gap-4">
            <div
              v-for="(item, index) in filteredStyleAssets"
              :key="item.id"
              class="snap-start flex-none"
              :style="{ animationDelay: `${Math.min(index * 30, 300)}ms` }"
            >
              <div class="w-50 sm:w-60 aspect-3/4 group">
                <PartsCard
                  :item="item"
                  :is-visible="isGlobalBlurVisible"
                  @select="selectedPreset = item"
                  @toggle-visibility="
                    isGlobalBlurVisible = !isGlobalBlurVisible
                  "
                />
              </div>
            </div>
          </TransitionGroup>

          <div
            v-if="filteredStyleAssets.length === 0"
            class="w-full flex flex-col items-center justify-center py-10 opacity-40 gap-3 min-w-75"
          >
            <div
              class="w-12 h-12 rounded-xl bg-black/5 dark:bg-[#1A1A1A] border border-black/10 dark:border-white/5 flex items-center justify-center"
            >
              <Icon
                name="lucide:search"
                size="20"
                class="text-gray-400 dark:text-gray-500"
              />
            </div>
            <p
              class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
            >
              No results
            </p>
          </div>
        </template>
      </div>
    </div>

    <WavespeedPromptPresetCreateModal v-model="showCreateDialog" />
    <WavespeedPromptPresetDetailModal v-model="selectedPreset" />
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

/* Custom minimal entry animation */
.fade-scale-enter-active {
  animation: fadeScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
/* No leave animation to prevent lag */
.fade-scale-leave-active,
.fade-scale-move {
  display: none !important;
  opacity: 0;
  transition: none;
}

@keyframes fadeScaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Shimmer phẳng, không màu mè */
.shimmer-flat {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
