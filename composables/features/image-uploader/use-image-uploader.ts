import { DEFAULT_IMAGE_URL } from "~/consts";
import { useImageState, useImageAdd, useImageReplace, useImageRemove } from ".";
import type { ImageItem } from "~/types";

interface Options {
  defaultImageUrl?: string;
  initialImages?: ImageItem[];
}

export const useImageUploader = (options: Options = {}) => {
  // --- LOGIC KHỞI TẠO DỮ LIỆU ---
  let initialData: ImageItem[] = [];

  // Ưu tiên 1: Nếu có danh sách ảnh cũ (ví dụ edit bài viết) -> Dùng danh sách đó
  if (options.initialImages && options.initialImages.length > 0) {
    initialData = options.initialImages;
  } 
  // Ưu tiên 2: Nếu không có ảnh cũ -> Dùng ảnh mặc định (Placeholder)
  else {
    // Lấy link từ options HOẶC lấy link gốc hardcode
    const urlToUse = options.defaultImageUrl || DEFAULT_IMAGE_URL;
    
    initialData = [{
      id: 'default-placeholder', // ID cố định hoặc random tùy bạn
      url: urlToUse,
      file: null,
      type: 'SERVER'
    }];
  }

  const { globalImages, filesToUpload, addFiles, replaceFileAt, removeAt } = useImageState(initialData);

  // 2. Khởi tạo Logic Add (truyền hàm xử lý vào)
  const { 
    inputRef: addInputRef, 
    triggerAdd, 
    onAddChange 
  } = useImageAdd((files) => addFiles(files));

  // 3. Khởi tạo Logic Replace (truyền hàm xử lý vào)
  const { 
    inputRef: replaceInputRef, 
    triggerReplace, 
    onReplaceChange 
  } = useImageReplace((index, file) => replaceFileAt(index, file));

  // 3. Khởi tạo Logic Xóa 
  const { 
    triggerRemove 
  } = useImageRemove((index) => removeAt(index));

  // 4. Trả về tất cả
  return {
    // Data
    images: globalImages,
    filesToUpload,
    
    // DOM Refs (Gắn vào input ẩn)
    addInputRef,
    replaceInputRef,
    
    // Methods
    addImage: triggerAdd,
    onAddChange,
    replaceImage: triggerReplace,
    onReplaceChange,
    removeImage: triggerRemove
  };
};