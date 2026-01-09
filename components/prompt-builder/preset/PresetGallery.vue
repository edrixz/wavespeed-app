<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PRESET_CATEGORIES } from "~/consts";
import { usePresetStore } from "~/stores/prompt/preset-store";

const presetStore = usePresetStore();
const scrollContainer = ref<HTMLElement | null>(null);

// --- LOGIC PC DRAG-TO-SCROLL & MOMENTUM ---
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftStart = ref(0);
const dragVelocity = ref(0);
const lastMouseX = ref(0);
const rafId = ref<number | null>(null);
const hasMoved = ref(false); // Để phân biệt giữa Click và Drag

const handleMouseDown = (e: MouseEvent) => {
  if (!scrollContainer.value || presetStore.isDialogOpen) return;

  isDragging.value = true;
  hasMoved.value = false;

  // Dừng momentum cũ nếu đang chạy
  if (rafId.value) cancelAnimationFrame(rafId.value);

  startX.value = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeftStart.value = scrollContainer.value.scrollLeft;
  lastMouseX.value = e.pageX;
  dragVelocity.value = 0;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return;
  e.preventDefault();

  const x = e.pageX - scrollContainer.value.offsetLeft;
  const distance = Math.abs(x - startX.value);

  // Nếu di chuyển hơn 5px thì xác định là đang Drag
  if (distance > 5) hasMoved.value = true;

  // Tính toán vận tốc (Velocity) dựa trên di chuyển thực tế
  dragVelocity.value = e.pageX - lastMouseX.value;
  lastMouseX.value = e.pageX;

  const walk = (x - startX.value) * 1.5;
  scrollContainer.value.scrollLeft = scrollLeftStart.value - walk;
};

// Hàm gộp để xử lý khi thả chuột hoặc chuột rời khỏi vùng container
const handleDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  applyMomentum();
};

const applyMomentum = () => {
  if (!scrollContainer.value || Math.abs(dragVelocity.value) < 0.5) return;

  scrollContainer.value.scrollLeft -= dragVelocity.value;
  // Giảm dần vận tốc (hệ số ma sát 0.95)
  dragVelocity.value *= 0.95;

  rafId.value = requestAnimationFrame(applyMomentum);
};

onMounted(() => {
  presetStore.fetchPresets();
});

// Reset cuộn khi đổi Category
watch(
  () => presetStore.activeCategory,
  () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ left: 0, behavior: "smooth" });
    }
  }
);

const getCategoryCount = (categoryValue: string) => {
  if (categoryValue === "All") return presetStore.presets.length;
  return presetStore.presets.filter((p) => p.category === categoryValue).length;
};
</script>

<template>
  <div class="preset-gallery-root space-y-4">
    <Transition name="fade-slide">
      <div
        v-if="!presetStore.isDialogOpen"
        class="flex items-center gap-2 overflow-x-auto hide-scrollbar-force py-2 px-1"
      >
        <button
          v-for="cat in PRESET_CATEGORIES"
          :key="cat.value"
          @click="presetStore.setCategory(cat.value)"
          class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2"
          :class="
            presetStore.activeCategory === cat.value
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
              : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
          "
        >
          <span>{{ cat.label }}</span>
          <span class="opacity-40 text-[8px]"
            >({{ getCategoryCount(cat.value) }})</span
          >
        </button>
      </div>
    </Transition>

    <div
      v-if="presetStore.isLoading"
      class="h-[160px] flex flex-col items-center justify-center gap-3 bg-white/[0.02] rounded-3xl border border-dashed border-white/5"
    >
      <div
        class="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="presetStore.presets.length > 0" class="relative">
      <div
        ref="scrollContainer"
        @mousedown="handleMouseDown"
        @mouseleave="handleDragEnd"
        @mouseup="handleDragEnd"
        @mousemove="handleMouseMove"
        class="flex items-center gap-4 overflow-x-auto hide-scrollbar-force py-2 px-4 transition-all duration-700 ease-in-out"
        :class="[
          isDragging
            ? 'cursor-grabbing select-none scroll-auto'
            : 'cursor-grab snap-x snap-mandatory scroll-smooth',
          presetStore.isDialogOpen
            ? 'opacity-0 pointer-events-none scale-90 translate-y-20'
            : 'opacity-100',
        ]"
      >
        <TransitionGroup name="list">
          <div
            v-for="preset in presetStore.filteredPresets"
            :key="preset.id"
            class="flex-none w-[72%] md:w-[45%] lg:w-[140px] snap-start"
            :class="{ 'pointer-events-none': hasMoved }"
          >
            <PromptBuilderPresetCard :preset="preset" />
          </div>
        </TransitionGroup>

        <div class="flex-none w-10 h-1"></div>
      </div>
    </div>

    <div
      v-else
      class="h-[160px] flex flex-col items-center justify-center text-center p-6 bg-white/[0.01] rounded-3xl border border-white/5"
    >
      <p class="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
        No Presets found
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Ẩn Filter bar mượt mà */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* HIỆU ỨNG DANH SÁCH */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.list-leave-active {
  position: absolute;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.hide-scrollbar-force {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.hide-scrollbar-force::-webkit-scrollbar {
  display: none !important;
}
</style>
