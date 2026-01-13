<script setup lang="ts">
import { storeToRefs } from "pinia";

const simpleStore = useSimplePresetStore();
const { presets, isLoading } = storeToRefs(simpleStore);

const searchQuery = ref("");
const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);
const isWaitingForImages = ref(true);

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
  <div class="w-full py-4 space-y-6">
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-2.5">
        <div
          class="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
        ></div>
        <h3
          class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
        >
          Style Assets
        </h3>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="FIND STYLE..."
            class="bg-white/[0.03] border border-white/5 rounded-full px-5 py-2 text-[8px] text-white outline-none focus:border-blue-500/30 w-32 sm:w-48 transition-all duration-500 font-bold tracking-widest"
          />
        </div>
        <button
          @click="showCreateDialog = true"
          class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
        >
          <Icon name="lucide:plus" size="18" />
        </button>
      </div>
    </div>

    <div
      class="flex overflow-x-auto gap-5 px-2 pb-6 no-scrollbar snap-x snap-mandatory min-h-[230px]"
    >
      <template v-if="isLoading || isWaitingForImages">
        <div
          v-for="i in 4"
          :key="i"
          class="flex-none w-[140px] h-[220px] rounded-[32px] bg-white/[0.02] border border-white/5 animate-pulse relative overflow-hidden"
        >
          <div class="absolute inset-0 shimmer-effect"></div>
        </div>
      </template>

      <template v-else>
        <TransitionGroup name="card-anim" tag="div" class="flex gap-5">
          <PromptBuilderPresetSimpleCard
            v-for="item in filteredPresets"
            :key="item.id"
            :item="item"
            @select="selectedPreset = item"
          />
        </TransitionGroup>

        <div
          v-if="filteredPresets.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-20 opacity-20"
        >
          <Icon name="lucide:layers-2" size="40" class="mb-2" />
          <p class="text-[9px] font-black uppercase tracking-widest">
            Repository Empty
          </p>
        </div>
      </template>
    </div>

    <PromptBuilderPresetSimpleCreateModal v-model="showCreateDialog" />
    <PromptBuilderPresetSimpleDetailModal v-model="selectedPreset" />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.card-anim-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-anim-enter-from {
  opacity: 0;
  transform: scale(0.9) translateX(30px);
}
.shimmer-effect {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
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
