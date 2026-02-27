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
const store = useSeedreamPromptPresetStore();
const { uploadImage } = useUploadToSupabase();

const form = ref({
  title: "",
  prompt: "",
  negative_prompt: "",
  size: "2752*4096",
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
    await store.savePreset({ ...form.value, thumbnail: url || "" });
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
        class="fixed inset-0 z-1001 bg-white/90 dark:bg-[#050505] backdrop-blur-3xl flex flex-col overflow-hidden sm:m-4 sm:rounded-4xl border border-black/10 dark:border-white/5 shadow-2xl transition-colors"
      >
        <header
          class="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-xl z-20 transition-colors"
        >
          <div class="flex items-center gap-4 animate-item" style="--delay: 1">
            <div
              class="w-3 h-3 bg-blue-500 rounded-sm rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            ></div>
            <h2
              class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white"
            >
              Create New Engine Asset
            </h2>
          </div>
          <button
            @click="close"
            class="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-black/10 dark:hover:bg-white/10 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
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
              <WavespeedPromptPresetUploadFile
                v-model="selectedFile"
                :progress="uploadProgress"
                @open-crop="isCropping = true"
              />
            </div>

            <div class="space-y-6">
              <div class="animate-item" style="--delay: 3">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-600 ml-2"
                  >Asset Identity</label
                >
                <input
                  v-model="form.title"
                  placeholder="ENTER UNIQUE TITLE..."
                  class="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-3xl text-[11px] font-bold text-neutral-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all uppercase tracking-widest placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              <div class="animate-item" style="--delay: 4">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-blue-600/70 dark:text-blue-500/50 ml-2"
                  >Primary Instructions</label
                >
                <textarea
                  v-model="form.prompt"
                  rows="5"
                  placeholder="DECODE YOUR STYLE..."
                  class="w-full border p-5 rounded-4xl text-[10px] font-mono italic outline-none transition-all placeholder:text-blue-300 dark:placeholder:text-gray-800 bg-blue-500/5 text-blue-900 dark:bg-blue-500/3 dark:text-blue-100 border-blue-500/20 dark:border-blue-500/10 focus:border-blue-500/50 dark:focus:border-blue-500/40"
                />
              </div>

              <div class="animate-item" style="--delay: 5">
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-red-600/70 dark:text-red-500/50 ml-2"
                  >Forbidden Patterns</label
                >
                <textarea
                  v-model="form.negative_prompt"
                  rows="3"
                  placeholder="AVOID THESE ELEMENTS..."
                  class="w-full border p-5 rounded-4xl text-[10px] font-mono italic outline-none transition-all placeholder:text-red-300 dark:placeholder:text-gray-800 bg-red-500/5 text-red-900/60 dark:bg-red-500/3 dark:text-red-100/30 border-red-500/20 dark:border-red-500/10 focus:border-red-500/50 dark:focus:border-red-500/40"
                />
              </div>
            </div>
          </div>
        </main>

        <footer
          v-if="!isCropping"
          class="p-8 border-t border-black/10 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl flex justify-end animate-item transition-colors"
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
            class="absolute inset-0 z-1100 bg-white dark:bg-black flex flex-col transition-colors"
          >
            <div class="flex-1 bg-white dark:bg-black transition-colors">
              <Cropper
                ref="cropperRef"
                :src="localPreviewUrl"
                :stencil-props="{ aspectRatio: 3 / 4 }"
                class="h-full w-full"
              />
            </div>
            <footer
              class="p-8 bg-neutral-50 dark:bg-[#0a0a0a] flex justify-center gap-6 border-t border-black/5 dark:border-white/5 transition-colors"
            >
              <button
                @click="isCropping = false"
                class="text-[10px] font-black uppercase text-gray-500"
              >
                Abort
              </button>
              <button
                @click="uploadStore.applyCrop"
                class="px-12 py-4 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-xl text-[10px] font-black uppercase shadow-xl"
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
