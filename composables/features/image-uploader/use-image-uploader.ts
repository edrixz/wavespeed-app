import { useImageAdd, useImageReplace, useImageRemove } from ".";

export const useImageUploader = () => {
  const imageStore = useImageStore();
  const { addFiles, replaceFileAt, removeAt } = imageStore;

  // 2. Khởi tạo Logic Add (truyền hàm xử lý vào)
  const {
    inputRef: addInputRef,
    triggerAdd,
    onAddChange,
  } = useImageAdd((files) => addFiles(files));

  // 3. Khởi tạo Logic Replace (truyền hàm xử lý vào)
  const {
    inputRef: replaceInputRef,
    triggerReplace,
    onReplaceChange,
  } = useImageReplace((index, file) => replaceFileAt(index, file));

  // 3. Khởi tạo Logic Xóa
  const { triggerRemove } = useImageRemove((index) => removeAt(index));

  // 4. Trả về tất cả
  return {
    // DOM Refs (Gắn vào input ẩn)
    addInputRef,
    replaceInputRef,

    // Methods
    addImage: triggerAdd,
    onAddChange,
    replaceImage: triggerReplace,
    onReplaceChange,
    removeImage: triggerRemove,
  };
};
