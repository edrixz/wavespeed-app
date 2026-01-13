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
    <Transition name="modal-ios">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] bg-[#050505] flex flex-col overflow-hidden sm:m-4 sm:rounded-[40px] border border-white/5 shadow-2xl"
      >
        <header
          class="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl z-20"
        >
          <div class="flex items-center gap-3 animate-item" style="--delay: 1">
            <div
              class="w-3 h-3 bg-blue-500 rounded-sm rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            ></div>
            <h2
              class="text-sm font-black uppercase tracking-[0.2em] text-white"
            >
              Create New Engine Asset
            </h2>
          </div>
          <button
            @click="close"
            class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </header>

        <main
          v-if="!isCropping"
          class="flex-1 overflow-y-auto p-6 sm:p-12 no-scrollbar space-y-12"
        >
          <div class="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
            <div class="space-y-4 animate-item" style="--delay: 2">
              <label
                class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-2"
                >Visual Core Integration</label
              >
              <PromptBuilderPresetUploadFile
                v-model="selectedFile"
                :progress="uploadProgress"
                @open-crop="isCropping = true"
              />
            </div>

            <div class="space-y-6">
              <div class="animate-item" style="--delay: 3">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-2"
                  >Asset Identity</label
                >
                <input
                  v-model="form.title"
                  placeholder="ENTER UNIQUE TITLE..."
                  class="asset-input"
                />
              </div>

              <div class="animate-item" style="--delay: 4">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-blue-500/50 ml-2"
                  >Primary Instructions</label
                >
                <textarea
                  v-model="form.prompt"
                  rows="5"
                  placeholder="DECODE YOUR STYLE..."
                  class="asset-textarea bg-blue-500/[0.03] text-blue-100 border-blue-500/10 focus:border-blue-500/40"
                />
              </div>

              <div class="animate-item" style="--delay: 5">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-red-500/50 ml-2"
                  >Forbidden Patterns</label
                >
                <textarea
                  v-model="form.negative_prompt"
                  rows="3"
                  placeholder="AVOID THESE ELEMENTS..."
                  class="asset-textarea bg-red-500/[0.03] text-red-100/30 border-red-500/10 focus:border-red-500/40"
                />
              </div>
            </div>
          </div>
        </main>

        <footer
          v-if="!isCropping"
          class="p-8 border-t border-white/5 bg-black/50 backdrop-blur-xl flex justify-end animate-item"
          style="--delay: 6"
        >
          <button
            @click="handleSave"
            class="w-full sm:w-80 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:scale-95 transition-all"
          >
            {{
              uploadProgress > 0
                ? `DEPLOYING CORE... ${Math.round(uploadProgress)}%`
                : "Execute Deployment"
            }}
          </button>
        </footer>

        <Transition name="fade">
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
            <footer
              class="p-8 bg-[#0a0a0a] flex justify-center gap-6 border-t border-white/5"
            >
              <button
                @click="isCropping = false"
                class="text-[10px] font-black uppercase text-gray-500"
              >
                Abort
              </button>
              <button
                @click="uploadStore.applyCrop"
                class="px-12 py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase shadow-xl"
              >
                Apply Transformation
              </button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.asset-input {
  @apply w-full bg-white/[0.03] border border-white/10 p-5 rounded-3xl text-[11px] font-bold text-white outline-none focus:border-blue-500 transition-all uppercase tracking-widest placeholder:text-gray-800;
}
.asset-textarea {
  @apply w-full border p-5 rounded-[32px] text-[10px] font-mono italic outline-none transition-all placeholder:text-gray-800;
}

/* Modal iOS Style Transition */
.modal-ios-enter-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-ios-leave-active {
  transition: all 0.5s cubic-bezier(0.7, 0, 0.84, 0);
}
.modal-ios-enter-from {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}
.modal-ios-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Staggered Item Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-item {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay) * 0.12s + 0.3s);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
