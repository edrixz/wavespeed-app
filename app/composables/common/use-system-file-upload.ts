export const useSystemFileUpload = () => {
  /**
   * Upload single file to TmpFiles and return a direct download URL.
   * TmpFiles API response shape on success:
   *   { status: "success", data: { url: "https://tmpfiles.org/<id>/file.jpg" } }
   * On error it may return a non-2xx status (FetchError) or
   *   { status: "error", message: "..." }
   */
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    let response: any;

    try {
      response = await $fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });
    } catch (fetchError: any) {
      // ofetch FetchError — bắt lỗi HTTP (4xx / 5xx / network)
      const msg =
        fetchError?.data?.message ||
        fetchError?.statusText ||
        fetchError?.message ||
        "Network error while uploading to TmpFiles";
      throw new Error(`TmpFiles upload failed: ${msg}`);
    }

    // Bắt lỗi nếu API trả về 200 nhưng status !== "success"
    if (response?.status !== "success") {
      const msg =
        response?.message ||
        response?.error ||
        "Unknown error from TmpFiles API";
      throw new Error(`TmpFiles upload failed: ${msg}`);
    }

    const originalUrl: string = response.data?.url;
    if (!originalUrl) {
      throw new Error("TmpFiles API returned success but no URL in response");
    }

    // Chuyển viewer URL → direct download URL
    return originalUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  };

  /**
   * Upload multiple files in parallel and return their direct URLs.
   */
  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    return await Promise.all(files.map((file) => uploadFile(file)));
  };

  return { uploadFile, uploadMultipleFiles };
};
