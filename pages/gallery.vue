<script setup lang="ts">
import { useGalleryStore } from "~/stores/common/ui/gallery-store";

definePageMeta({ layout: "default" });

const galleryStore = useGalleryStore();
const simpleStore = useSimplePresetStore();
const toast = useToast();

const handleSaveToPreset = (item: any) => {
  // Mở modal tạo preset với dữ liệu từ item
  // Hoặc lưu nhanh với tên mặc định
  simpleStore.savePreset({
    title: `Style ${new Date(item.timestamp).toLocaleTimeString()}`,
    prompt: item.config.prompt,
    negative_prompt: item.config.negative_prompt,
    thumbnail: item.url,
    size: item.config.size,
  });
  toast.success("Saved to Presets!");
};
</script>

<template>
  <div class="space-y-8 pb-20">
    <header class="flex justify-between items-end px-2">
      <div>
        <h1 class="text-2xl font-black uppercase tracking-widest text-white">
          Session Gallery
        </h1>
        <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">
          Temporary storage for current session
        </p>
      </div>
      <div
        class="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20"
      >
        {{ galleryStore.items.length }} ASSETS
      </div>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <TransitionGroup name="gallery-list">
        <div
          v-for="item in galleryStore.items"
          :key="item.id"
          class="group relative bg-[#0d0d0d] rounded-[2rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
        >
          <div class="aspect-[3/4] overflow-hidden">
            <img
              :src="item.url"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5"
          >
            <div class="flex justify-end gap-2">
              <button
                @click="galleryStore.removeItem(item.id)"
                class="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Icon name="lucide:trash-2" size="14" />
              </button>
            </div>

            <div class="space-y-3">
              <p class="text-[9px] text-gray-300 line-clamp-3 font-mono italic">
                "{{ item.config.prompt }}"
              </p>

              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="handleSaveToPreset(item)"
                  class="py-2.5 bg-white/10 hover:bg-blue-600 text-white text-[8px] font-black uppercase rounded-xl transition-all border border-white/10"
                >
                  Save Preset
                </button>
                <a
                  :href="item.url"
                  target="_blank"
                  class="py-2.5 bg-white text-black text-[8px] font-black uppercase rounded-xl transition-all flex items-center justify-center"
                >
                  Cloud Save
                </a>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div
      v-if="galleryStore.items.length === 0"
      class="py-40 flex flex-col items-center justify-center opacity-20"
    >
      <Icon name="lucide:aperture" size="64" class="animate-spin-slow" />
      <p class="mt-4 font-black uppercase tracking-[0.4em] text-sm">
        No magic captured yet
      </p>
    </div>
  </div>
</template>

<style scoped>
.gallery-list-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.gallery-list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
