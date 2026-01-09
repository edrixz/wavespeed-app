export const useFileUpload = () => {
  // Upload single file to TmpFiles and get direct URL
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
        // Convert to direct link
        return originalUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      } else {
        throw new Error("Upload failed");
      }
    } catch (e) {
      throw new Error("Error uploading image to temporary server");
    }
  };

  // Upload multiple files in parallel
  const uploadMultipleFiles = async (files: File[]) => {
    const uploadPromises = files.map((file) => uploadFile(file));
    return await Promise.all(uploadPromises);
  };

  return { uploadFile, uploadMultipleFiles };
};
