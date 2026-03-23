export const useUploadToSupabase = () => {
  const supabase = useSupabaseClient();
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const hasDuplicate = ref(false);

  /**
   * Tính mã băm SHA-256 cho file
   */
  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  /**
   * Hàm upload ảnh lên Supabase Storage với cơ chế deduplication (bỏ file trùng lập)
   * @param file - Đối tượng File từ input
   * @param bucket - Tên bucket trên Supabase (mặc định là 'presets')
   */
  const uploadImage = async (file: File, bucket: string = "presets") => {
    isUploading.value = true;
    uploadError.value = null;
    hasDuplicate.value = false;

    try {
      // 1. Lọc phần mở rộng (extension) và tính mã băm SHA-256 cho nội dung file
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileHash = await calculateSHA256(file);
      const filePath = `thumbnails/${fileHash}.${fileExt}`;

      // 2. Kiểm tra file đã tồn tại hay chưa bằng API exists() (hỗ trợ bởi phiên bản Supabase Storage mới)
      let fileExists = false;
      try {
        // Kiểm tra xem method exists() có hỗ trợ hay không
        if (typeof supabase.storage.from(bucket).exists === "function") {
          const { data, error } = await supabase.storage.from(bucket).exists(filePath);
          if (!error && data) {
            fileExists = true;
          }
        } else {
          // Fallback: Nếu Supabase-js config cũ, list() file để check
          const { data } = await supabase.storage.from(bucket).list("thumbnails", { search: fileHash });
          fileExists = Boolean(data && data.length > 0 && data.some((f) => f.name === `${fileHash}.${fileExt}`));
        }
      } catch (checkError) {
        console.warn("Storage exists check failed, falling back to upload-n-catch", checkError);
      }

      // 3. Nếu file chưa có thì mới tiến hành Upload
      if (!fileExists) {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "31536000", // cache 1 năm vì nội dung xác định theo hash sẽ không đổi
            upsert: false,
          });

        if (error) {
          // Nếu báo lỗi 409 duplicate do request trùng nhau cùng lúc, ta có thể bỏ qua
          if (
            error.message.includes("Duplicate") ||
            error.message.includes("already exists") ||
            (error as any).statusCode === "409"
          ) {
            console.log(`File hash ${fileHash} already uploaded by another concurrent request.`);
          } else {
            throw error;
          }
        }
      } else {
        console.log(`File hash ${fileHash} already exists, skipping upload.`);
        hasDuplicate.value = true;
      }

      // 4. Lấy Public URL và trả về (luôn sinh ra đúng format URL mà không cần offline check API)
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      uploadError.value = err.message;
      console.error("Supabase Upload Error:", err.message);
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    uploadError,
    hasDuplicate,
    uploadImage,
  };
};
