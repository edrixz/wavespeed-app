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

const isModalOpen = ref(false);
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
            class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            ><Icon name="lucide:arrow-left" class="w-5 h-5"
          /></NuxtLink>
          <h2 class="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
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
          <Icon
            name="lucide:loader-2"
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
              <Icon name="lucide:sparkles" class="text-primary w-5 h-5" />
              Prompt
            </h3>
            <button
               class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs uppercase font-bold transition-all border outline-none cursor-pointer"
               :class="copiedState['full'] ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'bg-transparent border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'"
               @click="handleCopy(promptResult.full, 'full')"
             >
               <Icon :name="copiedState['full'] ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
               {{ copiedState['full'] ? 'Copied' : 'Copy All' }}
             </button>
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
                <button
                  class="lg:opacity-0 lg:group-hover:opacity-100 transition-all p-1.5 rounded-lg flex items-center justify-center border outline-none cursor-pointer"
                  :class="copiedState[key] ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'bg-transparent border-transparent text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'"
                  @click="handleCopy(content, key)"
                >
                   <Icon :name="copiedState[key] ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                </button>
              </div>
              <p
                class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans"
              >
                {{ content }}
              </p>
            </div>
          </div>

          <div class="pt-6 border-t border-black/5" v-if="analysisResult">
            <button
               @click="isModalOpen = true"
               class="w-full py-2.5 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors border border-black/5 dark:border-white/5 outline-none cursor-pointer"
            >
               Xem phân tích chi tiết (Tiếng Việt)
            </button>
            <PartsModalBaseModal v-model:open="isModalOpen" title="Phân tích chi tiết">
                <div
                  class="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 mt-4"
                >
                  {{ analysisResult }}
                </div>
            </PartsModalBaseModal>
          </div>
        </div>

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center opacity-30 select-none"
        >
          <Icon name="lucide:image" class="w-16 h-16 mb-4" />
          <p class="font-black uppercase text-xs tracking-widest text-center">
            Chưa có dữ liệu
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
