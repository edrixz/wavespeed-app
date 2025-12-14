import { ref } from "vue";

export const useImageAdd = (onFilesSelected: (files: File[]) => void) => {
  const inputRef = ref<HTMLInputElement | null>(null);

  const triggerAdd = () => inputRef.value?.click();

  const onAddChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      // Chuyển FileList thành mảng và gửi về callback
      onFilesSelected(Array.from(target.files));
    }
    target.value = ""; // Reset input
  };

  return { inputRef, triggerAdd, onAddChange };
};
