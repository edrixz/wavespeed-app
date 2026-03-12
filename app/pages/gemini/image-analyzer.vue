<script setup lang="ts">
definePageMeta({ layout: "default" });

const {
  isAnalyzing,
  hasError,
  analysisResult,
  promptResult,
  isAnalysisModalOpen,
  canNotAnalyze,
  handleAnalyze,
  handleCopyPrompt,
  copied,
} = useGeminiAnalyzer();
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 pb-28 lg:pb-0 max-w-7xl mx-auto"
  >
    <div class="lg:col-span-4 order-1 lg:order-1">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-4 rounded-[1rem] border border-black/5 dark:border-white/5 space-y-6 lg:sticky lg:top-8 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <NuxtLink
            to="/gemini"
            class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors outline-none"
          >
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </NuxtLink>
          <h2
            class="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight"
          >
            Image Analyzer
          </h2>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Tải lên một bức ảnh để trích xuất prompt tiếng Anh siêu chi tiết.
        </p>
        <ImageUploader />
        <div class="hidden lg:block">
          <PartsButtonPrimary
            icon="lucide:scan-search"
            :loading="isAnalyzing"
            :disabled="canNotAnalyze"
            @click="handleAnalyze"
          >
            {{ isAnalyzing ? "Analyzing..." : "Generate Prompt" }}
          </PartsButtonPrimary>
        </div>
      </div>
    </div>

    <div class="lg:col-span-8 order-2 lg:order-2">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-6 rounded-[1rem] border border-black/5 dark:border-white/5 h-full min-h-125 flex flex-col"
      >
        <div class="flex items-center justify-between mb-6">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary" />
            Generated Prompt
          </h3>

          <UModal v-if="promptResult" title="Phân tích chi tiết">
            <UButton
              label="Xem phân tích"
              color="neutral"
              variant="subtle"
              class="rounded-xl py-2 px-4"
            />

            <template #body>
              <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div
                  class="whitespace-pre-wrap text-[15px] text-gray-700 dark:text-gray-300 font-sans leading-relaxed"
                >
                  {{ analysisResult }}
                </div>
              </div>
            </template>
          </UModal>
        </div>

        <div
          v-if="isAnalyzing"
          class="flex-1 flex flex-col items-center justify-center space-y-4"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-primary animate-spin"
          />
          <p class="text-gray-500 dark:text-gray-400">
            Gemini đang phân tích và viết prompt...
          </p>
        </div>

        <div v-else-if="promptResult" class="flex-1 flex flex-col gap-4">
          <div
            class="bg-primary/5 dark:bg-primary/10 p-6 rounded-[1.5rem] border border-primary/20 dark:border-primary/20 flex-1 relative group"
          >
            <div
              class="whitespace-pre-wrap text-[15px] text-gray-800 dark:text-gray-200 font-sans leading-relaxed pb-12"
            >
              {{ promptResult }}
            </div>

            <div class="absolute top-2 right-2">
              <UButton
                :icon="
                  copied
                    ? 'i-heroicons-check'
                    : 'i-heroicons-clipboard-document'
                "
                :color="copied ? 'success' : 'neutral'"
                variant="subtle"
                size="md"
                class="rounded-xl shadow-lg transition-transform active:scale-95"
                @click="handleCopyPrompt"
              >
                {{ copied ? "Copied!" : "Copy" }}
              </UButton>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center space-y-3 opacity-50"
        >
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
          <p class="text-gray-500">
            Chưa có dữ liệu. Hãy tải ảnh lên và nhấn Generate Prompt.
          </p>
        </div>
      </div>
    </div>

    <div
      class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-60 safe-area-bottom shadow-[0_-10px_40px_var(--app-shadow)] transition-colors"
    >
      <div class="max-w-md mx-auto">
        <PartsButtonPrimary
          icon="lucide:scan-search"
          :loading="isAnalyzing"
          :disabled="canNotAnalyze"
          @click="handleAnalyze"
          class="rounded-2xl! shadow-xl!"
        >
          {{ isAnalyzing ? "Analyzing..." : "Generate Prompt" }}
        </PartsButtonPrimary>
      </div>
    </div>
  </div>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5); /* gray-400 with opacity */
  border-radius: 4px;
}
</style>
