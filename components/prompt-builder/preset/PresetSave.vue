<script setup lang="ts">
import { ref, watch } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { PRESET_CATEGORIES } from "~/consts";
import { usePresetStore } from "~/stores/prompt/preset-store";
import { useAiGeneratedPromptStore } from "~/stores/prompt/ai-generated-prompt-store";
import { usePromptBuilderStore } from "~/stores/prompt/prompt-builder-store";
import { useUploadImageStore } from "~/stores/image/upload-image-store";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

// Stores & Composables
const { uploadImage, isUploading } = useUploadToSupabase();
const presetStore = usePresetStore();
const aiStore = useAiGeneratedPromptStore();
const promptBuilderStore = usePromptBuilderStore();
const uploadImageStore = useUploadImageStore();
const {
  selectedFile,
  uploadProgress,
  isCropping,
  cropperRef,
  localPreviewUrl,
} = storeToRefs(uploadImageStore);

const toast = useToast();

// UI State
const form = ref({ title: "", category: "Fine Art" });

// 1. RESET DỮ LIỆU KHI MỞ MODAL
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.value = { title: "", category: "Fine Art" };
      uploadImageStore.initState();
    }
  }
);

// 5. CHỨC NĂNG LƯU (Lazy Upload)
const handleSave = async () => {
  if (!selectedFile.value || !form.value.title)
    return toast.warning("Vui lòng điền đủ thông tin");

  // Bước A: Lấy dữ liệu công thức AI
  const currentData = promptBuilderStore.activeSubjectId
    ? aiStore.generatedData[promptBuilderStore.activeSubjectId]
    : null;

  if (!currentData)
    return toast.warning("Không có dữ liệu công thức AI để lưu!");

  const progressTimer = uploadImageStore.startFakeProgress();

  try {
    if (currentData) {
      // Bước B: Upload ảnh lên Supabase
      const publicUrl = await uploadImage(selectedFile.value);
      if (publicUrl) {
        uploadProgress.value = 100;
        clearInterval(progressTimer);

        // Bước C: Ghi Database
        const result = await presetStore.savePreset({
          ...form.value,
          thumbnail: publicUrl,
          data: currentData,
        });

        if (result?.success) {
          toast.success("Đã lưu preset thành công!");
          setTimeout(() => emit("close"), 500); // Đóng modal sau khi hoàn tất animation
        }
      }
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
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-6 bg-black/95 backdrop-blur-md"
    >
      <div
        v-if="!isCropping"
        class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div
          class="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] z-20"
        >
          <h3
            class="text-[10px] font-black uppercase tracking-[0.4em] text-white"
          >
            New Preset
          </h3>
          <button
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 no-scrollbar">
          <div class="space-y-6">
            <div class="space-y-4">
              <label
                class="text-[9px] font-black text-gray-500 uppercase tracking-widest block text-center"
                >Thumbnail</label
              >
              <PromptBuilderPresetUploadFile
                v-model="selectedFile"
                :progress="uploadProgress"
                @open-crop="isCropping = true"
              />
            </div>

            <div class="space-y-2">
              <label
                class="text-[9px] font-black text-gray-500 uppercase tracking-widest"
                >Preset Title</label
              >
              <input
                v-model="form.title"
                type="text"
                placeholder="VD: Dark Cinematic"
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-700"
              />
            </div>

            <div class="space-y-2">
              <label
                class="text-[9px] font-black text-gray-500 uppercase tracking-widest"
                >Category</label
              >
              <select
                v-model="form.category"
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none"
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
            </div>
          </div>
        </div>

        <div class="p-6 lg:p-8 bg-white/[0.01] border-t border-white/5">
          <button
            @click="handleSave"
            :disabled="isUploading || !selectedFile"
            class="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_40px_rgba(37,99,235,0.2)] transition-all active:scale-95"
          >
            {{
              isUploading
                ? `Uploading ${Math.round(uploadProgress)}%`
                : "Confirm & Save"
            }}
          </button>
        </div>
      </div>

      <div
        v-else
        class="w-full max-w-2xl h-full lg:h-auto lg:aspect-[3/4] bg-black lg:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500"
      >
        <div class="flex-1 bg-black flex items-center justify-center p-4">
          <Cropper
            ref="cropperRef"
            :src="localPreviewUrl"
            :stencil-props="{ aspectRatio: 3 / 4 }"
            class="w-full h-full"
          />
        </div>

        <div
          class="p-6 lg:p-10 bg-[#0a0a0a] border-t border-white/5 flex gap-4 lg:gap-8 justify-center z-[200]"
        >
          <button
            @click="isCropping = false"
            class="flex-1 lg:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
          >
            Back
          </button>
          <button
            @click="uploadImageStore.applyCrop"
            class="flex-[2] lg:flex-none px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Ẩn scrollbar để giao diện sạch hơn */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Tùy chỉnh Cropper cho Dark Mode */
:deep(.vue-advanced-cropper__background) {
  background: #000;
}
:deep(.vue-advanced-cropper__stencils) {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
