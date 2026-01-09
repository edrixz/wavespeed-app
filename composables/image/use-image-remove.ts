import { useLogger } from "~/composables/common";

export const useImageRemove = (onRemoveConfirmed: (index: number) => void) => {
  const { setStatus } = useLogger();

  const triggerRemove = (index: number) => {
    onRemoveConfirmed(index);
    setStatus("Image removed successfully", "warning");
  };

  return { triggerRemove };
};
