<script setup lang="ts">
definePageMeta({ layout: "default" });

const { isCanNotGenerate, isProcessing, resultImage, handleGenerate } =
  useWavespeedApiGenerate();
const canGenerate = computed(
  () => !isProcessing.value && !isCanNotGenerate.value
);
</script>

<template>
  <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
    <div class="lg:col-span-4 order-2 lg:order-1">
      <div
        class="bg-[#0d0d0d] p-6 rounded-[2.5rem] border border-white/5 space-y-8 lg:sticky lg:top-8"
      >
        <div>
          <h2 class="text-xl font-black text-white uppercase tracking-tight">
            AI Dreamer
          </h2>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Configure generation parameters
          </p>
        </div>

        <ImageUploader />
        <PromptBuilderSettingsForm />

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

    <div class="lg:col-span-8 order-1 lg:order-2">
      <ResultDisplay :image="resultImage" :loading="isProcessing" />
    </div>
  </div>
</template>
