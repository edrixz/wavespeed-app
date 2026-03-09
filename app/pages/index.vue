<script setup lang="ts">
definePageMeta({ layout: "default" });

const { canNotGenerate, isProcessing, resultImage, handleGenerate } =
  useWavespeedApiGenerate();

const { versionOptions, modelVersion } = useUseWavespeedSeedreamForm();
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 pb-28 lg:pb-0"
  >
    <div class="lg:col-span-4 order-1 lg:order-1">
      <div
        class="bg-white dark:bg-[#0d0d0d] p-2 rounded-[1rem] border border-black/5 dark:border-white/5 space-y-8 lg:sticky lg:top-8 transition-colors"
      >
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              SEEDREAM
            </h2>
            <PartsDropdownList
              v-model="modelVersion"
              :options="versionOptions"
              class="max-w-[100px]"
            />
          </div>
        </div>

        <ImageUploader upload-multi />

        <WavespeedPromptPresetGallery />

        <WavespeedSeedreamForm />

        <div class="hidden lg:block">
          <PartsButtonPrimary
            icon="lucide:sparkles"
            :loading="isProcessing"
            :disabled="canNotGenerate"
            @click="handleGenerate"
          >
            {{ isProcessing ? "Generating..." : "Generate" }}
          </PartsButtonPrimary>
        </div>
      </div>
    </div>

    <!-- Result -->
    <div class="lg:col-span-8 order-2 lg:order-2">
      <ResultDisplay :image="resultImage" :loading="isProcessing" />
    </div>

    <!-- Mobile button -->
    <div
      class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-60 safe-area-bottom shadow-[0_-10px_40px_var(--app-shadow)] transition-colors"
    >
      <div class="max-w-md mx-auto">
        <PartsButtonPrimary
          icon="lucide:sparkles"
          :loading="isProcessing"
          :disabled="canNotGenerate"
          @click="handleGenerate"
          class="rounded-2xl!"
        >
          {{ isProcessing ? "Generating..." : "Generate" }}
        </PartsButtonPrimary>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Xử lý khoảng trống cho các dòng iPhone có tai thỏ/Dynamic Island ở cạnh dưới */
.safe-area-bottom {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
</style>
