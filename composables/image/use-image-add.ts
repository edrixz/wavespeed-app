import { ref } from "vue";

export const useImageAdd = (onFilesSelected: (files: File[]) => void) => {
  const inputRef = ref<HTMLInputElement | null>(null);

  const triggerAdd = () => inputRef.value?.click();

  const onAddChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      onFilesSelected(Array.from(target.files));
    }
    target.value = "";
  };

  return { inputRef, triggerAdd, onAddChange };
};
