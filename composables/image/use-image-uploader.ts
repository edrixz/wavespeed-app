import { useImageAdd, useImageReplace, useImageRemove } from ".";

export const useImageUploader = () => {
  const imageStore = useImageStore();
  const { addFiles, replaceFileAt, removeAt } = imageStore;

  const {
    inputRef: addInputRef,
    triggerAdd,
    onAddChange,
  } = useImageAdd((files) => addFiles(files));

  const {
    inputRef: replaceInputRef,
    triggerReplace,
    onReplaceChange,
  } = useImageReplace((index, file) => replaceFileAt(index, file));

  const { triggerRemove } = useImageRemove((index) => removeAt(index));

  return {
    addInputRef,
    replaceInputRef,
    addImage: triggerAdd,
    onAddChange,
    replaceImage: triggerReplace,
    onReplaceChange,
    removeImage: triggerRemove,
  };
};
