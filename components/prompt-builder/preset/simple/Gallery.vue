<script setup lang="ts">
import { storeToRefs } from "pinia";

const simpleStore = useSimplePresetStore();
const { presets, isLoading } = storeToRefs(simpleStore);

const searchQuery = ref("");
const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);
const isWaitingForImages = ref(true);
const isSearchFocused = ref(false);

const filteredPresets = computed(() => {
  if (!searchQuery.value.trim()) return presets.value;
  const q = searchQuery.value.toLowerCase();
  return presets.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
  );
});

onMounted(async () => {
  isWaitingForImages.value = true;
  await simpleStore.fetchPresets();
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
            <h2 class="text-2xl font-black text-white tracking-tight">
              Style Assets
            </h2>
            <div
              class="p-2 rounded bg-[#1A1A1A] border border-white/10 text-[10px] font-bold text-gray-400"
            >
              {{ presets.length }}
            </div>
          </div>

          <button
            @click="showCreateDialog = true"
            class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all duration-200 border border-white/5"
          >
            <Icon name="lucide:plus" size="18" />
          </button>
        </div>

        <h3
          class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1"
        >
          Library
        </h3>
      </div>

      <div class="flex items-center justify-between gap-3">
        <div class="relative group transition-all duration-300 w-full">
          <div
            class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
          >
            <Icon
              name="lucide:search"
              size="12"
              class="transition-colors duration-300"
              :class="isSearchFocused ? 'text-white' : 'text-gray-500'"
            />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            class="w-full bg-[#1A1A1A] hover:bg-[#252525] focus:bg-[#0A0A0A] border border-white/5 focus:border-white/20 rounded-lg py-2.5 pl-9 pr-4 text-[11px] text-white placeholder-gray-600 outline-none transition-all duration-300"
          />
        </div>
      </div>
    </div>

    <div class="relative w-full">
      <div
        class="flex overflow-x-auto gap-4 px-6 pb-4 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth min-h-[240px] items-start"
      >
        <template v-if="isLoading || isWaitingForImages">
          <div
            v-for="i in 5"
            :key="i"
            class="flex-none w-[150px] aspect-[3/4] rounded-2xl bg-[#121212] border border-white/5 relative overflow-hidden snap-start"
          >
            <div class="absolute inset-0 shimmer-flat"></div>
          </div>
        </template>

        <template v-else>
          <TransitionGroup name="list" tag="div" class="flex gap-4">
            <div
              v-for="(item, index) in filteredPresets"
              :key="item.id"
              class="snap-start flex-none transition-all duration-500"
              :style="{ transitionDelay: `${index * 30}ms` }"
            >
              <div class="w-[150px] h-full group">
                <PromptBuilderPresetSimpleCard
                  :item="item"
                  @select="selectedPreset = item"
                />
              </div>
            </div>
          </TransitionGroup>

          <div
            v-if="filteredPresets.length === 0"
            class="w-full flex flex-col items-center justify-center py-10 opacity-40 gap-3 min-w-[300px]"
          >
            <div
              class="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center"
            >
              <Icon name="lucide:search" size="20" class="text-gray-500" />
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

    <PromptBuilderPresetSimpleCreateModal v-model="showCreateDialog" />
    <PromptBuilderPresetSimpleDetailModal v-model="selectedPreset" />
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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.list-leave-active {
  position: absolute;
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
