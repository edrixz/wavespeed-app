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
const searchQuery = ref("");
const showCreateDialog = ref(false);
const selectedPreset = ref<any | null>(null);
const isWaitingForImages = ref(true); // Kiểm soát độ trễ 1s để tránh giật UI [cite: 2025-12-19]

const newPreset = ref({
  title: "",
  prompt: "",
  negative_prompt: "",
  size: "1024*1024",
});

// Lọc preset thời gian thực [cite: 2025-12-19]
const filteredPresets = computed(() => {
  if (!searchQuery.value.trim()) return presets.value;
  const q = searchQuery.value.toLowerCase();
  return presets.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
  );
});

// Logic Xóa 5s Confirm [cite: 2025-12-19]
const deleteCountdown = ref(0);
const deleteTimer = ref<any>(null);

// 3. LIFECYCLE [cite: 2025-12-19]
onMounted(async () => {
  isWaitingForImages.value = true;
  await simpleStore.fetchPresets();
  // Tạo độ trễ nhân tạo 1s để ảnh load mượt mà [cite: 2025-12-19]
  setTimeout(() => {
    isWaitingForImages.value = false;
  }, 1000);
});

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

watch(selectedPreset, (val) => {
  if (!val) {
    clearInterval(deleteTimer.value);
    deleteCountdown.value = 0;
  }
});

// 4. ACTIONS [cite: 2025-12-19]
const handleApply = (preset: any) => {
  simpleStore.applyPreset(preset);
  selectedPreset.value = null;
};

const handleCreate = async () => {
  if (!newPreset.value.title || !newPreset.value.prompt)
    return toast.warning("Thiếu dữ liệu.");
  const progressTimer = uploadImageStore.startFakeProgress();
  try {
    let thumbUrl = null;
    if (selectedFile.value) thumbUrl = await uploadImage(selectedFile.value);
    clearInterval(progressTimer);
    // Sử dụng user.value.sub bên trong store
    const res = await simpleStore.savePreset({
      ...newPreset.value,
      thumbnail: thumbUrl || "",
    });
    if (res?.success) showCreateDialog.value = false;
  } catch (e) {
    clearInterval(progressTimer);
    toast.error("Lỗi hệ thống.");
  }
};

const startDeleteFlow = (id: string) => {
  if (deleteCountdown.value > 0) executeDelete(id);
  else {
    deleteCountdown.value = 5;
    deleteTimer.value = setInterval(() => {
      deleteCountdown.value--;
      if (deleteCountdown.value <= 0) clearInterval(deleteTimer.value);
    }, 1000);
  }
};

const executeDelete = async (id: string) => {
  clearInterval(deleteTimer.value);
  const res = await simpleStore.deletePreset(id);
  if (res.success) selectedPreset.value = null;
};
</script>

