<script setup lang="ts">
import { useMoondreamQuery } from "~/composables/wavespeed/use-moondream-query";
import { useImageStore } from "~/stores/image/image-store";
import type { ImageItem } from "~/types/images";

// Dependencies
// Lấy thêm biến 'result' từ composable để hiển thị
const { generateActionPrompt, isGenerating, settings, customPrompt, result } =
  useMoondreamQuery();
const imageStore = useImageStore();
const toast = useToast();

const showPromptModal = ref(false);
const showImageSelector = ref(false);

// State cho hiệu ứng nút Copy
const isCopied = ref(false);

// Custom Prompt Logic
const displayPrompt = computed({
  get: () => customPrompt.value || "",
  set: (val) => (customPrompt.value = val),
});

// Hàm thực thi (Gọi API)
const executeAnalysis = async (targetImage: ImageItem) => {
  showImageSelector.value = false;

  if (!targetImage.url) {
    return toast.error("Invalid image URL!");
  }

  // Gọi API -> Kết quả sẽ tự động cập nhật vào biến 'result' nhờ store
  await generateActionPrompt(targetImage.url);
};

// Hàm xử lý Click Execute
const handleExecuteClick = () => {
  const images = imageStore.images;
  if (images.length === 0) return toast.warning("Please upload images first!");

  if (images.length === 1) {
    executeAnalysis(images[0]);
  } else {
    showImageSelector.value = true;
  }
};

// Hàm Copy
const handleCopy = async () => {
  if (!result.value) return;
  try {
    await navigator.clipboard.writeText(result.value);
    isCopied.value = true;
    toast.success("Copied to clipboard!");

    // Reset icon sau 2s
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    toast.error("Failed to copy!");
  }
};
</script>

<template>
  <div
    class="moondream-analyzer w-full p-2 border border-gray-800 rounded bg-gray-900/50"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-purple-400 uppercase tracking-wider"
          >Moondream Analyze</span
        >
        <span
          v-if="isGenerating"
          class="animate-pulse text-[10px] text-gray-500"
          >Processing...</span
        >
      </div>
      <div class="flex gap-1">
        <button
          @click="showPromptModal = true"
          class="icon-btn"
          title="Edit System Prompt"
        >
          ✏️
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-3 px-1">
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="settings.enable_sync_mode"
          class="accent-purple-500"
        />
        <span>Sync</span>
      </label>
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="settings.enable_safety_checker"
          class="accent-red-500"
        />
        <span>Safety</span>
      </label>
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="settings.reasoning"
          class="accent-blue-500"
        />
        <span>Reasoning</span>
      </label>
    </div>

    <button
      @click="handleExecuteClick"
      :disabled="isGenerating"
      class="w-full btn-execute group mb-3"
    >
      <span v-if="isGenerating" class="animate-spin mr-1">⏳</span>
      <span v-else>🚀</span>
      EXECUTE MOONDREAM
    </button>

    <Transition name="fade">
      <div class="result-box relative group/preview">
        <div class="flex items-center justify-between mb-1 px-1">
          <span
            class="text-[9px] font-bold text-green-400 uppercase tracking-widest"
            >Generated Action Prompt</span
          >

          <button
            @click="handleCopy"
            class="flex items-center gap-1 px-2 py-0.5 text-[9px] bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 transition-colors"
          >
            <span v-if="isCopied">✅ Copied</span>
            <span v-else>📋 Copy</span>
          </button>
        </div>

        <div
          class="text-[10px] text-gray-300 font-mono bg-black/60 p-2 rounded max-h-40 overflow-y-auto border border-gray-700/50 leading-relaxed selection:bg-purple-500/30"
        >
          {{ result }}
        </div>
      </div>
    </Transition>

    <div
      v-if="showPromptModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div
        class="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-lg p-4 shadow-2xl"
      >
        <h3 class="text-sm font-bold text-white mb-2">Edit System Prompt</h3>
        <textarea
          v-model="displayPrompt"
          class="w-full h-40 bg-black/50 border border-gray-700 rounded p-2 text-xs text-gray-300 focus:border-purple-500 outline-none resize-none font-mono"
          placeholder="Enter your custom prompt here..."
        ></textarea>
        <div class="flex justify-end gap-2 mt-3">
          <button
            @click="displayPrompt = ''"
            class="px-3 py-1 text-xs text-gray-400 hover:text-white"
          >
            Reset
          </button>
          <button
            @click="showPromptModal = false"
            class="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showImageSelector"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <div
        class="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-4 shadow-2xl"
      >
        <h3 class="text-sm font-bold text-white mb-4 text-center">
          Select Image to Analyze
        </h3>
        <div
          class="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar p-1"
        >
          <div
            v-for="(img, index) in imageStore.images"
            :key="img.id || index"
            class="relative aspect-[2/3] group cursor-pointer border border-gray-700 rounded overflow-hidden hover:border-purple-500 transition-all"
            @click="executeAnalysis(img)"
          >
            <img :src="img.url" class="w-full h-full object-cover" />
            <div
              class="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span
                class="text-[10px] font-bold bg-black/80 px-2 py-1 rounded text-white backdrop-blur"
                >SELECT</span
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button
            @click="showImageSelector = false"
            class="px-4 py-2 text-xs text-gray-400 hover:text-white border border-gray-700 rounded hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-label {
  @apply flex items-center gap-1.5 text-[10px] text-gray-300 cursor-pointer select-none hover:text-white;
}

.icon-btn {
  @apply p-1 rounded hover:bg-white/10 text-[10px] transition-colors;
}

.btn-execute {
  @apply relative text-[10px] font-black py-2 rounded border transition-all 
         flex items-center justify-center gap-2 overflow-hidden uppercase tracking-widest
         bg-purple-900/20 text-purple-400 border-purple-900/50 
         hover:border-purple-400 hover:bg-purple-900/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)];
}

.result-box {
  @apply mt-2 p-2 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded shadow-lg;
}

/* Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #111827;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 2px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
