<script setup lang="ts">
definePageMeta({ layout: "default" });
const {
  isAnalyzing,
  analysisResult,
  promptResult,
  handleAnalyze,
  handleCopy,
  copiedState,
} = useGeminiAnalyzer();
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto pb-28 lg:pb-8"
  >
    <div class="lg:col-span-4 space-y-6">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-5 rounded-2xl border border-black/5 space-y-6 lg:sticky lg:top-8 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/gemini"
            class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            ><UIcon name="i-heroicons-arrow-left"
          /></NuxtLink>
          <h2 class="text-xl font-black uppercase tracking-tight">
            Image Analyzer
          </h2>
        </div>
        <ImageUploader />
        <PartsButtonPrimary
          icon="lucide:scan-search"
          :loading="isAnalyzing"
          @click="handleAnalyze"
          >Generate Prompt</PartsButtonPrimary
        >
      </div>
    </div>

    <div class="lg:col-span-8">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-black/5 min-h-150 flex flex-col shadow-sm"
      >
        <div
          v-if="isAnalyzing"
          class="flex-1 flex flex-col items-center justify-center space-y-4"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-primary animate-spin"
          />
          <p class="text-sm text-gray-500 font-medium tracking-wide">
            Gemini đang giải mã...
          </p>
        </div>

        <div
          v-else-if="promptResult"
          class="space-y-6 flex-1 animate-in fade-in duration-500"
        >
          <div
            class="flex items-center justify-between border-b border-black/5 pb-4"
          >
            <h3
              class="font-bold flex items-center gap-2 text-neutral-900 dark:text-white"
            >
              <UIcon name="i-heroicons-sparkles" class="text-primary" />
              Prompt
            </h3>
            <UButton
              :icon="
                copiedState['full']
                  ? 'i-heroicons-check'
                  : 'i-heroicons-clipboard-document-check'
              "
              :label="copiedState['full'] ? 'Copied' : 'Copy All'"
              :color="copiedState['full'] ? 'success' : 'neutral'"
              variant="soft"
              @click="handleCopy(promptResult.full, 'full')"
              class="rounded-xl font-bold transition-all"
            />
          </div>

          <div class="grid gap-4">
            <div
              v-for="(content, key) in {
                Subject: promptResult.subject,
                Clothing: promptResult.clothing,
                Setting: promptResult.setting,
                Style: promptResult.style,
                Vibe: promptResult.vibe,
              }"
              :key="key"
              class="group relative bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-black/5 transition-all hover:border-primary/40"
            >
              <div class="flex justify-between items-center mb-3">
                <span
                  class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md"
                  >{{ key }}</span
                >
                <UButton
                  :icon="
                    copiedState[key]
                      ? 'i-heroicons-check'
                      : 'i-heroicons-document-duplicate'
                  "
                  size="xs"
                  :color="copiedState[key] ? 'success' : 'neutral'"
                  :variant="copiedState[key] ? 'solid' : 'ghost'"
                  class="lg:opacity-0 lg:group-hover:opacity-100 transition-all shadow-sm"
                  @click="handleCopy(content, key)"
                />
              </div>
              <p
                class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans"
              >
                {{ content }}
              </p>
            </div>
          </div>

          <div class="pt-6 border-t border-black/5">
            <UModal v-if="analysisResult">
              <UButton
                label="Xem phân tích chi tiết (Tiếng Việt)"
                variant="ghost"
                block
                color="neutral"
                class="hover:bg-gray-50 rounded-xl"
              />
              <template #body>
                <div
                  class="p-6 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-700 dark:text-gray-300"
                >
                  {{ analysisResult }}
                </div>
              </template>
            </UModal>
          </div>
        </div>

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center opacity-30 select-none"
        >
          <UIcon name="i-heroicons-photo" class="w-16 h-16 mb-4" />
          <p class="font-black uppercase text-xs tracking-widest">
            Chưa có dữ liệu
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
