<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: File | null;
  progress: number;
}>();

const emit = defineEmits(["update:modelValue", "open-crop"]);

const fileInput = ref<HTMLInputElement | null>(null);
const localPreviewUrl = ref<string>("");

watch(
  () => props.modelValue,
  (newFile) => {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    if (newFile) localPreviewUrl.value = URL.createObjectURL(newFile);
    else localPreviewUrl.value = "";
  },
  { immediate: true }
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
      class="group border-2 border-dashed border-white/10 rounded-2xl p-8 transition-all cursor-pointer hover:border-blue-500/40 hover:bg-white/[0.02] active:scale-[0.98]"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-all duration-300"
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
          <p class="text-[10px] font-bold text-white tracking-wide">
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
      class="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-xl group"
    >
      <div class="aspect-[4/3] relative overflow-hidden bg-black">
        <img
          :src="localPreviewUrl"
          class="w-full h-full object-cover transition-all duration-500"
          :class="{ 'opacity-40 grayscale': progress > 0 && progress < 100 }"
        />

        <div
          v-if="progress === 0 || progress === 100"
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
        >
          <button
            @click="$emit('open-crop')"
            class="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M6 2v14a2 2 0 0 0 2 2h14" />
              <path d="M18 22V8a2 2 0 0 0-2-2H2" />
            </svg>
          </button>
          <button
            @click="triggerFileInput"
            class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center backdrop-blur-md active:scale-90 transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            @click="emit('update:modelValue', null)"
            class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 flex items-center justify-center backdrop-blur-md active:scale-90 transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-4 bg-white/[0.02] border-t border-white/5 space-y-3">
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
            <p class="text-[9px] font-bold text-gray-300 truncate">
              {{ modelValue.name }}
            </p>
          </div>
          <span class="text-[8px] font-black text-gray-500"
            >{{ (modelValue.size / 1024 / 1024).toFixed(2) }} MB</span
          >
        </div>

        <div class="space-y-1.5">
          <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
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
