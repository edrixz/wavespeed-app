<script setup lang="ts">
import { useSubjectStore } from "~/stores/common/subject-store";
import type { Subject } from "~/types";

const props = defineProps<{
  uploadMulti?: boolean;
}>();

const imageStore = useImagesStore();
const subjectStore = useSubjectStore();
const { images } = storeToRefs(imageStore);

const {
  addInputRef,
  replaceInputRef,
  addImage,
  replaceImage,
  onAddChange,
  onReplaceChange,
  removeImage,
} = useImageUploader();

/** Modal & Subject Picker state */
const isSubjectModalOpen = ref(false);
const replaceIndex = ref<number | null>(null);

const openSubjectPicker = (index: number | null = null) => {
  replaceIndex.value = index;
  isSubjectModalOpen.value = true;
  subjectStore.fetchSubjects(); // Fetch just in case it's not loaded
};

const selectSubject = (subject: Subject) => {
  if (replaceIndex.value !== null) {
    imageStore.replaceUrlAt(replaceIndex.value, subject.image);
  } else {
    imageStore.addUrl(subject.image);
  }
  isSubjectModalOpen.value = false;
  replaceIndex.value = null;
};

/** Dropdown actions */
const addActions = [
  {
    label: "Upload from Device",
    icon: "i-heroicons-arrow-up-tray",
    click: addImage,
  },
  {
    label: "Choose Subject",
    icon: "lucide:user",
    click: () => openSubjectPicker(null),
  },
];

const getReplaceActions = (idx: number) => [
  {
    label: "Upload New Image",
    icon: "i-heroicons-arrow-up-tray",
    click: () => replaceImage(idx),
  },
  {
    label: "Replace with Subject",
    icon: "lucide:user",
    click: () => openSubjectPicker(idx),
  },
];
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-end mb-2">
      <label
        class="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-gray-300 transition-colors"
      >
        Reference Images
        <span
          class="text-xs text-gray-500 font-normal"
          v-if="images.length > 0"
        >
          ({{ images.length }} active)
        </span>
      </label>
    </div>

    <input
      v-if="uploadMulti"
      ref="addInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onAddChange"
    />
    <input
      ref="replaceInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onReplaceChange"
    />

    <div class="grid grid-cols-3 gap-3">
      <!-- Existing Images -->
      <PartsDropdownActionDropdown
        v-for="(img, idx) in images"
        :key="idx"
        :items="getReplaceActions(idx)"
        placement="bottom-start"
      >
        <div
          class="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border border-black/10 dark:border-gray-700 overflow-hidden hover:border-blue-500 transition-all hover:opacity-90 w-full"
          title="Click to change image"
        >
          <img :src="img.url" class="w-full h-full object-cover" />

          <button
            v-if="images.length > 1"
            @click.stop="removeImage(idx)"
            class="absolute top-1 right-1 p-1 rounded-full bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-colors z-20 backdrop-blur-sm"
            title="Remove image"
          >
            <PartsIconsClose />
          </button>

          <div
            class="absolute bottom-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md z-10 pointer-events-none"
          >
            #{{ idx + 1 }}
          </div>
        </div>
      </PartsDropdownActionDropdown>

      <!-- Add New Button -->
      <PartsDropdownActionDropdown
        v-if="uploadMulti"
        :items="addActions"
        placement="bottom-start"
      >
        <button
          class="w-full h-full aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/10 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 hover:bg-black/5 dark:hover:bg-gray-800 transition-all group"
        >
          <div
            class="w-8 h-8 rounded-full bg-black/10 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 flex items-center justify-center transition-colors"
          >
            <PartsIconsPlus />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider"
            >Add New</span
          >
        </button>
      </PartsDropdownActionDropdown>
    </div>

    <!-- Subject Picker Modal -->
    <PartsModalBaseModal v-model:open="isSubjectModalOpen" title="Select a Subject">
        <div v-if="subjectStore.isLoading" class="flex justify-center py-10">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
        </div>
        <div v-else-if="subjectStore.subjects.length === 0" class="text-center py-10 opacity-50">
          <Icon name="lucide:users" class="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p class="text-sm font-bold uppercase tracking-widest text-gray-500">No subjects yet</p>
          <p class="text-xs mt-1 text-gray-400">Visit Settings to create your subjects.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          <button
            v-for="subject in subjectStore.subjects"
            :key="subject.id"
            @click="selectSubject(subject)"
            class="group relative aspect-square rounded-xl overflow-hidden border border-black/5 hover:border-primary/50 transition-all shadow-sm hover:shadow outline-none cursor-pointer"
          >
            <img :src="subject.image" class="w-full h-full object-cover" />
            <div
              class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
            >
              <span class="text-white text-xs font-bold truncate">{{ subject.name }}</span>
            </div>
            <!-- Mobile visual hint -->
            <div class="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 xl:hidden">
              <span class="text-white text-[10px] font-bold truncate block text-center">{{ subject.name }}</span>
            </div>
          </button>
        </div>
    </PartsModalBaseModal>
  </div>
</template>
