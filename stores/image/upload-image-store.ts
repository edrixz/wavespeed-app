// FILE: stores/image/upload-image-store.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export const useUploadImageStore = defineStore("uploadImage", () => {
  const images = ref<UploadedImage[]>([]);

  // Function set nhiều ảnh
  const setImages = (files: File[]) => {
    images.value.forEach((img) => URL.revokeObjectURL(img.url));
    images.value = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      file: file,
    }));
  };

  // Function thêm 1 ảnh
  const addImage = (file: File) => {
    images.value.push({
      id: `img-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file: file,
    });
  };

  const clearImages = () => {
    images.value.forEach((img) => URL.revokeObjectURL(img.url));
    images.value = [];
  };

  return { images, setImages, addImage, clearImages };
});
