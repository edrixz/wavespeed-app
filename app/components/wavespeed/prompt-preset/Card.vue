<script setup lang="ts">
const props = defineProps<{ item: any }>();
const emit = defineEmits(["select"]);

// Logic ẩn/hiện ảnh riêng biệt cho từng card
const isVisible = ref(false);

const toggleVisibility = (e: Event) => {
  e.stopPropagation(); // Ngăn sự kiện click vào icon mắt làm mở modal chi tiết
  isVisible.value = !isVisible.value;
};
</script>

<template>
  <div
    @click="$emit('select', item)"
    class="flex-none w-[140px] h-[220px] rounded-[32px] relative overflow-hidden group cursor-pointer snap-start border border-black/10 dark:border-white/5 bg-white dark:bg-[#0d0d0d] shadow-xl dark:shadow-2xl transition-all duration-500 hover:border-blue-500/40"
  >
    <div class="absolute inset-0 transition-all duration-700">
      <img
        v-if="item.thumbnail"
        :src="item.thumbnail"
        class="w-full h-full object-cover transition-all duration-700"
        :class="[
          isVisible
            ? 'blur-0 scale-100'
            : 'blur-[20px] scale-110 grayscale-[0.5]',
        ]"
      />
      <div
        v-else
        class="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black"
      ></div>

      <div v-if="!isVisible" class="absolute inset-0 bg-white/20 dark:bg-black/20 z-10 transition-colors"></div>
    </div>

    <button
      @click="toggleVisibility"
      class="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white/70 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-all active:scale-90 shadow-lg dark:shadow-xl"
    >
      <Icon :name="isVisible ? 'lucide:eye' : 'lucide:eye-off'" size="14" />
    </button>

    <div
      class="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-linear-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 backdrop-blur-[1px] z-20 transition-colors duration-300"
    >
      <h4
        class="text-neutral-900 dark:text-white font-black text-[9px] uppercase tracking-wider truncate mb-1"
      >
        {{ item.title }}
      </h4>
      <div class="flex items-center gap-1.5">
        <span
          class="text-[6px] text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20 uppercase"
        >
          {{ item.size }}
        </span>
      </div>
    </div>

    <div
      class="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    ></div>
  </div>
</template>
