<script setup lang="ts">
import { useGalleryStore } from "~/stores/common/ui/gallery-store";
import type { SimplePreset } from "~/types";
import CommonMenuLongPressContext from "~/components/common/menu/LongPressContext.vue";

definePageMeta({ layout: "default" });

// --- 1. INIT STORES & REFS ---
const galleryStore = useGalleryStore();
const simpleStore = useSimplePresetStore();
const toast = useToast();

const menuRef = ref<InstanceType<typeof CommonMenuLongPressContext> | null>(
  null
);
const activeTab = ref<"session" | "favorites" | "presets">("session");
const isPrivacyMode = ref(true); // Trạng thái Privacy Mode

// --- 2. CONFIG ---
const tabs = [
  { id: "session", label: "Session", icon: "lucide:layers" },
  { id: "favorites", label: "Favorites", icon: "lucide:heart" },
  { id: "presets", label: "Presets", icon: "lucide:zap" },
] as const;

// Action IDs (Phải khớp thứ tự với Component Menu)
const sessionActionIds = ["save", "preset", "cloud"];
const presetActionIds = ["cloud", "delete"];

// Computed: Chọn list ID dựa trên Tab hiện tại
const currentActionIds = computed(() => {
  if (activeTab.value === "presets") return presetActionIds;
  return sessionActionIds;
});

// --- 3. DATA ADAPTER ---
interface GalleryViewItem extends SimplePreset {
  isFavorite: boolean;
  type: "session" | "preset";
  originalData: any;
}

