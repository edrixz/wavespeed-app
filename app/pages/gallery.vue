<script setup lang="ts">
import { useGalleryStore } from "~/stores/common/ui/gallery-store";
import type { PromptPreset } from "~/types";

definePageMeta({ layout: "default" });

// --- 1. INIT STORES & REFS ---
const galleryStore = useGalleryStore();
const promptPreset = useSeedreamPromptPresetStore();
const toast = useSystemToast();

const activeTab = ref<"session" | "favorites" | "presets">("session");
const isPrivacyMode = ref(true);

// --- 2. CONFIG ---
const tabs = [
  { id: "session", label: "Session", icon: "lucide:layers" },
  { id: "favorites", label: "Favorites", icon: "lucide:heart" },
  { id: "presets", label: "Presets", icon: "lucide:zap" },
] as const;

// --- 3. DATA ADAPTER ---
interface GalleryViewItem extends PromptPreset {
  isFavorite: boolean;
  type: "session" | "preset";
  originalData: any;
}

const displayedItems = computed<GalleryViewItem[]>(() => {
  if (activeTab.value === "presets") {
    return (promptPreset.promptPresets || []).map((p: PromptPreset) => ({
      ...p,
      isFavorite: false,
      type: "preset",
      originalData: p,
    }));
  } else {
    let items = galleryStore.items;
    if (activeTab.value === "favorites") {
      items = items.filter((i: any) => i.isFavorite);
    }
    return items.map((i: any) => ({
      id: i.id,
      user_id: "current_user",
      title: "Generated Image",
      thumbnail: i.url,
      prompt: i.config?.prompt || "",
      negative_prompt: i.config?.negative_prompt || null,
      size: i.config?.size || null,
      created_at: new Date(i.timestamp).toISOString(),
      isFavorite: i.isFavorite || false,
      type: "session",
      originalData: i,
    }));
  }
});

// --- 4. CARD ACTIONS ---
/** Handle action button clicks on each card */
const handleAction = async (action: string, item: GalleryViewItem) => {
  const rawItem = item.originalData;

  switch (action) {
    case "preset":
      promptPreset.savePreset({
        title: `Style ${new Date().getTime().toString().slice(-4)}`,
        prompt: item.prompt,
        thumbnail: item.thumbnail,
      });
      toast.success("Saved to Presets!");
      break;

    case "save":
      if (item.type === "session") {
        rawItem.isFavorite = !rawItem.isFavorite;
        toast.success(
          rawItem.isFavorite ? "Added to Favorites" : "Removed from Favorites",
        );
      }
      break;

    case "cloud":
      toast.info("Upload feature coming soon");
      break;

    case "delete":
      if (item.type === "preset") {
        await promptPreset.deletePreset(item.id);
        toast.success("Preset deleted");
      }
      break;
  }
};

/** Action buttons definition per tab */
type CardAction = {
  id: string;
  icon: string;
  label: string;
  variant: "default" | "danger" | "accent";
};

const sessionActions: CardAction[] = [
  { id: "save", icon: "lucide:heart", label: "Favorite", variant: "default" },
  { id: "preset", icon: "lucide:bookmark-plus", label: "Preset", variant: "accent" },
  { id: "cloud", icon: "lucide:cloud-upload", label: "Upload", variant: "default" },
];

const presetActions: CardAction[] = [
  { id: "cloud", icon: "lucide:cloud-upload", label: "Upload", variant: "default" },
  { id: "delete", icon: "lucide:trash-2", label: "Delete", variant: "danger" },
];

const currentActions = computed<CardAction[]>(() =>
  activeTab.value === "presets" ? presetActions : sessionActions,
);
</script>

