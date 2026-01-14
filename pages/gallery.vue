<script setup lang="ts">
import { useGalleryStore } from "~/stores/common/ui/gallery-store";

definePageMeta({ layout: "default" });

const galleryStore = useGalleryStore();
const simpleStore = useSimplePresetStore();
const toast = useToast();
const menuRef = ref();

const {
  isHolding,
  anchorX,
  anchorY,
  activeActionId,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} = useTouchMenu();

const currentHoldingItem = ref<any | null>(null);

const handleTouchMove = (e: TouchEvent) => {
  const angle = menuRef.value?.getStartAngle() || -150;
  onTouchMove(e, angle);
};

const handleTouchEndAction = () => {
  const selectedType = onTouchEnd();
  if (selectedType && currentHoldingItem.value) {
    if (selectedType === "preset") {
      simpleStore.savePreset({
        title: `Style ${new Date().getMilliseconds()}`,
        prompt: currentHoldingItem.value.config.prompt,
        thumbnail: currentHoldingItem.value.url,
        negative_prompt: "",
        size: "",
      });
      toast.success("Saved to Presets!");
    }
  }
  currentHoldingItem.value = null;
};
</script>

<template>
  <div class="space-y-8 pb-32 select-none touch-none min-h-screen relative">
    <header class="px-4">
      <h1 class="text-2xl font-black uppercase text-white">Session History</h1>
      <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
        Temporary neural link
      </p>
    </header>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 px-4">
      <div
        v-for="item in galleryStore.items"
        :key="item.id"
        class="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0d0d0d] transition-all"
        :style="{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDuration:
            isHolding && currentHoldingItem?.id === item.id ? '0.6s' : '0.4s',
          // Card nổi lên trên blur (z-1500)
          zIndex: isHolding && currentHoldingItem?.id === item.id ? 1500 : 0,
        }"
        :class="[
          isHolding && currentHoldingItem?.id === item.id
            ? 'scale-110 brightness-110 shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-2 ring-blue-500/50'
            : '',
        ]"
        @touchstart="onTouchStart($event, () => (currentHoldingItem = item))"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEndAction"
      >
        <img
          :src="item.url"
          class="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>

    <CommonMenuLongPressContext
      ref="menuRef"
      :show="isHolding"
      :anchor-x="anchorX"
      :anchor-y="anchorY"
      :active-id="activeActionId"
    />
  </div>
</template>

<style scoped>
.select-none {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
.touch-none {
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
