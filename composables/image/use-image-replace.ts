import { ref } from "vue";
import { useLogger } from "~/composables/common";

export const useImageReplace = (
  onFileReplaced: (index: number, file: File) => void
) => {
  const { setStatus } = useLogger();

  const inputRef = ref<HTMLInputElement | null>(null);
  const targetIndex = ref<number | null>(null);

  const triggerReplace = (index: number) => {
    targetIndex.value = index;
    inputRef.value?.click();
  };

  const onReplaceChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && targetIndex.value !== null) {
      onFileReplaced(targetIndex.value, file);
      setStatus(`Replaced image at position ${targetIndex.value + 1}`, "info");
    }

    target.value = "";
    targetIndex.value = null;
  };

  return { inputRef, triggerReplace, onReplaceChange };
};
