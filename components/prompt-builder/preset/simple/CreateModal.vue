<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const uploadStore = useUploadImageStore();
const {
  selectedFile,
  uploadProgress,
  isCropping,
  localPreviewUrl,
  cropperRef,
} = storeToRefs(uploadStore);
const simpleStore = useSimplePresetStore();
const { uploadImage } = useUploadToSupabase();

const form = ref({
  title: "",
  prompt: "",
  negative_prompt: "",
  size: "1024*1024",
});

const close = () => {
  emit("update:modelValue", false);
  uploadStore.initState();
};

const handleSave = async () => {
  if (!form.value.title || !form.value.prompt) return;
  const timer = uploadStore.startFakeProgress();
  try {
    let url = selectedFile.value ? await uploadImage(selectedFile.value) : "";
    clearInterval(timer);
    await simpleStore.savePreset({ ...form.value, thumbnail: url || "" });
    close();
  } catch (e) {
    clearInterval(timer);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] bg-[#050505] flex flex-col sm:m-4 sm:rounded-[40px] border border-white/5 overflow-hidden shadow-2xl"
      >
        <header
          class="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl"
        >
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-blue-500 rounded-sm rotate-45"></div>
            <h2
              class="text-sm font-black uppercase tracking-[0.2em] text-white"
            >
              New Intelligence Asset
            </h2>
          </div>
          <button
            @click="close"
            class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400"
          >
            ✕
          </button>
        </header>

        <main
          class="flex-1 overflow-y-auto p-6 sm:p-12 no-scrollbar space-y-10"
        >
          <div class="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
            <div class="space-y-4">
              <label
                class="text-[9px] font-black uppercase tracking-widest text-gray-600"
                >Visual Core</label
              >
              <PromptBuilderPresetUploadFile
                v-model="selectedFile"
                :progress="uploadProgress"
                @open-crop="isCropping = true"
              />
            </div>

            <div class="space-y-6">
              <input
                v-model="form.title"
                placeholder="ASSET TITLE"
                class="asset-input"
              />
              <textarea
                v-model="form.prompt"
                rows="5"
                placeholder="CORE PROMPT DATA..."
                class="asset-textarea bg-blue-500/5 text-blue-100"
              />
              <textarea
                v-model="form.negative_prompt"
                rows="3"
                placeholder="NEGATIVE CONSTRAINTS..."
                class="asset-textarea bg-red-500/5 text-red-100/40"
              />
            </div>
          </div>
        </main>

        <footer
          class="p-6 border-t border-white/5 bg-black/50 flex justify-end px-12"
        >
          <button
            @click="handleSave"
            class="w-full sm:w-64 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            {{
              uploadProgress > 0
                ? `DEPLOYING... ${Math.round(uploadProgress)}%`
                : "Commit Changes"
            }}
          </button>
        </footer>

        <div
          v-if="isCropping"
          class="absolute inset-0 z-[1100] bg-black flex flex-col"
        >
          <div class="flex-1 bg-black">
            <Cropper
              ref="cropperRef"
              :src="localPreviewUrl"
              :stencil-props="{ aspectRatio: 3 / 4 }"
              class="h-full w-full"
            />
          </div>
          <footer class="p-8 bg-[#0a0a0a] flex justify-center gap-6">
            <button
              @click="isCropping = false"
              class="text-[10px] font-black uppercase text-gray-500"
            >
              Abort
            </button>
            <button
              @click="uploadStore.applyCrop"
              class="px-12 py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase"
            >
              Apply Matrix
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.asset-input {
  @apply w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl text-[11px] font-bold text-white outline-none focus:border-blue-500 transition-all uppercase tracking-widest;
}
.asset-textarea {
  @apply w-full border border-white/5 p-5 rounded-3xl text-[10px] font-mono italic outline-none focus:border-blue-500 transition-all;
}
.modal-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.9);
}
</style>
