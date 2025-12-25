// composables/useToast.ts
export const useToast = () => {
  const toastStore = useToastStore();

  return {
    success: (msg: string, dur?: number) =>
      toastStore.addToast(msg, "success", dur),
    error: (msg: string, dur?: number) =>
      toastStore.addToast(msg, "error", dur),
    info: (msg: string, dur?: number) => toastStore.addToast(msg, "info", dur),
    warning: (msg: string, dur?: number) =>
      toastStore.addToast(msg, "warning", dur),
  };
};