<template>
  <div class="select-none min-h-screen pb-32">
    <header class="px-4 pt-4 animate-fade-in-down space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-black uppercase text-neutral-900 dark:text-white">Library</h1>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Your Creative Assets
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="isPrivacyMode = !isPrivacyMode"
            class="w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-90"
            :class="
              isPrivacyMode
                ? 'bg-blue-500 border-blue-400 text-white'
                : 'bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            "
          >
            <Icon :name="isPrivacyMode ? 'lucide:eye-off' : 'lucide:eye'" size="14" />
          </button>

          <div class="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
            <span class="text-[10px] font-bold text-blue-500">
              {{ displayedItems.length }} ITEMS
            </span>
          </div>
        </div>
      </div>

      <div
        class="p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex relative"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative z-10"
          :class="
            activeTab === tab.id
              ? 'bg-white dark:bg-white text-black shadow-lg scale-100'
              : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          "
        >
          <Icon :name="tab.icon" size="14" /> {{ tab.label }}
        </button>
      </div>
    </header>

    <div
      :key="activeTab"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 mt-6"
    >
      <!-- Empty state -->
      <div
        v-if="displayedItems.length === 0"
        class="col-span-full py-20 flex flex-col items-center justify-center opacity-40"
      >
        <Icon name="lucide:box" size="40" class="mb-4 text-gray-300 dark:text-white/20" />
        <p class="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/40">
          No items found in {{ activeTab }}
        </p>
      </div>

      <!-- Gallery cards -->
      <div
        v-for="(item, index) in displayedItems"
        :key="item.id"
        class="relative card-entry-animation"
        :style="{ '--i': index }"
      >
        <!-- Card -->
        <div
          class="w-full aspect-3/4 rounded-4xl overflow-hidden border border-black/10 dark:border-white/5 bg-neutral-100 dark:bg-[#0d0d0d] relative group"
        >
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            class="w-full h-full object-cover pointer-events-none transition-all duration-500"
            :class="{
              'blur-xl scale-110 opacity-50': isPrivacyMode,
            }"
            loading="lazy"
          />
          <div
            v-else
            class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center"
          >
            <Icon name="lucide:image-off" size="24" class="text-gray-300 dark:text-white/20" />
          </div>

          <!-- Privacy overlay -->
          <div
            v-if="isPrivacyMode"
            class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in"
          >
            <Icon name="lucide:lock" size="24" class="text-gray-400 dark:text-white/30" />
          </div>

          <!-- Action buttons overlay — Transition + v-show: icon stays in DOM (no flicker), CSS handles animation -->
          <Transition name="btn-overlay">
            <div
              v-show="!isPrivacyMode"
              class="absolute bottom-0 inset-x-0 z-20 pt-10 pb-2.5 px-2.5 flex gap-2 bg-linear-to-t from-black/35 via-black/15 to-transparent"
            >
              <button
                v-for="action in currentActions"
                :key="action.id"
                @click="handleAction(action.id, item)"
                class="relative flex-1 flex items-center justify-center py-2.5 rounded-2xl border backdrop-blur-sm transition-all duration-200 active:scale-90"
                :class="[
                  action.id === 'save' && item.isFavorite
                    ? 'bg-red-500/40 border-red-400/50 text-white hover:bg-red-500/60'
                    : action.variant === 'danger'
                      ? 'bg-red-500/30 border-red-400/40 text-red-300 hover:bg-red-500/50'
                      : action.variant === 'accent'
                        ? 'bg-blue-500/30 border-blue-400/40 text-blue-200 hover:bg-blue-500/50'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                ]"
                :title="action.label"
              >
                <Icon :name="action.icon" size="15" />
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Prevent text selection but keep scrolling */
.select-none {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* Action buttons overlay transition (Transition + v-show) */
.btn-overlay-enter-active,
.btn-overlay-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.btn-overlay-enter-from,
.btn-overlay-leave-to {
  opacity: 0 !important;
  transform: translateY(10px) !important;
}

/* Stagger Animation */
@keyframes fadeInUpStagger {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.card-entry-animation {
  opacity: 0;
  animation: fadeInUpStagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i) * 0.05s);
}

/* Header Animation */
.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade In Utility */
.animate-fade-in {
  animation: fadeIn 0.3s ease forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
