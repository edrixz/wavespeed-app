<script setup lang="ts">
definePageMeta({ layout: "default" });

const { isCanNotGenerate, isProcessing, resultImage, handleGenerate } =
  useWavespeedApiGenerate();

const { isVersionV45, toggleVersionMode } = useSettingsForm();

const canGenerate = computed(
  () => !isProcessing.value && !isCanNotGenerate.value
);
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 pb-28 lg:pb-0"
  >
    <div class="lg:col-span-8 order-2 lg:order-2">
      <ResultDisplay :image="resultImage" :loading="isProcessing" />
    </div>

    <div class="lg:col-span-4 order-1 lg:order-1">
      <div
        class="bg-[#0d0d0d] p-2 rounded-[1rem] border border-white/5 space-y-8 lg:sticky lg:top-8"
      >
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-white uppercase tracking-tight">
              AI Dreamer
            </h2>
            <PartsButtonSwitch
              @toggle="toggleVersionMode"
              :is-enable="isVersionV45"
            >
              <template #opt1>v4</template>
              <template #opt2>v4.5</template>
            </PartsButtonSwitch>
          </div>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Configure generation parameters
          </p>
        </div>

        <ImageUploader />
        <PromptBuilderSettingsForm />

        <div class="hidden lg:block">
          <PartsButtonPrimary
            icon="lucide:sparkles"
            :loading="isProcessing"
            :disabled="!canGenerate"
            @click="handleGenerate"
          >
            {{ isProcessing ? "Generating..." : "Start Dream" }}
          </PartsButtonPrimary>
        </div>
      </div>
    </div>

    <div
      class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 z-[60] safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      <div class="max-w-md mx-auto">
        <PartsButtonPrimary
          icon="lucide:sparkles"
          :loading="isProcessing"
          :disabled="!canGenerate"
          @click="handleGenerate"
          class="!py-4 !rounded-2xl !shadow-blue-600/20"
        >
          {{ isProcessing ? "Generating..." : "Start Dream" }}
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
