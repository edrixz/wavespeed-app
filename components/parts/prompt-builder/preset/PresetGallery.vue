<script setup lang="ts">
import { onMounted } from "vue";
import { PRESET_CATEGORIES, PRESET_SAMPLES } from "~/consts";
import PresetCard from "./PresetCard.vue";

const presetStore = usePresetStore();

// Nạp dữ liệu mẫu khi component mount
onMounted(() => {
  presetStore.fetchPresets();
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

    <div v-if="presetStore.isLoading" class="flex flex-col items-center gap-4">
      <div
        class="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <p
        class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 animate-pulse"
      >
        Đang tải thư viện mẫu...
      </p>
    </div>

    <div
      v-else-if="presetStore.presets.length === 0"
      class="flex flex-col items-center text-center gap-6 max-w-xs animate-in fade-in zoom-in duration-500"
    >
      <div
        class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M20 12V8H4v12h10M4 8l8-4 8 4M12 12l8-4M12 12v8M16 16l2 2m2 2l-2-2m2-2l-2 2m0 0l-2-2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-black uppercase tracking-widest text-gray-400">
          Chưa có dữ liệu
        </h3>
        <p class="text-[10px] text-gray-600 leading-relaxed font-medium">
          Thư viện hiện đang trống. Hãy thử thêm Preset mới vào hệ thống.
        </p>
      </div>

      <button
        @click="presetStore.fetchPresets()"
        class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all"
      >
        Làm mới dữ liệu
      </button>
    </div>

    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
    >
      <TransitionGroup name="list">
        <PresetCard
          v-for="preset in presetStore.filteredPresets"
          :key="preset.id"
          :preset="preset"
        />
      </TransitionGroup>
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
