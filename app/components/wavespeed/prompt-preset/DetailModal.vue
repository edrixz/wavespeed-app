<script setup lang="ts">
const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const store = useSeedreamPromptPresetStore();
const countdown = ref(0);
const timer = ref<any>(null);

const isEditing = ref(false);
const editForm = ref({
  title: "",
  width: 1024,
  height: 1024,
  prompt: "",
  negativePrompt: "",
  rating: 0,
});

watch(
  () => props.modelValue,
  () => {
    clearInterval(timer.value);
    countdown.value = 0;
    isEditing.value = false;
  },
);

const currentWidth = computed(() => {
  if (isEditing.value) return editForm.value.width;
  const [w] = (props.modelValue?.size || "1024*1024").split("*");
  return parseInt(w) || 1024;
});

const currentHeight = computed(() => {
  if (isEditing.value) return editForm.value.height;
  const [, h] = (props.modelValue?.size || "1024*1024").split("*");
  return parseInt(h) || 1024;
});

const currentPrompt = computed(() => {
  return isEditing.value ? editForm.value.prompt : props.modelValue?.prompt || "";
});

const currentNegativePrompt = computed(() => {
  return isEditing.value ? editForm.value.negativePrompt : props.modelValue?.negative_prompt || "";
});

const currentRating = computed({
  get: () => isEditing.value ? editForm.value.rating : props.modelValue?.rating || 0,
  set: (val: number) => { if (isEditing.value) editForm.value.rating = val; }
});

