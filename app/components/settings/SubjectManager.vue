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
      <UButton
        icon="i-heroicons-plus"
        label="New"
        color="primary"
        @click="openCreate"
      />
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
      <UIcon name="i-heroicons-user-group" class="w-12 h-12 mb-3" />
      <p class="text-sm font-bold uppercase tracking-widest">
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
          <UButton
            icon="i-heroicons-pencil-square"
            size="xs"
            color="neutral"
            variant="ghost"
            @click.stop="openEdit(subject)"
          />
          <UButton
            icon="i-heroicons-trash"
            size="xs"
            color="error"
            variant="ghost"
            @click.stop="confirmDelete(subject)"
          />
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
    <UModal
      v-model:open="isModalOpen"
      :title="isEditing ? 'Edit Subject' : 'New Subject'"
    >
      <!-- Hidden trigger (modal controlled by v-model:open) -->
      <template #default>
        <span class="hidden" />
      </template>

      <template #body>
        <div class="space-y-5">
          <!-- Image upload area -->
          <div>
            <label
              class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Image
            </label>
            <button
              type="button"
              @click="triggerFileInput"
              class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-primary active:border-primary transition-colors overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center cursor-pointer group"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center space-y-2">
                <UIcon
                  name="i-heroicons-arrow-up-tray"
                  class="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mx-auto"
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
          <UFormField label="Name" name="name">
            <UInput
              v-model="formState.name"
              placeholder="e.g. Main character"
              icon="i-heroicons-user"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="isModalOpen = false"
          />
          <UButton
            :label="isEditing ? 'Save' : 'Create'"
            color="primary"
            :loading="isBusy"
            :disabled="!isFormValid || isBusy"
            @click="handleSubmit"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete confirmation modal -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Subject"
      description="This action cannot be undone. Are you sure?"
    >
      <template #default>
        <span class="hidden" />
      </template>

      <template #body>
        <div
          v-if="deleteTarget"
          class="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
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
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="isDeleteModalOpen = false"
          />
          <UButton
            label="Delete"
            color="error"
            @click="executeDelete"
          />
        </div>
      </template>
    </UModal>
  </section>
</template>
