// stores/presetStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUploadImageStore = defineStore("uploadImage", () => {
  // --- STATE ---
  const selectedFile = ref<File | null>(null);
  const uploadProgress = ref(0);
  const isCropping = ref(false);
  const cropperRef = ref();

  // TẠO PREVIEW CỤC BỘ
  const localPreviewUrl = computed(() => {
    if (!selectedFile.value) return "";
    return URL.createObjectURL(selectedFile.value);
  });

  const initState = () => {
    selectedFile.value = null;
    uploadProgress.value = 0;
    isCropping.value = false;
    cropperRef.value = undefined;
  };

  // LOGIC PROGRESS SIÊU MƯỢT (Ease-out)
  const startFakeProgress = () => {
    uploadProgress.value = 0;
    const timer = setInterval(() => {
      if (uploadProgress.value < 90) {
        // Chạy nhanh lúc đầu, chậm dần về sau để tạo cảm giác xử lý sâu
        uploadProgress.value += (92 - uploadProgress.value) * 0.05;
      }
    }, 100);
    return timer;
  };

  // CHỨC NĂNG CẮT ẢNH
  const applyCrop = () => {
    const { canvas } = cropperRef.value.getResult();
    canvas.toBlob((blob: Blob) => {
      if (blob) {
        selectedFile.value = new File([blob], "cropped_image.jpg", {
          type: "image/jpeg",
        });
      }
      isCropping.value = false;
    }, "image/jpeg");
  };

  // Trả ra các biến/hàm cần dùng
  return {
    selectedFile,
    uploadProgress,
    isCropping,
    cropperRef,
    localPreviewUrl,
    initState,
    startFakeProgress,
    applyCrop,
  };
});
