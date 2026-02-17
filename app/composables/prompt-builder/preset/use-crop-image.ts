/**
 * Handle image cropping for preset thumbnails
 */
export const useCropImage = () => {
  const { setStatus } = useLogger();
  const uploadImageStore = useUploadImageStore();
  const { cropperRef, isCropping } = storeToRefs(uploadImageStore);

  /**
   * Start crop mode
   */
  const startCropping = () => {
    uploadImageStore.isCropping = true;
    setStatus("Crop your image and click Confirm", "info");
  };

  /**
   * Cancel crop mode
   */
  const cancelCropping = () => {
    uploadImageStore.isCropping = false;
  };

  /**
   * Apply crop and get cropped image blob
   */
  const applyCrop = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        if (!cropperRef.value?.getResult) {
          setStatus("Failed to crop image", "error");
          resolve(null);
          return;
        }

        const result = cropperRef.value.getResult();
        const { canvas } = result;

        if (!canvas) {
          setStatus("Failed to crop image", "error");
          resolve(null);
          return;
        }

        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              uploadImageStore.isCropping = false;
              setStatus("Image cropped successfully", "success");
              resolve(blob);
            } else {
              setStatus("Failed to convert cropped image", "error");
              resolve(null);
            }
          },
          "image/jpeg",
          0.95
        );
      } catch (error: any) {
        setStatus("Error cropping image", "error");
        resolve(null);
      }
    });
  };

  /**
   * Get cropped file
   */
  const getCroppedFile = async (): Promise<File | null> => {
    const blob = await applyCrop();
    if (blob) {
      return new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
    }
    return null;
  };

  /**
   * Reset crop
   */
  const resetCrop = () => {
    uploadImageStore.isCropping = false;
    uploadImageStore.initState();
  };

  /**
   * Get crop area coordinates
   */
  const getCropCoordinates = () => {
    if (!cropperRef.value?.getResult) return null;
    const result = cropperRef.value.getResult();
    return {
      x: result.coordinates?.left || 0,
      y: result.coordinates?.top || 0,
      width: result.coordinates?.width || 0,
      height: result.coordinates?.height || 0,
    };
  };

  return {
    startCropping,
    cancelCropping,
    applyCrop,
    getCroppedFile,
    resetCrop,
    getCropCoordinates,
    isCropping: computed(() => isCropping.value),
    cropperRef: computed(() => cropperRef.value),
  };
};
