import { ref } from "vue";
import { useLogger } from "~/composables";
const { setStatus } = useLogger();

export const useImageUploader = () => {
  // Image State
  const defaultImageUrl =
    "https://d1q70pf5vjeyhc.cloudfront.net/media/92d2d4ca66f84793adcb20742b15d262/images/1764761316371833793_r5ZX531Z.jpeg";
  const selectedFiles = ref<File[]>([]);
  const previewImages = ref<string[]>([defaultImageUrl]);

  // Ref cho các input ẩn
  const mainInputRef = ref<HTMLInputElement | null>(null);
  const replaceInputRef = ref<HTMLInputElement | null>(null);
  const replacingIndex = ref<number | null>(null);

  // 1. Logic Thêm ảnh mới
  const triggerAdd = () => {
    mainInputRef.value?.click();
  };

  //   Hàm xử lý khi người dùng chọn file từ input ẩn
  const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      Array.from(target.files).forEach((file) => {
        selectedFiles.value.push(file);
        previewImages.value.push(URL.createObjectURL(file));
      });
    }
    // Reset input để có thể chọn lại cùng 1 file nếu muốn
    target.value = "";
  };

  // 2. Logic Thay thế ảnh
  const triggerReplace = (index: number) => {
    replacingIndex.value = index;
    replaceInputRef.value?.click();
  };

  //   Hàm xử lý khi người dùng chọn file thay thế từ input ẩn
  const onReplaceFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && replacingIndex.value !== null) {
      const oldUrl = previewImages.value[replacingIndex.value];
      const newUrl = URL.createObjectURL(file);

      // 1. Cập nhật ngay lập tức giao diện preview
      previewImages.value[replacingIndex.value] = newUrl;

      // 2. Cập nhật mảng file gốc (selectedFiles) để upload sau này
      // Kiểm tra xem ảnh cũ là ảnh URL (default) hay ảnh Blob (đã upload)
      const isOldImageAUrl =
        oldUrl.startsWith("http") && !oldUrl.startsWith("blob:");

      if (isOldImageAUrl) {
        // Trường hợp A: Thay thế ảnh mặc định bằng file mới.
        // Ta chỉ cần thêm file này vào danh sách cần upload.
        selectedFiles.value.push(file);
      } else {
        // Trường hợp B: Thay thế một ảnh Blob đã upload trước đó.
        // Ta cần tìm vị trí tương ứng của nó trong mảng selectedFiles.

        // Cách tìm: Đếm xem có bao nhiêu ảnh URL (không phải file) đứng trước nó.
        let urlCountBefore = 0;
        for (let i = 0; i < replacingIndex.value; i++) {
          const url = previewImages.value[i];
          if (url.startsWith("http") && !url.startsWith("blob:")) {
            urlCountBefore++;
          }
        }
        // Index thực trong mảng file = Index trên giao diện - Số lượng ảnh URL phía trước
        const realFileIndex = replacingIndex.value - urlCountBefore;

        if (realFileIndex >= 0 && realFileIndex < selectedFiles.value.length) {
          // Thay thế file cũ bằng file mới tại đúng vị trí
          selectedFiles.value[realFileIndex] = file;
        }
      }
      setStatus(
        `Đã thay thế ảnh tại vị trí ${replacingIndex.value + 1}`,
        "info"
      );
    }

    // Reset state
    target.value = "";
    replacingIndex.value = null;
  };

  // Logic xóa ảnh
  const removeImage = (index: number) => {
    if (
      previewImages.value[index] === defaultImageUrl &&
      selectedFiles.value.length < previewImages.value.length
    ) {
      previewImages.value.splice(index, 1);
      return;
    }
    previewImages.value.splice(index, 1);
    if (index < selectedFiles.value.length)
      selectedFiles.value.splice(index, 1);
  };

  return {
    previewImages,
    selectedFiles,
    mainInputRef,
    replaceInputRef,
    triggerAdd,
    triggerReplace,
    onFileChange,
    onReplaceFileChange,
    removeImage,
  };
};
