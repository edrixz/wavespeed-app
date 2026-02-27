<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: File | null;
  progress: number;
}>();

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement | null>(null);
const localPreviewUrl = ref<string>("");

watch(
  () => props.modelValue,
  (newFile) => {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    if (newFile) localPreviewUrl.value = URL.createObjectURL(newFile);
    else localPreviewUrl.value = "";
  },
  { immediate: true },
);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    emit("update:modelValue", target.files[0]);
    target.value = "";
  }
};

const triggerFileInput = () => fileInput.value?.click();
</script>

<template>
  <div class="upload-file-container w-full max-w-[320px] mx-auto">
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleFileChange"
    />

    <div
      v-if="!modelValue"
      @click="triggerFileInput"
      class="group border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl p-8 transition-all cursor-pointer hover:border-blue-500/40 hover:bg-black/5 dark:hover:bg-white/2 active:scale-[0.98]"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-all duration-300"
        >
          <svg
            class="w-5 h-5 text-gray-500 group-hover:text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-[10px] font-bold text-neutral-900 dark:text-white tracking-wide">
            Click to upload
          </p>
          <p class="text-[8px] text-gray-500 mt-1 uppercase">
            SVG, PNG, JPG (MAX. 10MB)
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-xl group transition-colors"
    >
      <div
        @click="triggerFileInput"
        class="aspect-4/3 relative overflow-hidden bg-gray-100 dark:bg-black cursor-pointer transition-colors"
      >
        <img
          :src="localPreviewUrl"
          class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
          :class="{ 'opacity-40 grayscale': progress > 0 && progress < 100 }"
        />

        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          <span
            class="bg-white/80 dark:bg-black/50 text-neutral-900 dark:text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm"
          >
            Change Image
          </span>
        </div>

        <button
          @click.stop="emit('update:modelValue', null)"
          class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 hover:bg-red-500/80 hover:text-white text-gray-700 dark:text-white flex items-center justify-center backdrop-blur-md transition-all z-10"
          title="Remove image"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-4 bg-gray-50/50 dark:bg-white/2 border-t border-black/5 dark:border-white/5 space-y-3 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 overflow-hidden">
            <div
              class="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-500"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                />
              </svg>
            </div>
            <p class="text-[9px] font-bold text-gray-600 dark:text-gray-300 truncate">
              {{ modelValue.name }}
            </p>
          </div>
          <span class="text-[8px] font-black text-gray-500">
            {{ (modelValue.size / 1024 / 1024).toFixed(2) }} MB
          </span>
        </div>

        <div class="space-y-1.5">
          <div class="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 transition-all duration-300"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <div
            class="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter"
          >
            <span
              :class="progress === 100 ? 'text-green-500' : 'text-blue-500'"
            >
              {{
                progress === 100
                  ? "Success"
                  : progress > 0
                    ? "Uploading"
                    : "Ready"
              }}
            </span>
            <span class="text-gray-500">{{ Math.round(progress) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
