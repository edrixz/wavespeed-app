<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

// 1. STORES & COMPOSABLES [cite: 2025-12-19]
const simpleStore = useSimplePresetStore();
const {
  presets,
  isLoading,
  isSaving: isStoreSaving,
} = storeToRefs(simpleStore);

const { uploadImage, isUploading } = useUploadToSupabase();
const uploadImageStore = useUploadImageStore();
const {
  selectedFile,
  uploadProgress,
  isCropping,
  cropperRef,
  localPreviewUrl,
} = storeToRefs(uploadImageStore);

const toast = useToast();

// 2. STATE QUẢN LÝ [cite: 2025-12-19]
const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);

const newPreset = ref({
  title: "",
  prompt: "",
  negative_prompt: "",
  size: "1024*1024",
});

// Logic Xóa 5s [cite: 2025-12-19]
const deleteCountdown = ref(0);
const deleteTimer = ref<any>(null);

onMounted(async () => {
  await simpleStore.fetchPresets();
});

// Reset form khi mở Create Dialog [cite: 2025-12-19]
watch(showCreateDialog, (val) => {
  if (val) {
    newPreset.value = {
      title: "",
      prompt: "",
      negative_prompt: "",
      size: "1024*1024",
    };
    uploadImageStore.initState();
  }
});

// Reset Countdown khi đóng Detail Dialog [cite: 2025-12-19]
watch(selectedPreset, (val) => {
  if (!val) {
    clearInterval(deleteTimer.value);
    deleteCountdown.value = 0;
  }
});

// 3. ACTIONS [cite: 2025-12-19]
const handleCreate = async () => {
  if (!newPreset.value.title || !newPreset.value.prompt) {
    return toast.warning("Vui lòng nhập Tiêu đề và Prompt.");
  }

  const progressTimer = uploadImageStore.startFakeProgress();
  try {
    let thumbUrl = null;
    if (selectedFile.value) {
      thumbUrl = await uploadImage(selectedFile.value); // Đảm bảo truyền đúng file object
    }

    clearInterval(progressTimer);
    uploadProgress.value = 100;

    const res = await simpleStore.savePreset({
      ...newPreset.value,
      thumbnail: thumbUrl || "",
    });

    if (res?.success) {
      showCreateDialog.value = false;
      toast.success("Hệ thống: Đã triển khai Preset mới.");
    }
  } catch (e) {
    clearInterval(progressTimer);
    toast.error("Lỗi: Quá trình lưu thất bại.");
  }
};

const startDeleteFlow = (id: string) => {
  if (deleteCountdown.value > 0) {
    executeDelete(id);
  } else {
    deleteCountdown.value = 5;
    deleteTimer.value = setInterval(() => {
      deleteCountdown.value--;
      if (deleteCountdown.value <= 0) clearInterval(deleteTimer.value);
    }, 1000);
  }
};

const executeDelete = async (id: string) => {
  clearInterval(deleteTimer.value);
  deleteCountdown.value = 0;
  const res = await simpleStore.deletePreset(id);
  if (res.success) selectedPreset.value = null;
};

const handleApply = (preset: any) => {
  simpleStore.applyPreset(preset);
  selectedPreset.value = null;
};
</script>

