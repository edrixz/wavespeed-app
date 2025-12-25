<script setup lang="ts">
import { ref, computed } from "vue";
import {
  assemblePrompt,
  assembleNegativePrompt,
} from "~/utils/prompt-assembler";
import { assemblePromptVi } from "~/utils/prompt-preview-vi";

const promptStore = usePromptBuilderStore();

const { negative_prompt } = useSettingsForm();

// 1. Trạng thái ngôn ngữ: false = EN, true = VI
const isVietnamese = ref(false);

// 2. Computed để lấy dữ liệu Subject hiện tại (giả định Single Subject)
const activeSubject = computed(() => {
  const id = promptStore.activeSubjectId;
  return promptStore.subjects.find((s) => s.id === id);
});

// 3. Computed Prompt chính (Tự động cập nhật khi Store hoặc Switch thay đổi)
const finalPrompt = computed(() => {
  if (!activeSubject.value) return "";

  // Trả về bản dịch VI hoặc bản gốc EN tùy theo trạng thái switch
  return isVietnamese.value
    ? assemblePromptVi(activeSubject.value, promptStore.scene)
    : assemblePrompt(activeSubject.value, promptStore.scene);
});

// Negative Prompt thường giữ nguyên Tiếng Anh để AI hiểu tốt nhất
const negativePrompt = computed(() => {
  return assembleNegativePrompt({
    face: activeSubject.value?.face,
    tech: promptStore.scene.tech,
  } as any);
});

// Hàm Copy
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // Thêm thông báo toast ở đây nếu cần
};
</script>

<template>
  <div
    class="prompt-preview-container bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 space-y-4"
  >
    <div class="flex items-center justify-between">
      <h3
        class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500"
      >
        Master Prompt Preview
      </h3>

      <div
        class="flex items-center gap-2 p-1 bg-black rounded-lg border border-white/10"
      >
        <button
          @click="isVietnamese = false"
          class="px-3 py-1 text-[9px] font-bold rounded-md transition-all"
          :class="
            !isVietnamese
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-500 hover:text-gray-300'
          "
        >
          EN
        </button>
        <button
          @click="isVietnamese = true"
          class="px-3 py-1 text-[9px] font-bold rounded-md transition-all"
          :class="
            isVietnamese
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-gray-500 hover:text-gray-300'
          "
        >
          VI
        </button>
      </div>
    </div>

    <div class="relative group">
      <div
        class="p-4 bg-black/50 rounded-xl border border-white/5 font-mono text-xs leading-relaxed text-gray-300 min-h-[80px]"
      >
        {{ finalPrompt || "Chưa có dữ liệu phân tích..." }}
      </div>

      <button
        @click="copyToClipboard(finalPrompt)"
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 hover:bg-white/10 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
    </div>

    <div class="space-y-2">
      <span
        class="text-[9px] font-bold text-red-500/50 uppercase tracking-widest"
        >Negative Prompt</span
      >
      <div
        class="p-3 bg-red-500/5 rounded-lg border border-red-500/10 text-[10px] text-red-200/60 font-mono italic"
      >
        {{ negative_prompt }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompt-preview-container {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
</style>
