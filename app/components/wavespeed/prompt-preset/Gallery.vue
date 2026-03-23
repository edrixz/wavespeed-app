<script setup lang="ts">
import { storeToRefs } from "pinia";
import { refDebounced, useScroll } from "@vueuse/core";

const promptPresetStore = useSeedreamPromptPresetStore();
const { promptPresets, isLoading, hasMore, isFetchingMore } = storeToRefs(promptPresetStore);

const searchQuery = ref("");
const debouncedSearchQuery = refDebounced(searchQuery, 50);

const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);
const isWaitingForImages = ref(true);
const isSearchFocused = ref(false);
const isGlobalBlurVisible = ref(false);

const sortOptions = [
  { value: "newest", label: "Newest Defaults", icon: "lucide:clock" },
  { value: "rating", label: "Rating", icon: "lucide:star" },
  { value: "usage", label: "Usage", icon: "lucide:flame" },
] as const;

type SortValue = typeof sortOptions[number]["value"];
const sortBy = ref<SortValue>("newest");
const sortDirection = ref<"desc" | "asc">("desc");

const handleSortSelect = (val: SortValue) => {
  if (sortBy.value === val && val !== "newest") {
    sortDirection.value = sortDirection.value === "desc" ? "asc" : "desc";
  } else {
    sortBy.value = val;
    sortDirection.value = "desc";
  }
};
const currentSortOption = computed(() => {
  const matching = sortOptions.find(o => o.value === sortBy.value);
  return matching ? matching : sortOptions[0];
});

const filterRating = ref("all");
const ratingFilterLabel = computed(() => {
  if (filterRating.value === "all") return "All Ratings";
  return `${filterRating.value} Stars`;
});

const filterUsageMin = ref(0);
const filterUsageMax = ref(1000);

const handleSaveRating = async ({ id, rating }: { id: string; rating: number }) => {
  await promptPresetStore.updatePresetRating(id, rating);
};

const filteredStyleAssets = computed(() => {
  let result = promptPresets.value;

  // 1. Search filter
  if (debouncedSearchQuery.value.trim()) {
    const q = debouncedSearchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
    );
  }

  // 2. Rating filter
  if (filterRating.value !== "all") {
    const ratingTarget = parseInt(filterRating.value);
    result = result.filter(p => (p.rating || 0) === ratingTarget);
  }

  // 3. Usage filter
  result = result.filter(p => {
    const usage = p.usage_count || 0;
    return usage >= filterUsageMin.value && usage <= filterUsageMax.value;
  });

  // 4. Sort
  result = [...result].sort((a, b) => {
    if (sortBy.value === 'rating') {
      const diff = (b.rating || 0) - (a.rating || 0);
      if (diff !== 0) return sortDirection.value === 'desc' ? diff : -diff;
    } else if (sortBy.value === 'usage') {
      const diff = (b.usage_count || 0) - (a.usage_count || 0);
      if (diff !== 0) return sortDirection.value === 'desc' ? diff : -diff;
    }
    // Newest is default or fallback
    const getTimestamp = (d: string | null) => d ? new Date(d).getTime() : 0;
    return getTimestamp(b.created_at) - getTimestamp(a.created_at);
  });

  return result;
});

const listContainerRef = ref<HTMLElement | null>(null);
const { arrivedState } = useScroll(listContainerRef, { offset: { right: 300 } });

watch(() => arrivedState.right, (isRight) => {
  if (isRight && hasMore.value && !isFetchingMore.value) {
    promptPresetStore.fetchPreset(false);
  }
});