<template>
  <div class="w-full pt-2 pb-6 space-y-4">
    <div class="flex items-center gap-2 px-1">
      <div
        class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"
      ></div>
      <h3
        class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500"
      >
        System: Preset Gallery
      </h3>
    </div>

    <div
      class="flex overflow-x-auto gap-5 px-1 pb-5 no-scrollbar snap-x snap-mandatory min-h-[300px]"
    >
      <div
        @click="showCreateDialog = true"
        class="flex-none w-[200px] h-[280px] rounded-[32px] border-2 border-dashed border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 snap-start group"
      >
        <div
          class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-600 text-3xl font-light group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all duration-500"
        >
          +
        </div>
        <span
          class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-blue-400"
          >Add Style</span
        >
      </div>

      <template v-if="isLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="flex-none w-[200px] h-[280px] rounded-[32px] bg-white/[0.02] animate-pulse border border-white/5"
        ></div>
      </template>

      <div
        v-else
        v-for="item in presets"
        :key="item.id"
        @click="selectedPreset = item"
        class="flex-none w-[200px] h-[280px] rounded-[32px] relative overflow-hidden group cursor-pointer snap-start shadow-2xl transition-all duration-500 hover:scale-[1.02]"
      >
        <div class="absolute inset-0 bg-neutral-900">
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-60"
          ></div>
        </div>

        <div
          class="absolute inset-x-0 bottom-0 pt-20 pb-6 px-6 bg-gradient-to-t from-black via-black/70 to-transparent backdrop-blur-[6px] mask-gradient"
        >
          <h4
            class="text-white font-black text-[11px] uppercase tracking-wider truncate mb-1"
          >
            {{ item.title }}
          </h4>
          <span
            class="text-[8px] text-blue-400/60 font-mono font-bold tracking-widest"
            >{{ item.size }}</span
          >
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fullscreen">
        <div
          v-if="showCreateDialog"
          class="fixed inset-0 z-[500] bg-[#050505] flex flex-col overflow-hidden"
        >
          <header
            class="p-6 lg:p-10 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-2xl"
          >
            <div class="animate-item" style="--delay: 1">
              <h2
                class="text-2xl font-black uppercase tracking-tighter text-white"
              >
                Deploy <span class="text-blue-500">Quick Style</span>
              </h2>
              <p
                class="text-[8px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1"
              >
                Wavespeed Asset Management
              </p>
            </div>
            <button
              @click="showCreateDialog = false"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            >
              ✕
            </button>
          </header>

          <main
            v-if="!isCropping"
            class="flex-1 overflow-y-auto p-8 lg:p-20 no-scrollbar"
          >
            <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
              <div class="space-y-6 animate-item" style="--delay: 2">
                <label
                  class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block ml-2"
                  >Cover Asset (3:4)</label
                >
                <PartsPromptBuilderPresetUploadFile
                  v-model="selectedFile"
                  :progress="uploadProgress"
                  @open-crop="isCropping = true"
                />
              </div>

              <div class="space-y-8">
                <div class="space-y-3 animate-item" style="--delay: 3">
                  <label
                    class="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-4"
                    >Preset Name</label
                  >
                  <input
                    v-model="newPreset.title"
                    placeholder="E.g. Hyper-Realistic Skin..."
                    class="w-full bg-white/5 border border-white/10 p-6 rounded-[24px] text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div class="space-y-3 animate-item" style="--delay: 4">
                  <label
                    class="text-[9px] font-black uppercase text-blue-500/50 tracking-widest ml-4"
                    >Positive Prompt</label
                  >
                  <textarea
                    v-model="newPreset.prompt"
                    rows="5"
                    placeholder="Core visual prompt..."
                    class="w-full bg-blue-500/[0.02] border border-blue-500/10 p-6 rounded-[24px] text-[11px] text-blue-100/70 font-mono italic outline-none focus:border-blue-500/40 resize-none no-scrollbar"
                  />
                </div>

                <div class="space-y-3 animate-item" style="--delay: 5">
                  <label
                    class="text-[9px] font-black uppercase text-red-500/50 tracking-widest ml-4"
                    >Negative Constraints</label
                  >
                  <textarea
                    v-model="newPreset.negative_prompt"
                    rows="3"
                    placeholder="Exclude: blur, noise, low quality..."
                    class="w-full bg-red-500/[0.02] border border-red-500/10 p-6 rounded-[24px] text-[11px] text-red-100/40 font-mono italic outline-none focus:border-red-500/40 resize-none no-scrollbar"
                  />
                </div>
              </div>
            </div>
          </main>

          <footer
            v-if="!isCropping"
            class="p-8 lg:px-20 border-t border-white/5 bg-black/40 backdrop-blur-2xl flex justify-end animate-item"
            style="--delay: 6"
          >
            <button
              @click="handleCreate"
              :disabled="isUploading || isStoreSaving"
              class="w-full lg:w-auto min-w-[300px] py-6 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-blue-600/20 disabled:opacity-30 active:scale-95 transition-all"
            >
              {{
                isUploading
                  ? `Uploading ${Math.round(uploadProgress)}%`
                  : isStoreSaving
                  ? "Syncing..."
                  : "Confirm Deployment"
              }}
            </button>
          </footer>

          <div
            v-if="isCropping"
            class="absolute inset-0 z-[600] bg-black flex flex-col"
          >
            <header
              class="p-6 border-b border-white/5 flex justify-between items-center bg-black/80 backdrop-blur-xl"
            >
              <h2
                class="text-white text-xs font-black uppercase tracking-widest"
              >
                Adjust Asset Thumbnail
              </h2>
              <button
                @click="isCropping = false"
                class="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </header>
            <div class="flex-1 overflow-hidden">
              <Cropper
                ref="cropperRef"
                :src="localPreviewUrl"
                :stencil-props="{ aspectRatio: 3 / 4 }"
                class="w-full h-full"
              />
            </div>
            <footer class="p-10 flex justify-center gap-6 bg-[#0a0a0a]">
              <button
                @click="isCropping = false"
                class="text-gray-600 font-black uppercase text-[10px]"
              >
                Discard</button
              ><button
                @click="uploadImageStore.applyCrop"
                class="bg-white text-black px-16 py-5 rounded-2xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all"
              >
                Apply Crop
              </button>
            </footer>
          </div>
        </div>
      </Transition>

      <Transition name="fullscreen">
        <div
          v-if="selectedPreset"
          class="fixed inset-0 z-[500] bg-[#050505] flex flex-col overflow-hidden"
        >
          <header
            class="p-6 lg:p-10 flex items-center justify-between bg-black/40 backdrop-blur-2xl border-b border-white/5 z-20"
          >
            <div class="animate-item" style="--delay: 1">
              <h2
                class="text-2xl font-black uppercase tracking-tighter text-white"
              >
                {{ selectedPreset.title }}
              </h2>
              <p
                class="text-[8px] text-blue-500 font-black uppercase tracking-[0.4em] mt-1"
              >
                Asset ID: {{ selectedPreset.id.split("-")[0] }}
              </p>
            </div>
            <button
              @click="selectedPreset = null"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-gray-400"
            >
              ✕
            </button>
          </header>

          <main class="flex-1 overflow-y-auto no-scrollbar relative">
            <div
              class="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none"
            >
              <img
                v-if="selectedPreset.thumbnail"
                :src="selectedPreset.thumbnail"
                class="w-full h-full object-cover"
              />
            </div>

            <div
              class="relative z-10 container mx-auto px-8 py-12 lg:py-24 grid lg:grid-cols-12 gap-16 items-start"
            >
              <div class="lg:col-span-5 animate-item" style="--delay: 2">
                <div
                  class="aspect-[3/4] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 group"
                >
                  <img
                    v-if="selectedPreset.thumbnail"
                    :src="selectedPreset.thumbnail"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center text-gray-800 uppercase font-black tracking-tighter text-4xl"
                  >
                    No Image
                  </div>
                </div>
              </div>

              <div class="lg:col-span-7 space-y-10">
                <div
                  class="grid grid-cols-2 gap-6 animate-item"
                  style="--delay: 3"
                >
                  <div
                    class="bg-white/[0.03] p-6 rounded-3xl border border-white/5"
                  >
                    <p
                      class="text-[7px] text-gray-500 font-black uppercase mb-1 tracking-widest"
                    >
                      Dimension
                    </p>
                    <p class="text-sm text-white font-mono font-bold">
                      {{ selectedPreset.size || "Auto" }}
                    </p>
                  </div>
                  <div
                    class="bg-white/[0.03] p-6 rounded-3xl border border-white/5"
                  >
                    <p
                      class="text-[7px] text-gray-500 font-black uppercase mb-1 tracking-widest"
                    >
                      Created Date
                    </p>
                    <p class="text-sm text-white font-mono font-bold">
                      {{
                        new Date(selectedPreset.created_at).toLocaleDateString()
                      }}
                    </p>
                  </div>
                </div>

                <div class="space-y-4 animate-item" style="--delay: 4">
                  <label
                    class="text-[9px] font-black uppercase text-blue-500/50 tracking-[0.3em] ml-2"
                    >Primary Prompt</label
                  >
                  <div
                    class="bg-blue-500/[0.03] p-8 rounded-[32px] border border-blue-500/10 shadow-inner"
                  >
                    <p
                      class="text-sm lg:text-base text-blue-100/80 leading-relaxed italic font-mono"
                    >
                      "{{ selectedPreset.prompt }}"
                    </p>
                  </div>
                </div>

                <div
                  v-if="selectedPreset.negative_prompt"
                  class="space-y-4 animate-item"
                  style="--delay: 5"
                >
                  <label
                    class="text-[9px] font-black uppercase text-red-500/50 tracking-[0.3em] ml-2"
                    >Excluded Constraints</label
                  >
                  <div
                    class="bg-red-500/[0.03] p-8 rounded-[32px] border border-red-500/10 shadow-inner"
                  >
                    <p
                      class="text-xs lg:text-sm text-red-100/40 leading-relaxed italic font-mono"
                    >
                      {{ selectedPreset.negative_prompt }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer
            class="p-8 lg:p-12 border-t border-white/5 bg-black/60 backdrop-blur-2xl z-20"
          >
            <div
              class="container mx-auto flex flex-col md:flex-row gap-6 items-center justify-between"
            >
              <button
                @click="startDeleteFlow(selectedPreset.id)"
                :class="
                  deleteCountdown > 0
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-red-500/30 hover:text-red-500'
                "
                class="order-2 md:order-1 text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
              >
                {{
                  deleteCountdown > 0
                    ? `Confirm Removal (${deleteCountdown}s)`
                    : "Delete Asset"
                }}
              </button>
              <button
                @click="handleApply(selectedPreset)"
                class="order-1 md:order-2 w-full md:w-auto min-w-[400px] py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
              >
                Activate Configuration
              </button>
            </div>
          </footer>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Gradient Mask cho Gallery [cite: 2025-12-19] */
.mask-gradient {
  -webkit-mask-image: linear-gradient(to top, black 50%, transparent 100%);
  mask-image: linear-gradient(to top, black 50%, transparent 100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* FULLSCREEN TRANSITION [cite: 2025-12-19] */
.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.fullscreen-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.fullscreen-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* STAGGERED ITEM ANIMATION [cite: 2025-12-19] */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-item {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--delay) * 0.1s + 0.3s);
}

:deep(.vue-advanced-cropper__background) {
  background: #000;
}
</style>
