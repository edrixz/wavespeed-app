<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PRESET_CATEGORIES } from "~/consts";

/** * Senior Fullstack Developer Insight:
 * Sử dụng Store để quản lý trạng thái đồng bộ trên toàn ứng dụng.
 */
const presetStore = usePresetStore();
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  presetStore.fetchPresets();
});

/**
 * FIX: Tự động cuộn về đầu khi đổi Category để người dùng không bị "lạc" ở giữa danh sách.
 */
watch(
  () => presetStore.activeCategory,
  () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        left: 0,
        behavior: "smooth",
      });
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
    <div
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

    <div
      v-if="presetStore.isLoading"
      class="h-[160px] flex flex-col items-center justify-center gap-3 bg-white/[0.02] rounded-3xl border border-dashed border-white/5"
    >
      <div
        class="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <p class="text-[9px] font-black uppercase tracking-widest text-gray-600">
        Syncing Library...
      </p>
    </div>

    <div
      v-else-if="presetStore.presets.length > 0"
      ref="scrollContainer"
      class="flex items-center gap-4 overflow-x-auto hide-scrollbar-force snap-x snap-mandatory scroll-smooth py-2 px-4"
    >
      <TransitionGroup name="list">
        <div
          v-for="preset in presetStore.filteredPresets"
          :key="preset.id"
          class="flex-none w-[72%] md:w-[45%] lg:w-[140px] snap-start"
        >
          <PartsPromptBuilderPresetCard :preset="preset" />
        </div>
      </TransitionGroup>

      <div class="flex-none w-10 h-1"></div>
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
/* 1. HIỆU ỨNG TRANSITION SIÊU MƯỢT */

/* list-move: Giúp các card còn lại tự trượt vào vị trí cũ khi có card biến mất */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Khi một card đang thoát ra, ta dùng absolute để nó không chiếm không gian, 
giúp các card khác trượt (list-move) ngay lập tức mà không bị giật */
.list-leave-active {
  position: absolute;
  pointer-events: none;
}

/* Trạng thái bắt đầu xuất hiện: Bay từ phải sang và mờ dần */
.list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
  filter: blur(10px);
}

/* Trạng thái khi biến mất: Thu nhỏ và mờ dần tại chỗ */
.list-leave-to {
  opacity: 0;
  transform: scale(0.5);
  filter: blur(20px);
}

/* 2. CƯỠNG ÉP ẨN SCROLLBAR */
.hide-scrollbar-force {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.hide-scrollbar-force::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>