watch([sortBy, sortDirection, filterRating, filterUsageMin, filterUsageMax], () => {
  if (listContainerRef.value) {
    listContainerRef.value.scrollTo({ left: 0, behavior: 'smooth' });
  }
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
    <div class="flex flex-col gap-4">
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

      <div class="flex items-center justify-between gap-3 flex-col sm:flex-row sm:items-center">
        <div class="relative group transition-all w-full md:max-w-xs shrink-0">
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

        <!-- Filters & Sorting using Custom Popovers -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 shrink-0">
          <PartsDropdownPopover placement="bottom-start" :closeOnClick="true" contentClass="w-56 p-1">
            <template #trigger="{ isOpen }">
              <button class="bg-white/50 hover:bg-white/80 dark:bg-[#1A1A1A]/50 dark:hover:bg-[#1A1A1A]/80 border border-neutral-200/60 dark:border-white/5 rounded-2xl px-3 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white outline-none transition-all flex items-center gap-2 whitespace-nowrap">
                <Icon :name="currentSortOption.icon" size="14" class="opacity-70" />
                <span class="truncate max-w-[100px]">{{ currentSortOption.label }}</span>
                <Icon v-if="sortBy !== 'newest'" :name="sortDirection === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up'" size="12" class="opacity-50" />
                <Icon name="lucide:chevron-down" size="12" :class="{ 'rotate-180': isOpen }" class="transition-transform opacity-50 ml-1" />
              </button>
            </template>
            <template #content>
              <button v-for="opt in sortOptions" :key="opt.value" @click="handleSortSelect(opt.value)"
                      class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-between transition-colors text-neutral-800 dark:text-neutral-200 group">
                 <div class="flex items-center gap-2">
                    <Icon :name="opt.icon" size="14" class="opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span class="font-medium">{{ opt.label }}</span>
                 </div>
                 <div class="flex items-center gap-1" v-if="sortBy === opt.value">
                   <Icon v-if="opt.value !== 'newest'" :name="sortDirection === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up'" size="14" class="text-blue-500" />
                   <Icon v-else name="lucide:check" size="14" class="text-blue-500" />
                 </div>
              </button>
            </template>
          </PartsDropdownPopover>

          <!-- Rating Popover -->
          <PartsDropdownPopover placement="bottom-start" :closeOnClick="true" contentClass="w-48 p-1">
            <template #trigger="{ isOpen }">
              <button class="bg-white/50 hover:bg-white/80 dark:bg-[#1A1A1A]/50 dark:hover:bg-[#1A1A1A]/80 border border-neutral-200/60 dark:border-white/5 rounded-2xl px-3 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white outline-none transition-all flex items-center gap-2 whitespace-nowrap">
                <Icon name="lucide:star" size="14" class="opacity-70" :class="{'text-yellow-400 opacity-100': filterRating !== 'all'}" />
                <span>{{ ratingFilterLabel }}</span>
                <Icon name="lucide:chevron-down" size="12" :class="{ 'rotate-180': isOpen }" class="transition-transform opacity-50" />
              </button>
            </template>
            <template #content>
               <button @click="filterRating = 'all'"
                       class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 flex justify-between items-center transition-colors text-neutral-800 dark:text-neutral-200 mb-1">
                  <span class="font-medium">All Ratings</span>
                  <Icon v-if="filterRating === 'all'" name="lucide:check" size="14" class="text-blue-500" />
               </button>
               <button v-for="i in 5" :key="i" @click="filterRating = String(6 - i)" 
                       class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 flex justify-between items-center transition-colors text-neutral-800 dark:text-neutral-200">
                  <div class="flex gap-0.5 text-yellow-400">
                     <Icon v-for="j in (6 - i)" :key="j" name="lucide:star" size="14" class="fill-current" />
                  </div>
                  <Icon v-if="filterRating === String(6 - i)" name="lucide:check" size="14" class="text-blue-500" />
               </button>
            </template>
          </PartsDropdownPopover>
          
          <!-- Usage Range Popover -->
          <PartsDropdownPopover placement="bottom-end" :closeOnClick="false" contentClass="w-64 p-4 flex flex-col gap-3">
            <template #trigger="{ isOpen }">
              <button class="bg-white/50 hover:bg-white/80 dark:bg-[#1A1A1A]/50 dark:hover:bg-[#1A1A1A]/80 border border-neutral-200/60 dark:border-white/5 rounded-2xl px-3 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white outline-none transition-all flex items-center gap-2 whitespace-nowrap">
                <Icon name="lucide:flame" size="14" class="opacity-70" :class="{'text-orange-400 opacity-100': filterUsageMin > 0 || filterUsageMax < 1000}" />
                <span>{{ filterUsageMin }} - {{ filterUsageMax }} Uses</span>
                <Icon name="lucide:settings-2" size="12" class="opacity-50" />
              </button>
            </template>
            <template #content="{ close }">
               <h4 class="text-xs font-bold text-neutral-500 dark:text-gray-400 uppercase tracking-widest">Usage Range Filter</h4>
               <div class="flex items-center gap-3">
                  <div class="flex flex-col gap-1 w-full">
                     <label class="text-[10px] opacity-70 font-semibold uppercase tracking-wider">Min</label>
                     <input type="number" min="0" v-model="filterUsageMin" class="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#2A2A2A] transition-all" />
                  </div>
                  <span class="text-xs opacity-50 mt-4">-</span>
                  <div class="flex flex-col gap-1 w-full">
                     <label class="text-[10px] opacity-70 font-semibold uppercase tracking-wider">Max</label>
                     <input type="number" :min="filterUsageMin" v-model="filterUsageMax" class="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#2A2A2A] transition-all" />
                  </div>
               </div>
               <div class="flex justify-end mt-1">
                  <button @click="close" class="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-500 font-medium active:scale-95 transition-transform shadow-md">Apply View</button>
               </div>
            </template>
          </PartsDropdownPopover>
        </div>
      </div>
    </div>

    <div class="relative w-full">
      <div
        ref="listContainerRef"
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
                  @save-rating="handleSaveRating"
                />
              </div>
            </div>
            
            <!-- Loading indicator for infinite scroll -->
            <div
              v-if="isFetchingMore"
              key="loading-more"
              class="w-50 sm:w-60 aspect-3/4 flex-none rounded-4xl bg-black/5 dark:bg-[#121212] border border-black/5 dark:border-white/5 relative overflow-hidden flex items-center justify-center snap-start"
            >
              <Icon name="lucide:loader-2" class="animate-spin text-neutral-400 dark:text-neutral-500" size="28" />
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
