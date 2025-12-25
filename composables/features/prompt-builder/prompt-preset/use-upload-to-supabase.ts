export const useUploadToSupabase = () => {
  const supabase = useSupabaseClient();
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  /**
   * Hàm upload ảnh lên Supabase Storage
   * @param file - Đối tượng File từ input
   * @param bucket - Tên bucket trên Supabase (mặc định là 'presets')
   */
  const uploadImage = async (file: File, bucket: string = "presets") => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      // 1. Tạo tên file duy nhất để tránh trùng lặp và lỗi cache CDN
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      // 2. Thực hiện upload
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // 3. Lấy Public URL
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
    uploadImage,
  };
};
