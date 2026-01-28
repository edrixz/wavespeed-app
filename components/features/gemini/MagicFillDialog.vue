<script setup lang="ts">
import { useGeminiPromptStore } from "~/stores/gemini/gemini-prompt-store";
import { useWavespeedPayloadStore } from "~/stores/wavespeed/wavespeed-payload-store";

const aiStore = useGeminiPromptStore();
const payloadStore = useWavespeedPayloadStore();

// Nhãn hiển thị tiếng Việt cho các nhóm
const categoryLabels: Record<string, string> = {
  subject: "Nhân vật & Chủ thể",
  clothing: "Trang phục",
  pose: "Tư thế & Hành động",
  lighting: "Ánh sáng",
  background: "Bối cảnh",
  technical: "Kỹ thuật & Hậu kì",
};

const handleApply = () => {
  const finalPrompt = aiStore.compileFinalPrompt();

  // Logic apply: Nối vào prompt hiện có hoặc ghi đè
  if (payloadStore.prompt) {
    payloadStore.prompt += "\n" + finalPrompt;
  } else {
    payloadStore.prompt = finalPrompt;
  }

  aiStore.isDialogOpen = false;
};
</script>

<template>
  <div
    v-if="aiStore.isDialogOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      @click="aiStore.isDialogOpen = false"
    ></div>

    <div
      class="relative bg-[#0F0F0F] w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
    >
      <div
        class="p-6 border-b border-white/5 flex justify-between items-center bg-[#141414]"
      >
        <div>
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="text-purple-400">✨</span> Magic Mixer
          </h3>
          <p class="text-xs text-gray-500 mt-1">
            Chọn các yếu tố bạn muốn giữ lại từ mỗi ảnh (Hiển thị tiếng Việt,
            Prompt tiếng Anh).
          </p>
        </div>
        <button
          @click="aiStore.isDialogOpen = false"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <PartsIconsClose class="w-6 h-6" />
        </button>
      </div>

      <div
        class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#0a0a0a]"
      >
        <div
          v-for="(item, idx) in aiStore.analyzedResults"
          :key="item.imageId"
          class="group"
        >
          <div
            class="flex items-center gap-4 mb-4 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10 py-3 border-b border-white/5"
          >
            <div
              class="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0"
            >
              <img :src="item.imageUrl" class="w-full h-full object-cover" />
            </div>
            <span class="text-sm font-bold text-gray-300"
              >Ảnh tham khảo #{{ idx + 1 }}</span
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="(content, category) in item.data"
              :key="category"
              @click="aiStore.toggleSelection(item.imageId, category)"
              class="relative p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-white/[0.02] min-h-[110px] flex flex-col"
              :class="
                aiStore.selectedKeys.has(`${item.imageId}-${category}`)
                  ? 'border-purple-500/50 bg-purple-500/[0.05]'
                  : 'border-white/5 bg-[#121212]'
              "
            >
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[9px] font-black uppercase tracking-widest"
                  :class="
                    aiStore.selectedKeys.has(`${item.imageId}-${category}`)
                      ? 'text-purple-400'
                      : 'text-gray-500'
                  "
                >
                  {{ categoryLabels[category] || category }}
                </span>

                <div
                  class="w-4 h-4 rounded-full border flex items-center justify-center transition-all"
                  :class="
                    aiStore.selectedKeys.has(`${item.imageId}-${category}`)
                      ? 'bg-purple-500 border-purple-500 scale-100'
                      : 'border-gray-600 scale-90 opacity-50'
                  "
                >
                  <PartsIconsSuccess
                    v-if="
                      aiStore.selectedKeys.has(`${item.imageId}-${category}`)
                    "
                    class="w-2.5 h-2.5 text-white"
                  />
                </div>
              </div>

              <p
                class="text-xs text-gray-300 font-medium leading-relaxed line-clamp-3 mb-1"
              >
                {{ content.label_vi }}
              </p>

              <div class="mt-auto pt-2 border-t border-white/5 opacity-50">
                <p
                  class="text-[9px] text-gray-400 italic line-clamp-1 truncate"
                >
                  {{ content.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 border-t border-white/5 bg-[#141414] flex justify-end gap-3"
      >
        <PartsButtonSecondary @click="aiStore.isDialogOpen = false">
          Hủy bỏ
        </PartsButtonSecondary>
        <PartsButtonPrimary icon="lucide:check" @click="handleApply">
          Áp dụng Prompt
        </PartsButtonPrimary>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 10px;
}
</style>
