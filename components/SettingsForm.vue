<script setup lang="ts">
const {
  isBuilderMode,
  prompt,
  negative_prompt,
  width,
  height,
  enableSafetyChecker,
  enableBase64Output,
  enableSyncMode,
  resetToDefault,
  toggleBuilderMode,
} = useSettingsForm();
</script>

<template>
  <div class="space-y-5">
    <div class="flex justify-between items-center mb-2">
      <label class="text-sm font-medium text-gray-300">Prompt Mode</label>
      <PartsButtonSwitch
        @toggleBuilder="toggleBuilderMode"
        :is-builder-mode="isBuilderMode"
      />
    </div>

    <PromptBuilder v-if="isBuilderMode" />

    <div v-else>
      <div class="flex justify-between mb-2">
        <label class="text-sm font-medium text-gray-300">
          Prompt <span class="text-red-500">*</span>
        </label>
        <span
          class="text-xs text-gray-500 cursor-pointer hover:text-blue-400"
          @click="resetToDefault"
          >Reset</span
        >
      </div>
      <textarea
        v-model="prompt"
        rows="6"
        class="inp w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder-gray-500"
        placeholder="Describe what you want to see..."
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-2 text-gray-300"
        >Negative</label
      >
      <textarea
        v-model="negative_prompt"
        rows="6"
        class="inp w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
        placeholder="Bad quality..."
      />
    </div>

    <!-- Aspect Ratio -->
    <PartsAspectRatioList />

    <div
      class="grid grid-cols-2 gap-4 bg-gray-700/30 p-3 rounded-lg border border-gray-700/50"
    >
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-xs text-gray-400">Width</label>
          <input
            type="number"
            v-model.number="width"
            class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
            step="64"
          />
        </div>
        <input
          type="range"
          v-model.number="width"
          min="64"
          max="4096"
          step="64"
          class="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-xs text-gray-400">Height</label>
          <input
            type="number"
            v-model.number="height"
            class="w-16 bg-transparent text-right text-xs text-blue-400 font-bold outline-none"
            step="64"
          />
        </div>
        <input
          type="range"
          v-model.number="height"
          min="64"
          max="4096"
          step="64"
          class="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>

    <div class="space-y-3 p-3 bg-gray-700/30 rounded-lg">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="enableSafetyChecker"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Safety Checker</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="enableSyncMode"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Sync Mode</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="enableBase64Output"
          class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
        />
        <span class="text-sm">Base64 Output</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
