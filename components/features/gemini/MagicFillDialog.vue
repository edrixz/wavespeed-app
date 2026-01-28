<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeminiPromptStore } from "~/stores/gemini/gemini-prompt-store";

// Store Logic giữ nguyên
const store = useGeminiPromptStore();
const { closeDialog, toggleSelection, isSelected, applyToMainPrompt } = store;
const { isDialogOpen, results, selectedSegments } = storeToRefs(store);

const categoryLabels: Record<string, string> = {
  subject: "Chủ thể",
  clothing: "Trang phục",
  pose: "Tư thế",
  lighting: "Ánh sáng",
  background: "Bối cảnh",
  technical: "Kỹ thuật",
};

const handleApply = () => {
  applyToMainPrompt("replace");
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isDialogOpen"
        class="relative z-[100]"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          @click="closeDialog"
        />

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 text-left shadow-2xl transition-all my-0 sm:my-8 sm:w-full sm:max-w-4xl"
              @click.stop
            >
              <div
                class="bg-white/5 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-white/10"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                      />
                      <path d="M5 3v4" />
                      <path d="M9 3v4" />
                      <path d="M3 5h4" />
                      <path d="M3 9h4" />
                    </svg>
                  </div>
                  <div>
                    <h3
                      class="text-base font-semibold leading-6 text-white"
                      id="modal-title"
                    >
                      Magic Fill Analysis
                    </h3>
                    <p class="text-xs text-gray-400">
                      Select elements to construct your prompt
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  class="text-gray-400 hover:text-white transition-colors"
                  @click="closeDialog"
                >
                  <PartsIconsClose class="w-6 h-6" />
                </button>
              </div>

              <div
                class="px-4 py-5 sm:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8"
              >
                <div
                  v-for="(imgResult, idx) in results"
                  :key="imgResult.imageId"
                  class="space-y-4"
                >
                  <div
                    class="flex items-center gap-3 pb-2 border-b border-white/5"
                  >
                    <img
                      :src="imgResult.imageUrl"
                      class="w-10 h-10 rounded-md object-cover border border-white/10"
                    />
                    <span class="text-sm font-medium text-gray-300"
                      >Reference Image #{{ idx + 1 }}</span
                    >
                  </div>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                  >
                    <button
                      v-for="(content, category) in imgResult.data"
                      :key="category"
                      @click="
                        toggleSelection(imgResult.imageId, category as string)
                      "
                      class="group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200"
                      :class="
                        isSelected(imgResult.imageId, category as string)
                          ? 'bg-blue-600/10 border-blue-500/50 hover:bg-blue-600/20'
                          : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                      "
                    >
                      <div class="flex justify-between w-full mb-1">
                        <span
                          class="text-[10px] uppercase tracking-wider font-bold"
                          :class="
                            isSelected(imgResult.imageId, category as string)
                              ? 'text-blue-400'
                              : 'text-gray-500'
                          "
                        >
                          {{ categoryLabels[category as string] || category }}
                        </span>

                        <div
                          class="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                          :class="
                            isSelected(imgResult.imageId, category as string)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-600'
                          "
                        >
                          <PartsIconsSuccess
                            v-if="
                              isSelected(imgResult.imageId, category as string)
                            "
                            class="w-3 h-3 text-white"
                          />
                        </div>
                      </div>

                      <span
                        class="text-sm font-medium text-gray-200 group-hover:text-white "
                      >
                        {{ content.label_vi }}
                      </span>
                      <span class="text-xs text-gray-500 mt-1 line-clamp-2">
                        {{ content.value }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="bg-black/20 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-white/5"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                  :disabled="selectedSegments.size === 0"
                  @click="handleApply"
                >
                  <PartsIconsSuccess class="w-4 h-4" />
                  Apply to Prompt ({{ selectedSegments.size }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