<template>
  <div class="w-full pt-2 pb-6 space-y-4">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <div
          class="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        ></div>
        <h3
          class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500"
        >
          Preset Gallery
        </h3>
      </div>
      <div class="flex items-center gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 text-[8px] text-white outline-none focus:border-blue-500/30 w-24 focus:w-40 transition-all duration-500 font-bold uppercase tracking-widest placeholder:text-gray-700"
        />
        <button
          @click="showCreateDialog = true"
          class="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      class="flex overflow-x-auto gap-4 px-1 pb-4 no-scrollbar snap-x snap-mandatory min-h-[220px]"
    >
      <template v-if="isLoading || isWaitingForImages">
        <div
          v-for="i in 5"
          :key="i"
          class="flex-none w-[120px] h-[200px] rounded-[24px] bg-white/[0.03] border border-white/5 relative overflow-hidden"
        >
          <div class="shimmer-effect absolute inset-0 opacity-40"></div>
          <div
            class="absolute bottom-4 left-4 w-3/4 h-2 bg-white/10 rounded-full"
          ></div>
        </div>
      </template>

      <template v-else>
        <TransitionGroup name="card-list" tag="div" class="flex gap-4">
          <div
            v-for="item in filteredPresets"
            :key="item.id"
            @click="selectedPreset = item"
            class="flex-none w-[120px] h-[200px] rounded-[24px] relative overflow-hidden group cursor-pointer snap-start shadow-xl border border-white/5"
          >
            <div
              class="absolute inset-0 bg-neutral-900 transition-transform duration-700 group-hover:scale-110"
            >
              <img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-indigo-900 to-black opacity-60"
              ></div>
            </div>
            <div
              class="absolute inset-x-0 bottom-0 pt-12 pb-4 px-4 bg-gradient-to-t from-black via-black/70 to-transparent backdrop-blur-[4px] mask-gradient"
            >
              <h4
                class="text-white font-black text-[9px] uppercase tracking-wider truncate mb-0.5"
              >
                {{ item.title }}
              </h4>
              <span class="text-[6px] text-blue-400/60 font-mono font-bold">{{
                item.size
              }}</span>
            </div>
          </div>
        </TransitionGroup>

        <div
          v-if="filteredPresets.length === 0"
          class="flex-none w-full flex flex-col items-center justify-center space-y-2 opacity-30 h-[200px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p
            class="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500"
          >
            Resource Not Found
          </p>
        </div>
      </template>
    </div>

    <Teleport to="body">
      <Transition name="fullscreen">
        <div
          v-if="showCreateDialog"
          class="fixed inset-0 z-[999] bg-[#050505] flex flex-col overflow-hidden"
        >
          <header
            class="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-2xl"
          >
            <div class="animate-item" style="--delay: 1">
              <h2 class="text-xl font-black uppercase text-white">
                Deploy <span class="text-blue-500">Quick Style</span>
              </h2>
            </div>
            <button
              @click="showCreateDialog = false"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>
          </header>
          <main
            v-if="!isCropping"
            class="flex-1 overflow-y-auto p-10 lg:p-20 no-scrollbar"
          >
            <div class="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
              <div class="animate-item" style="--delay: 2">
                <PartsPromptBuilderPresetUploadFile
                  v-model="selectedFile"
                  :progress="uploadProgress"
                  @open-crop="isCropping = true"
                />
              </div>
              <div class="space-y-6">
                <div class="animate-item" style="--delay: 3">
                  <input
                    v-model="newPreset.title"
                    placeholder="Asset Name"
                    class="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div class="animate-item" style="--delay: 4">
                  <textarea
                    v-model="newPreset.prompt"
                    rows="5"
                    placeholder="Positive prompt"
                    class="w-full bg-blue-500/[0.02] border border-blue-500/10 p-5 rounded-2xl text-[10px] text-blue-100 font-mono italic outline-none"
                  />
                </div>
                <div class="animate-item" style="--delay: 5">
                  <textarea
                    v-model="newPreset.negative_prompt"
                    rows="3"
                    placeholder="Negative constraints"
                    class="w-full bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl text-[10px] text-red-100/40 font-mono italic outline-none"
                  />
                </div>
              </div>
            </div>
          </main>
          <footer
            v-if="!isCropping"
            class="p-8 border-t border-white/5 bg-black/40 backdrop-blur-2xl flex justify-end"
          >
            <button
              @click="handleCreate"
              :disabled="isUploading || isStoreSaving"
              class="min-w-[240px] py-5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              {{
                isUploading
                  ? `Uploading ${Math.round(uploadProgress)}%`
                  : "Confirm Deployment"
              }}
            </button>
          </footer>
          <div
            v-if="isCropping"
            class="absolute inset-0 z-[1000] bg-black flex flex-col"
          >
            <div class="flex-1 relative">
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
                class="text-gray-600 uppercase text-[10px]"
              >
                Discard</button
              ><button
                @click="uploadImageStore.applyCrop"
                class="bg-white text-black px-16 py-5 rounded-2xl text-[10px] font-black uppercase transition-all"
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
          class="fixed inset-0 z-[999] bg-[#050505] flex flex-col overflow-hidden"
        >
          <header
            class="p-6 flex items-center justify-between bg-black/40 backdrop-blur-2xl border-b border-white/5"
          >
            <div class="animate-item" style="--delay: 1">
              <h2 class="text-xl font-black uppercase text-white">
                {{ selectedPreset.title }}
              </h2>
            </div>
            <button
              @click="selectedPreset = null"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>
          </header>
          <main
            class="flex-1 overflow-y-auto no-scrollbar p-10 lg:p-20 relative"
          >
            <div
              class="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-start"
            >
              <div class="lg:col-span-5 animate-item" style="--delay: 2">
                <div
                  class="aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
                >
                  <img
                    v-if="selectedPreset.thumbnail"
                    :src="selectedPreset.thumbnail"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="lg:col-span-7 space-y-8">
                <div class="animate-item" style="--delay: 3">
                  <div
                    class="bg-blue-500/[0.03] p-6 rounded-[24px] border border-blue-500/10"
                  >
                    <p
                      class="text-[11px] text-blue-100 italic font-mono leading-relaxed"
                    >
                      "{{ selectedPreset.prompt }}"
                    </p>
                  </div>
                </div>
                <div
                  v-if="selectedPreset.negative_prompt"
                  class="animate-item"
                  style="--delay: 4"
                >
                  <div
                    class="bg-red-500/[0.03] p-6 rounded-[24px] border border-red-500/10"
                  >
                    <p
                      class="text-[10px] text-red-100/40 italic font-mono leading-relaxed"
                    >
                      {{ selectedPreset.negative_prompt }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer
            class="p-8 border-t border-white/5 bg-black/60 backdrop-blur-2xl flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <button
              @click="startDeleteFlow(selectedPreset.id)"
              :class="
                deleteCountdown > 0
                  ? 'bg-red-600 text-white animate-pulse shadow-red-600/20 shadow-xl'
                  : 'text-red-500/30'
              "
              class="text-[9px] font-black uppercase px-6 py-4 rounded-xl transition-all"
            >
              {{
                deleteCountdown > 0
                  ? `Confirm (${deleteCountdown}s)`
                  : "Delete Asset"
              }}
            </button>
            <button
              @click="handleApply(selectedPreset)"
              class="min-w-[300px] py-5 bg-white text-black text-[10px] font-black uppercase rounded-2xl shadow-xl transition-all active:scale-95"
            >
              Activate Style
            </button>
          </footer>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.shimmer-effect {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-list-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
  position: absolute;
}
.card-list-move {
  transition: transform 0.5s ease;
}

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

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.fullscreen-enter-from,
.fullscreen-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

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
