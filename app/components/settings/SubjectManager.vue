<script setup lang="ts">
import type { Subject, SubjectFormPayload } from "~/types";

const subjectStore = useSubjectStore();
const { subjects, isLoading, isSaving } = storeToRefs(subjectStore);
const { uploadImage, isUploading } = useUploadToSupabase();

/** Modal state */
const isModalOpen = ref(false);
const editingSubject = ref<Subject | null>(null);
const isEditing = computed(() => !!editingSubject.value);

/** Form state */
const formState = reactive<SubjectFormPayload>({
  name: "",
  image: "",
});

/** Image preview from local file selection */
const localPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const modalFileInputRef = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);

/** Delete confirmation */
const deleteTarget = ref<Subject | null>(null);
const isDeleteModalOpen = ref(false);

/** Fetch subjects on mount */
onMounted(() => {
  subjectStore.fetchSubjects();
});

/**
 * Reset form to blank.
 */
const resetForm = () => {
  formState.name = "";
  formState.image = "";
  localPreview.value = null;
  pendingFile.value = null;
  editingSubject.value = null;
};

/**
 * Open modal for creating a new subject.
 */
const openCreate = () => {
  resetForm();
  isModalOpen.value = true;
};

/**
 * Open modal for editing an existing subject.
 */
const openEdit = (subject: Subject) => {
  editingSubject.value = subject;
  formState.name = subject.name;
  formState.image = subject.image;
  localPreview.value = null;
  pendingFile.value = null;
  isModalOpen.value = true;
};

/**
 * Trigger file input click inside modal.
 */
const triggerFileInput = () => {
  modalFileInputRef.value?.click();
};

/**
 * Handle file selection from input.
 */
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  pendingFile.value = file;
  localPreview.value = URL.createObjectURL(file);
  // Reset input so the same file can be re-selected
  target.value = "";
};

/**
 * Submit form: upload image if needed, then create / update.
 */
const handleSubmit = async () => {
  if (!formState.name.trim()) return;

  let imageUrl = formState.image;

  // Upload file to Supabase Storage if a new file was selected
  if (pendingFile.value) {
    const url = await uploadImage(pendingFile.value, "users");
    if (!url) return; // upload error already shown by composable
    imageUrl = url;
  }

  if (!imageUrl) return;

  const payload: SubjectFormPayload = {
    name: formState.name.trim(),
    image: imageUrl,
  };

  const result = isEditing.value
    ? await subjectStore.updateSubject(editingSubject.value!.id, payload)
    : await subjectStore.createSubject(payload);

  if (result?.success) {
    isModalOpen.value = false;
    resetForm();
  }
};

/**
 * Confirm & execute deletion.
 */
const confirmDelete = (subject: Subject) => {
  deleteTarget.value = subject;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!deleteTarget.value) return;
  await subjectStore.deleteSubject(deleteTarget.value.id);
  isDeleteModalOpen.value = false;
  deleteTarget.value = null;
};

/** Computed thumbnail for the form */
const previewImage = computed(
  () => localPreview.value || formState.image || null,
);

/** Is the form valid */
const isFormValid = computed(
  () =>
    formState.name.trim().length > 0 &&
    (!!previewImage.value || !!pendingFile.value),
);

/** Busy state */
const isBusy = computed(() => isSaving.value || isUploading.value);
</script>

<template>
  <section class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold tracking-tight">Subjects</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Manage reference subjects for image generation.
        </p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-colors outline-none cursor-pointer shadow-sm"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        New
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-3">
      <div
        v-for="n in 3"
        :key="n"
        class="flex items-center gap-3 p-3 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse h-20"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="subjects.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center opacity-40 select-none"
    >
      <Icon name="lucide:users" class="w-12 h-12 mb-3 text-gray-500" />
      <p class="text-sm font-bold uppercase tracking-widest text-gray-500">
        No subjects yet
      </p>
    </div>

    <!-- Subject list -->
    <div v-else class="space-y-2">
      <div
        v-for="subject in subjects"
        :key="subject.id"
        class="flex items-center gap-3 p-2 pr-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/3 transition-all hover:border-primary/30 hover:shadow-sm"
      >
        <!-- Thumbnail -->
        <div
          class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5"
        >
          <img
            :src="subject.image"
            :alt="subject.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Name -->
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-bold truncate text-neutral-800 dark:text-gray-200"
          >
            {{ subject.name }}
          </p>
          <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {{ new Date(subject.created_at).toLocaleDateString() }}
          </p>
        </div>

        <!-- Action buttons (always visible) -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            @click.stop="openEdit(subject)"
            class="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
          >
            <Icon name="lucide:edit" class="w-4 h-4" />
          </button>
          <button
            @click.stop="confirmDelete(subject)"
            class="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors outline-none cursor-pointer"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden file input (inside modal context) -->
    <input
      ref="modalFileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <!-- Create / Edit Modal -->
    <PartsModalBaseModal v-model:open="isModalOpen" :title="isEditing ? 'Edit Subject' : 'New Subject'">
        <div class="space-y-5">
          <!-- Image upload area -->
          <div>
            <label
              class="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2"
            >
              Image
            </label>
            <button
              type="button"
              @click="triggerFileInput"
              class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-blue-500 dark:hover:border-blue-500 transition-colors overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center cursor-pointer group outline-none"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center space-y-2">
                <Icon
                  name="lucide:upload"
                  class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mx-auto"
                />
                <p
                  class="text-xs text-gray-400 uppercase tracking-wider font-bold"
                >
                  Tap to upload
                </p>
              </div>
            </button>
          </div>

          <!-- Name input -->
          <div>
            <label
              class="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2"
            >
              Name
            </label>
            <div class="relative">
              <Icon name="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="formState.name"
                placeholder="e.g. Main character"
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
              />
            </div>
          </div>
        </div>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <button
            class="px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            @click="isModalOpen = false"
          >Cancel</button>
          <PartsButtonPrimary
            :loading="isBusy"
            :disabled="!isFormValid || isBusy"
            @click="handleSubmit"
            class="px-5 py-2.5 w-auto!"
          >
             {{ isEditing ? 'Save' : 'Create' }}
          </PartsButtonPrimary>
        </div>
      </template>
    </PartsModalBaseModal>

    <!-- Delete confirmation modal -->
    <PartsModalBaseModal v-model:open="isDeleteModalOpen" title="Delete Subject" description="This action cannot be undone. Are you sure?">
        <div
          v-if="deleteTarget"
          class="flex items-center gap-3 p-3 mt-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
        >
          <img
            :src="deleteTarget.image"
            :alt="deleteTarget.name"
            class="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <p class="text-sm font-bold text-red-700 dark:text-red-300 truncate">
            {{ deleteTarget.name }}
          </p>
        </div>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <button
            class="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            @click="isDeleteModalOpen = false"
          >Cancel</button>
          <button
            class="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors outline-none cursor-pointer shadow-sm"
            @click="executeDelete"
          >Delete</button>
        </div>
      </template>
    </PartsModalBaseModal>
  </section>
</template>
