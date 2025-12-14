import { useLogger } from "~/composables";

export const useImageRemove = (onRemoveConfirmed: (index: number) => void) => {
  const { setStatus } = useLogger();

  const triggerRemove = (index: number) => {
    // 1. Có thể thêm logic Confirm Dialog ở đây nếu cần
    // if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) return;

    // 2. Gọi hàm xóa dữ liệu (từ Core truyền vào)
    onRemoveConfirmed(index);

    // 3. Ghi log hoặc thông báo
    setStatus("Đã xóa ảnh thành công", "warning");
  };

  return { triggerRemove };
};