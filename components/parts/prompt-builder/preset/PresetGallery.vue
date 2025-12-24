<script setup lang="ts">
import { onMounted } from "vue";
import { PRESET_CATEGORIES, PRESET_SAMPLES } from "~/consts";
import PresetCard from "./PresetCard.vue";

const presetStore = usePresetStore();

// Nạp dữ liệu mẫu khi component mount
onMounted(() => {
  if (presetStore.presets.length === 0) {
    presetStore.presets = PRESET_SAMPLES;
  }
});

/**
 * Hàm tính số lượng preset cho từng category
 * @param categoryValue Giá trị của category (All, Portrait, v.v.)
 */
const getCategoryCount = (categoryValue: string) => {
  if (categoryValue === "All") {
    return presetStore.presets.length;
  }
  return presetStore.presets.filter((p) => p.category === categoryValue).length;
};
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center">
      <div
        class="flex items-center gap-2 overflow-x-auto hide-scrollbar-force py-4 px-2"
      >
        <button
          v-for="cat in PRESET_CATEGORIES"
          :key="cat.value"
          @click="presetStore.setCategory(cat.value)"
          class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-1.5"
          :class="
            presetStore.activeCategory === cat.value
              ? 'bg-blue-600 border-blue-500 text-white shadow-[0_5px_15px_rgba(37,99,235,0.4)]'
              : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
          "
        >
          <span>{{ cat.label }}</span>
          <span
            class="opacity-60 text-[8px]"
            :class="
              presetStore.activeCategory === cat.value
                ? 'text-white'
                : 'text-gray-500'
            "
          >
            ({{ getCategoryCount(cat.value) }})
          </span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
      <TransitionGroup name="list">
        <PresetCard
          v-for="preset in presetStore.filteredPresets"
          :key="preset.id"
          :preset="preset"
        />
      </TransitionGroup>
    </div>

    <div
      v-if="presetStore.presets.length === 0"
      class="py-20 text-center border border-dashed border-white/5 rounded-3xl"
    >
      <span
        class="text-[10px] font-bold text-gray-600 uppercase tracking-widest"
        >Đang tải thư viện mẫu...</span
      >
    </div>
  </div>
</template>

<style scoped>
/* 1. Hiệu ứng di chuyển và biến đổi tổng thể */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  /* Tránh hiện tượng nháy hình trên một số trình duyệt */
  backface-visibility: hidden;
  perspective: 1000px;
}

/* 2. Xử lý đặc biệt cho phần tử đang biến mất */
.list-leave-active {
  position: relative;
  z-index: 0;
  /* Ép card đang biến mất không được phóng to kể cả khi đang hover */
  pointer-events: none;
}

/* 3. Trạng thái Xuất hiện (Enter) */
.list-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  filter: blur(4px);
}

/* 4. Trạng thái Biến mất (Leave) */
.list-leave-to {
  opacity: 0;
  /* Thu nhỏ nhẹ nhàng hơn (từ 1 xuống 0.95 thay vì 0.85) để tránh cảm giác "điêu" */
  transform: scale(0.95) translateY(5px);
  filter: blur(10px);
}

/* BỘ CSS CƯỠNG ÉP ẨN SCROLLBAR 
  Áp dụng cho mọi engine trình duyệt hiện đại
*/
.hide-scrollbar-force {
  /* Cho Chrome, Safari và các trình duyệt dùng Webkit */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE/Edge */
}

.hide-scrollbar-force::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  -webkit-appearance: none !important;
}
</style>
