<script setup lang="ts">
import { usePromptBuilderStore } from "~/stores/prompt";
const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const { clearAiData } = useAiGeneratedPromptStore();

const promptStore = usePromptBuilderStore();
const { subjects, currentSubject, activeSubjectId, scene } =
  storeToRefs(promptStore);

const isPresetSaveOpen = ref(false);
const isPresetCreateOpen = ref(false);

const openSection = ref("");
const toggle = (name: string) =>
  (openSection.value = openSection.value === name ? "" : name);
const toggleRefImage = (subjectId: string, imgIdx: number) => {
  const targetSubject = subjects.value.find((sub) => sub.id === subjectId);
  if (targetSubject) {
    targetSubject.refImageIdx =
      targetSubject.refImageIdx === imgIdx ? -1 : imgIdx;
  }
};

const handleRemoveSubject = (id: string) => {
  // 1. Xóa dữ liệu AI trước
  clearAiData(id);

  // 2. Sau đó mới xóa Subject trong promptStore
  promptStore.removeSubject(id);
};
</script>

<template>
  <div class="builder-container">
    <div
      class="flex flex-col gap-2 justify-between items-center border-b border-gray-700 pb-4"
    >
      <div class="w-full flex items-center gap-2 justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">🛠️</span>
          <h3 class="text-sm font-bold text-gray-200 uppercase tracking-wider">
            Prompt Builder
          </h3>
        </div>

        <!-- Copy Button -->
        <PartsButtonCopy />
      </div>

      <div class="flex w-full justify-between">
        <ImageAnalyzer />
      </div>

      <div class="flex gap-2 w-full">
        <button
          @click="isPresetSaveOpen = true"
          class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all"
        >
          + Lưu thành Preset
        </button>

        <PromptBuilderPresetSave
          :is-open="isPresetSaveOpen"
          @close="isPresetSaveOpen = false"
        />
      </div>

      <div class="flex gap-2 w-full">
        <button
          @click="isPresetCreateOpen = true"
          class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all"
        >
          + Tạo Preset
        </button>

        <PromptBuilderPresetCreate
          :is-open="isPresetCreateOpen"
          @close="isPresetCreateOpen = false"
        />
      </div>
    </div>

    <div
      class="bg-black/20 p-2 flex items-center gap-2 border-b-2 border-black/20 overflow-x-auto custom-scrollbar"
    >
      <button
        v-for="sub in subjects"
        :key="sub.id"
        @click="activeSubjectId = sub.id"
        class="flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold border-b-2 transition-all whitespace-nowrap"
        :class="
          activeSubjectId === sub.id
            ? 'bg-gray-800 text-blue-400 border-blue-500 shadow-sm'
            : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50'
        "
      >
        {{ sub.subject?.gender?.value || `Subject ${sub.id + 1}` }}
        <span
          v-if="subjects.length > 1"
          @click.stop="handleRemoveSubject(sub.id)"
          class="ml-1 text-gray-600 hover:text-red-400 p-0.5 rounded-full hover:bg-gray-700"
          >✕</span
        >
      </button>

      <button
        @click="promptStore.addSubject"
        class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 ml-1"
        title="Add Subject"
      >
        <span class="text-lg font-bold leading-none mb-0.5">+</span>
      </button>
    </div>

    <div v-if="currentSubject" class="bg-black/20 p-2 rounded-b-md">
      <!-- LINK FACE ID -->
      <div class="mb-5 bg-black/20 p-3 rounded border border-gray-700/50">
        <label
          class="text-[10px] text-gray-400 font-bold uppercase mb-2 flex justify-between"
        >
          <span>Link Face ID</span>
          <span
            class="text-blue-400 text-[9px] normal-case"
            v-if="currentSubject.refImageIdx !== -1"
            >Linked to Image #{{ currentSubject.refImageIdx + 1 }}</span
          >
        </label>
        <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          <div
            @click="currentSubject.refImageIdx = -1"
            class="h-12 w-12 rounded flex-shrink-0 flex items-center justify-center cursor-pointer border transition-all text-[10px] font-bold"
            :class="
              currentSubject.refImageIdx === -1
                ? 'bg-gray-700 border-gray-500 text-gray-300'
                : 'bg-gray-800 border-gray-700 text-gray-600 hover:bg-gray-700'
            "
          >
            None
          </div>
          <div
            v-for="(img, imgIdx) in images"
            :key="imgIdx"
            @click="toggleRefImage(currentSubject.id, imgIdx)"
            class="h-12 w-12 rounded flex-shrink-0 cursor-pointer border-2 relative overflow-hidden transition-all group"
            :class="
              currentSubject.refImageIdx === imgIdx
                ? 'border-blue-500 shadow-md scale-105 ring-2 ring-blue-500/20'
                : 'border-gray-700 opacity-60 hover:opacity-100'
            "
          >
            <img :src="img.url" class="w-full h-full object-cover" />
            <div
              class="absolute bottom-0 right-0 bg-blue-600 text-white text-[8px] px-1 font-bold"
            >
              #{{ imgIdx + 1 }}
            </div>
          </div>
        </div>
      </div>

      <PromptBuilderSection
        title="Identity & Body"
        color="white"
        :is-open="openSection === 'identity'"
        @toggle="toggle('identity')"
      >
        <PromptBuilderFormIdentityForm v-model="currentSubject.subject" />
      </PromptBuilderSection>

      <PromptBuilderSection
        title="Face Details"
        color="purple"
        :is-open="openSection === 'face'"
        @toggle="toggle('face')"
      >
        <PromptBuilderFormFaceForm v-model="currentSubject.face" />
      </PromptBuilderSection>

      <PromptBuilderSection
        title="Hair & Style"
        color="yellow"
        :is-open="openSection === 'hair'"
        @toggle="toggle('hair')"
      >
        <PromptBuilderFormHairForm :modelValue="currentSubject.hair" />
      </PromptBuilderSection>

      <PromptBuilderSection
        title="Outfit"
        color="green"
        :is-open="openSection === 'outfit'"
        @toggle="toggle('outfit')"
      >
        <PromptBuilderFormOutfitForm v-model="currentSubject.outfit" />
      </PromptBuilderSection>

      <PromptBuilderSection
        title="Pose"
        color="green"
        :is-open="openSection === 'pose'"
        @toggle="toggle('pose')"
      >
        <PromptBuilderFormPoseForm v-model="currentSubject.pose" />
      </PromptBuilderSection>
    </div>

    <!-- SCENE -->
    <div class="mt-6">
      <PromptBuilderSection
        title="Scene"
        color="blue"
        :is-open="openSection === 'scene'"
        @toggle="toggle('scene')"
      >
        <PromptBuilderFormSceneForm v-model="scene" />
      </PromptBuilderSection>
    </div>

    <PromptBuilderPromptPreview />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar ẩn cho Tab mượt mà */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
</style>
