export const useUploadToTmpFiles = () => {
  // Upload 1 file lên TmpFiles và lấy Direct URL
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: any = await $fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (response.status === "success") {
        const originalUrl = response.data.url;
        // Chèn /dl/ để lấy link trực tiếp
        return originalUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      } else {
        throw new Error("Upload failed");
      }
    } catch (e) {
      throw new Error("Lỗi khi upload ảnh tạm thời");
    }
  };

  // Upload danh sách file (chạy song song cho nhanh)
  const uploadMultipleFiles = async (files: File[]) => {
    const uploadPromises = files.map((file) => uploadFile(file));
    return await Promise.all(uploadPromises);
  };

  return { uploadFile, uploadMultipleFiles };
};