const displayedItems = computed<GalleryViewItem[]>(() => {
  if (activeTab.value === "presets") {
    // Mapping Presets
    return (simpleStore.presets || []).map((p: SimplePreset) => ({
      ...p,
      isFavorite: false,
      type: "preset",
      originalData: p,
    }));
  } else {
    // Mapping Session Items
    let items = galleryStore.items;
    if (activeTab.value === "favorites") {
      items = items.filter((i: any) => i.isFavorite);
    }
    return items.map((i: any) => ({
      id: i.id,
      user_id: "current_user",
      title: "Generated Image",
      thumbnail: i.url, // Map URL sang thumbnail
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

// --- 4. TOUCH LOGIC ---
const {
  isHolding,
  anchorX,
  anchorY,
  activeActionId,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} = useTouchMenu();

const currentHoldingItem = ref<GalleryViewItem | null>(null);

const handleTouchMove = (e: TouchEvent) => {
  // Lấy góc bắt đầu từ Visual Component
  const angle = menuRef.value?.getStartAngle?.() ?? -150;
  // Truyền danh sách ID động vào logic xử lý
  onTouchMove(e, angle, currentActionIds.value);
};

const handleTouchEndAction = async () => {
  const selectedType = onTouchEnd();

  if (selectedType && currentHoldingItem.value) {
    const viewItem = currentHoldingItem.value;
    const rawItem = viewItem.originalData;

    switch (selectedType) {
      case "preset":
        simpleStore.savePreset({
          title: `Style ${new Date().getTime().toString().slice(-4)}`,
          prompt: viewItem.prompt,
          thumbnail: viewItem.thumbnail,
        });
        toast.success("Saved to Presets!");
        break;

      case "save":
        if (viewItem.type === "session") {
          rawItem.isFavorite = !rawItem.isFavorite;
          toast.success(
            rawItem.isFavorite ? "Added to Favorites" : "Removed from Favorites"
          );
        }
        break;

      case "cloud":
        toast.info("Upload feature coming soon");
        break;

      case "delete":
        if (viewItem.type === "preset") {
          await simpleStore.deletePreset(viewItem.id);
          toast.success("Preset deleted");
        }
        break;
    }
  }
  currentHoldingItem.value = null;
};
</script>

<template>
  <div class="space-y-6 pb-32 select-none touch-none min-h-screen">
    <header class="px-4 pt-4 animate-fade-in-down space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-black uppercase text-white">Library</h1>
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
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            "
          >
            <Icon
              :name="isPrivacyMode ? 'lucide:eye-off' : 'lucide:eye'"
              size="14"
            />
          </button>

          <div class="px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span class="text-[10px] font-bold text-blue-500">
              {{ displayedItems.length }} ITEMS
            </span>
          </div>
        </div>
      </div>

      <div
        class="p-1 bg-white/5 rounded-2xl border border-white/5 flex relative"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative z-10"
          :class="
            activeTab === tab.id
              ? 'bg-white text-black shadow-lg scale-100'
              : 'text-gray-500 hover:text-white hover:bg-white/5'
          "
        >
          <Icon :name="tab.icon" size="14" /> {{ tab.label }}
        </button>
      </div>
    </header>

    <div
      :key="activeTab"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4"
    >
      <div
        v-if="displayedItems.length === 0"
        class="col-span-full py-20 flex flex-col items-center justify-center opacity-40"
      >
        <Icon name="lucide:box" size="40" class="mb-4 text-white/20" />
        <p class="text-[10px] uppercase tracking-widest text-white/40">
          No items found in {{ activeTab }}
        </p>
      </div>

      <div
        v-for="(item, index) in displayedItems"
        :key="item.id"
        class="relative aspect-[3/4] card-entry-animation"
        :style="{
          '--i': index,
          zIndex: isHolding && currentHoldingItem?.id === item.id ? 1500 : 0,
        }"
      >
        <div
          class="w-full h-full rounded-[2rem] overflow-hidden border border-white/5 bg-[#0d0d0d] transition-all will-change-transform relative"
          :style="{
            transitionDuration:
              isHolding && currentHoldingItem?.id === item.id ? '0.6s' : '0.4s',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }"
          :class="[
            isHolding && currentHoldingItem?.id === item.id
              ? 'scale-110 brightness-110 shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-2 ring-blue-500/50 -rotate-[8deg]'
              : 'hover:border-blue-500/30',
          ]"
          @touchstart="onTouchStart($event, () => (currentHoldingItem = item))"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEndAction"
        >
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            class="w-full h-full object-cover pointer-events-none transition-all duration-500"
            :class="{
              'blur-xl scale-110 opacity-50':
                isPrivacyMode &&
                !(isHolding && currentHoldingItem?.id === item.id),
            }"
            loading="lazy"
          />
          <div
            v-else
            class="w-full h-full bg-white/5 flex items-center justify-center"
          >
            <Icon name="lucide:image-off" size="24" class="text-white/20" />
          </div>

          <div
            v-if="
              isPrivacyMode &&
              !(isHolding && currentHoldingItem?.id === item.id)
            "
            class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in"
          >
            <Icon name="lucide:lock" size="24" class="text-white/30" />
          </div>

          <template
            v-if="
              !isPrivacyMode ||
              (isHolding && currentHoldingItem?.id === item.id)
            "
          >
            <div
              v-if="item.isFavorite"
              class="absolute top-4 right-4 z-20 animate-fade-in"
            >
              <div
                class="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg"
              >
                <Icon
                  name="lucide:heart"
                  size="14"
                  class="text-red-500 fill-red-500"
                />
              </div>
            </div>

            <div
              v-if="item.type === 'preset'"
              class="absolute bottom-4 left-4 z-20 animate-fade-in"
            >
              <div
                class="flex px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md border border-white/10 shadow-lg"
              >
                <span
                  class="text-[8px] font-black text-white uppercase tracking-widest"
                  >PRESET</span
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <CommonMenuLongPressContext
      ref="menuRef"
      :show="isHolding"
      :anchor-x="anchorX"
      :anchor-y="anchorY"
      :active-id="activeActionId"
      :current-tab="activeTab"
    />
  </div>
</template>

<style scoped>
/* Utility */
.select-none {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
.touch-none {
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
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
