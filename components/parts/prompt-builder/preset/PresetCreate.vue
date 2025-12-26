<script setup lang="ts">
import { PRESET_CATEGORIES } from "~/consts";
import { storeToRefs } from "pinia";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

// Stores & Composables]
const { uploadImage, isUploading } = useUploadToSupabase();
const presetStore = usePresetStore();
const { isSaving } = storeToRefs(presetStore);
const uploadImageStore = useUploadImageStore();
const {
  selectedFile,
  uploadProgress,
  isCropping,
  cropperRef,
  localPreviewUrl,
} = storeToRefs(uploadImageStore);

const toast = useToast();

// Trạng thái Form]
const form = ref({
  title: "",
  category: "Fine Art",
  jsonInput: "",
});

// Reset dữ liệu]
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.value = { title: "", category: "Fine Art", jsonInput: "" };
      uploadImageStore.initState();
    }
  }
);

const handleCreate = async () => {
  // Guard Clauses]
  if (!selectedFile.value || !form.value.title) {
    return toast.warning("Vui lòng điền đủ thông tin");
  }

  if (!form.value.jsonInput) {
    return toast.warning("Không có dữ liệu công thức để lưu!");
  }

  // 2. Kiểm tra JSON]
  let parsedData;
  try {
    parsedData = JSON.parse(form.value.jsonInput);
  } catch (e) {
    toast.error("Định dạng JSON không hợp lệ!");
    return;
  }

  const progressTimer = uploadImageStore.startFakeProgress();

  try {
    // 1. Upload ảnh]
    const publicUrl = await uploadImage(selectedFile.value);
    if (!publicUrl) throw new Error("Upload failed");

    uploadProgress.value = 100;
    clearInterval(progressTimer);

    // 3. Ghi Database]
    const result = await presetStore.savePreset({
      title: form.value.title,
      category: form.value.category,
      thumbnail: publicUrl,
      data: parsedData,
    });

    if (result?.success) {
      toast.success("Đã lưu preset thành công!");
      setTimeout(() => emit("close"), 500);
    }
  } catch (error) {
    clearInterval(progressTimer);
    uploadProgress.value = 0;
    console.error("Save Error:", error);
    toast.error("Có lỗi xảy ra trong quá trình lưu.");
  }
};
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] bg-[#050505] flex flex-col overflow-hidden"
    >
      <header
        class="flex-none z-10 p-6 lg:px-12 lg:py-8 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl"
      >
        <div>
          <h1
            class="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white"
          >
            System: <span class="text-blue-500">Create</span>
          </h1>
          <p
            class="hidden md:block text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-1"
          >
            Thiết lập mẫu cấu hình AI vào database Wavespeed
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          ✕
        </button>
      </header>

      <main v-if="!isCropping" class="flex-1 overflow-y-auto no-scrollbar">
        <div class="container mx-auto px-6 py-10 lg:py-16">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div class="lg:col-span-5 space-y-6">
              <div class="space-y-4">
                <label
                  class="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center lg:text-left"
                >
                  Thumbnail Preview (3:4)
                </label>
                <PartsPromptBuilderPresetUploadFile
                  v-model="selectedFile"
                  :progress="uploadProgress"
                  @open-crop="isCropping = true"
                />
              </div>

              <div class="space-y-4 pt-4 border-t border-white/5">
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4"
                    >Title Name</label
                  >
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="E.g. Realistic Portrait..."
                    class="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4"
                    >Category</label
                  >
                  <div class="relative">
                    <select
                      v-model="form.category"
                      class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none appearance-none focus:border-blue-500 transition-all"
                    >
                      <option
                        v-for="cat in PRESET_CATEGORIES.filter(
                          (c) => c.value !== 'All'
                        )"
                        :key="cat.value"
                        :value="cat.value"
                      >
                        {{ cat.label }}
                      </option>
                    </select>
                    <div
                      class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                    >
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-7 flex flex-col">
              <label
                class="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4 mb-4"
              >
                AnalyzedData JSON Formula
              </label>
              <textarea
                v-model="form.jsonInput"
                class="w-full bg-black/40 border border-white/5 p-6 rounded-[2rem] text-blue-400 font-mono text-xs outline-none focus:border-blue-500/30 shadow-2xl min-h-[450px] lg:h-full lg:min-h-0 resize-none no-scrollbar"
                placeholder="{ 'subject': { ... }, 'tech': { ... } }"
              ></textarea>
            </div>
          </div>
        </div>
      </main>

      <footer
        v-if="!isCropping"
        class="flex-none p-6 lg:px-12 lg:py-8 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 z-10"
      >
        <div class="container mx-auto flex justify-end">
          <button
            @click="handleCreate"
            :disabled="isUploading || !selectedFile || !form.title"
            class="w-full lg:w-auto min-w-[280px] py-5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-600/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
          >
            <span
              v-if="isUploading"
              class="flex items-center justify-center gap-2"
            >
              <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deploying {{ Math.round(uploadProgress) }}%
            </span>
            <span v-else>Deploy to Wavespeed Database</span>
          </button>
        </div>
      </footer>

      <div
        v-if="isCropping"
        class="absolute inset-0 z-[300] bg-black flex flex-col"
      >
        <header
          class="p-6 flex justify-between items-center border-b border-white/5"
        >
          <h2 class="text-white text-xs font-black uppercase tracking-widest">
            Adjust Thumbnail
          </h2>
          <button
            @click="isCropping = false"
            class="text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </header>

        <div class="flex-1 overflow-hidden relative">
          <Cropper
            ref="cropperRef"
            :src="localPreviewUrl"
            :stencil-props="{ aspectRatio: 3 / 4 }"
            class="w-full h-full"
          />
        </div>

        <footer class="p-8 bg-[#0a0a0a] flex gap-4 justify-center">
          <button
            @click="isCropping = false"
            class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
          >
            Cancel
          </button>
          <button
            @click="uploadImageStore.applyCrop"
            class="px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Confirm Crop
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.vue-advanced-cropper__background) {
  background: #000;
}
:deep(.vue-advanced-cropper__stencils) {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