const startEdit = () => {
  const [w, h] = (props.modelValue.size || "1024*1024").split("*");
  editForm.value = {
    title: props.modelValue.title || "",
    width: parseInt(w) || 1024,
    height: parseInt(h) || 1024,
    prompt: props.modelValue.prompt || "",
    negativePrompt: props.modelValue.negative_prompt || "",
    rating: props.modelValue.rating || 0
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveEdit = async () => {
  const sizeStr = `${editForm.value.width}*${editForm.value.height}`;
  
  const result = await store.updatePresetDetails(props.modelValue.id, {
    title: editForm.value.title,
    size: sizeStr,
    prompt: editForm.value.prompt,
    negative_prompt: editForm.value.negativePrompt
  });
  
  if (editForm.value.rating !== (props.modelValue.rating || 0)) {
    await store.updatePresetRating(props.modelValue.id, editForm.value.rating);
  }

  if (result.success) {
    props.modelValue.title = editForm.value.title;
    props.modelValue.size = sizeStr;
    props.modelValue.prompt = editForm.value.prompt;
    props.modelValue.negative_prompt = editForm.value.negativePrompt;
    props.modelValue.rating = editForm.value.rating;
    isEditing.value = false;
  }
};

const handleApply = (item: any) => {
  store.applyPreset(item);
  emit("update:modelValue", null);
};

const startDelete = (id: string) => {
  if (countdown.value > 0) {
    store.deletePreset(id);
    emit("update:modelValue", null);
  } else {
    countdown.value = 5;
    timer.value = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer.value);
    }, 1000);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="ios-modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-99999 bg-white dark:bg-[#050505] flex flex-col h-dvh w-screen touch-none transition-colors"
      >
        <div class="absolute inset-0 z-0 pointer-events-none ambient-layer">
          <img
            :src="modelValue.thumbnail"
            class="w-full h-full object-cover scale-150 blur-[80px] opacity-30 saturate-150"
          />
          <div
            class="absolute inset-0 bg-white/60 dark:bg-black/60 transition-colors"
          ></div>
        </div>

        <div
          class="relative z-10 flex flex-col h-full max-h-full w-full overflow-hidden sm:m-6 sm:rounded-4xl sm:border sm:border-black/10 sm:dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-sm main-card will-change-transform shadow-2xl transition-colors"
        >
          <button
            @click="$emit('update:modelValue', false)"
            class="absolute top-4 right-4 z-100 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 text-gray-500 dark:text-white/70 hover:bg-white hover:text-black transition-all active:scale-90 ui-element shadow-sm"
          >
            ✕
          </button>

          <div class="relative w-full h-[38vh] shrink-0 hero-wrapper">
            <img
              :src="modelValue.thumbnail"
              class="w-full h-full object-cover hero-img"
            />
            <div
              class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-gray-100 dark:from-[#080808] to-transparent z-10 transition-colors"
            ></div>
          </div>

          <main
            class="flex-1 min-h-0 relative z-20 -mt-12 bg-gray-100 dark:bg-[#080808] rounded-t-4xl border-t border-black/5 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ui-element content-body flex flex-col transition-colors duration-300"
          >
            <div class="flex-1 overflow-y-auto no-scrollbar pt-8 px-6 pb-28">
              <div class="max-w-2xl mx-auto space-y-6">
                <div class="flex items-start justify-between gap-4 animate-in-up" style="--delay: 0.1s">
                  <div class="flex-1 min-w-0">
                    <h1 v-if="!isEditing" class="text-2xl font-black uppercase text-neutral-900 dark:text-white leading-tight tracking-wide">
                      {{ modelValue.title }}
                    </h1>
                    <input v-else v-model="editForm.title" class="text-2xl font-black uppercase text-neutral-900 dark:text-white leading-tight tracking-wide bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 w-full outline-none focus:border-blue-500 transition-colors" />
                  </div>

                  <!-- Edit Toggle -->
                  <div class="flex items-center gap-2 shrink-0 h-8">
                    <button v-if="!isEditing" @click="startEdit" class="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/20 px-2 py-1.5 rounded-full" title="Edit Preset">
                      <Icon name="lucide:pencil" size="14" />
                    </button>
                  </div>
                </div>

                <div class="space-y-6">

                  <div class="animate-in-up shadow-sm dark:shadow-none transition-colors" style="--delay: 0.2s">
                    <PartsFormBasePromptTextArea v-if="isEditing" v-model="editForm.prompt" label="Prompt" placeholder="Enter prompt here..." :rows="6" />
                    <PartsFormBasePromptTextArea v-else :model-value="currentPrompt" label="Prompt" :rows="6" readonly />
                  </div>

                  <div v-if="currentNegativePrompt || isEditing" class="animate-in-up shadow-sm dark:shadow-none transition-colors" style="--delay: 0.3s">
                    <PartsFormBasePromptTextArea v-if="isEditing" v-model="editForm.negativePrompt" label="Negative Prompt" variant="red" placeholder="Negative prompt..." :rows="4" />
                    <PartsFormBasePromptTextArea v-else :model-value="currentNegativePrompt" label="Negative Prompt" variant="red" :rows="4" readonly />
                  </div>

                  <!-- Size Settings Component -->
                  <div class="p-5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 animate-in-up shadow-sm dark:shadow-none transition-colors" style="--delay: 0.4s" :class="[!isEditing ? 'pointer-events-none opacity-80' : 'border-blue-500/30 dark:border-blue-500/30 bg-black/5']">
                    <!-- Ratio selector -->
                    <PartsAspectRatioList v-if="isEditing" v-model:width="editForm.width" v-model:height="editForm.height" />
                    <PartsAspectRatioList v-else :width="currentWidth" :height="currentHeight" />

                    <!-- Sliders -->
                    <div class="mt-4 flex gap-4">
                      <PartsFormBaseRangeSlider v-if="isEditing" v-model="editForm.width" label="Width" class="flex-1" />
                      <PartsFormBaseRangeSlider v-else :model-value="currentWidth" label="Width" class="flex-1" />
                      
                      <PartsFormBaseRangeSlider v-if="isEditing" v-model="editForm.height" label="Height" class="flex-1" />
                      <PartsFormBaseRangeSlider v-else :model-value="currentHeight" label="Height" class="flex-1" />
                    </div>
                  </div>

                  <!-- Rating at the bottom -->
                  <div class="animate-in-up shadow-sm dark:shadow-none transition-colors p-5 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center gap-3" style="--delay: 0.5s">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Rating</span>
                    <div :class="!isEditing ? 'pointer-events-none' : ''">
                      <PartsRatingStarRating v-model="currentRating" :size="24" />
                    </div>
                  </div>

                  <div class="h-10"></div>
                </div>
              </div>
            </div>
          </main>

          <div
            v-if="!isEditing"
            class="absolute bottom-4 left-4 right-4 z-40 animate-in-up ui-element pointer-events-none"
            style="--delay: 0.4s"
          >
            <div
              class="max-w-xl mx-auto p-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto transition-colors"
            >
              <button
                @click="startDelete(modelValue.id)"
                class="w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-all"
                :class="
                  countdown > 0
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'hover:bg-red-500/20 text-red-400'
                "
              >
                <span v-if="countdown > 0" class="text-[10px] font-bold">{{
                  countdown
                }}</span>
                <Icon v-else name="lucide:trash-2" size="18" />
              </button>
              <button
                @click="handleApply(modelValue)"
                class="flex-1 h-12 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:shadow-xl dark:shadow-white/20"
              >
                <span>Activate</span>
                <Icon name="lucide:arrow-right" size="14" />
              </button>
            </div>
          </div>

          <div
            v-else
            class="absolute bottom-4 left-4 right-4 z-40 animate-in-up ui-element pointer-events-none"
            style="--delay: 0.1s"
          >
            <div
              class="max-w-xl mx-auto p-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto transition-colors"
            >
              <button
                @click="cancelEdit"
                class="w-24 h-12 shrink-0 rounded-full flex items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-white/60 font-bold text-xs transition-all uppercase tracking-wider"
              >
                <Icon name="lucide:x" size="14" />
                Cancel
              </button>
              <button
                @click="saveEdit"
                :disabled="store.isSaving"
                class="flex-1 h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:shadow-xl dark:shadow-white/20"
              >
                <Icon v-if="store.isSaving" name="lucide:loader-2" size="16" class="animate-spin" />
                <Icon v-else name="lucide:save" size="16" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Giữ nguyên toàn bộ style Animation cũ */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Bỏ touch-none ở container chính để cho phép scroll nội dung */
/* .touch-none { touch-action: none; } -> XÓA DÒNG NÀY HOẶC CHỈ ÁP DỤNG CHO OVERLAY */

.ios-modal-enter-active {
  transition: opacity 0.5s ease;
}
.ios-modal-enter-from {
  opacity: 0;
}
.ios-modal-enter-active .hero-img {
  animation: imageSettleIn 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}
.ios-modal-enter-active .animate-in-up {
  animation: contentSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: var(--delay);
  transform: translateY(30px);
}

.ios-modal-leave-active {
  transition: opacity 0.4s ease-out;
  transition-delay: 0.1s;
}
.ios-modal-leave-to {
  opacity: 0;
}
.ios-modal-leave-active .hero-img {
  animation: none !important;
  transform: scale(1.3) !important;
  filter: blur(10px) brightness(0.5) !important;
  transition:
    transform 0.4s cubic-bezier(0.33, 1, 0.68, 1),
    filter 0.4s ease !important;
}
.ios-modal-leave-active .ui-element {
  animation: none !important;
  transform: translateY(100px) !important;
  opacity: 0 !important;
  transition: all 0.25s cubic-bezier(0.5, 0, 0.75, 0) !important;
}
.ios-modal-leave-active .main-card {
  transform: scale(0.96);
  border-radius: 48px;
  transition: all 0.4s ease;
}

@keyframes imageSettleIn {
  from {
    transform: scale(1.2);
    filter: blur(5px);
  }
  to {
    transform: scale(1);
    filter: blur(0);
  }
}
@keyframes contentSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
