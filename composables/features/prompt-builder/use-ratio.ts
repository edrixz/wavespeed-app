// composables/features/use-settings-form.ts
import { storeToRefs } from "pinia";
import { useWavespeedPayloadStore } from "~/stores/wavespeed-payload-store";

export const useRatio = () => {
  const payloadStore = useWavespeedPayloadStore();

  // Destructure refs để dùng trực tiếp trong template với v-model
  const { width, height } = storeToRefs(payloadStore);

  // DATA: Định nghĩa các tỷ lệ
  const ratiosData = {
    square: [{ label: "1:1", w: 1, h: 1 }],
    vertical: [
      { label: "3:4", w: 3, h: 4 },
      { label: "2:3", w: 2, h: 3 },
      { label: "9:16", w: 9, h: 16 },
    ],
    horizontal: [
      { label: "4:3", w: 4, h: 3 },
      { label: "3:2", w: 3, h: 2 },
      { label: "16:9", w: 16, h: 9 },
    ],
  };

  const ratioList = computed(() => [
    ...ratiosData.square,
    ...ratiosData.vertical,
    ...ratiosData.horizontal,
  ]);

  // LOGIC: Apply kích thước (giữ nguyên)
  const applyRatio = (wRatio: number, hRatio: number) => {
    const MAX_SIZE = 4096;
    let newW, newH;
    if (wRatio > hRatio) {
      newW = MAX_SIZE;
      newH = (MAX_SIZE * hRatio) / wRatio;
    } else if (hRatio > wRatio) {
      newH = MAX_SIZE;
      newW = (MAX_SIZE * wRatio) / hRatio;
    } else {
      newW = MAX_SIZE;
      newH = MAX_SIZE;
    }
    width.value = Math.round(newW / 64) * 64;
    height.value = Math.round(newH / 64) * 64;
  };

  const getButtonStyle = (w: number, h: number) => {
    const BASE_SIZE = 20; // Kích thước chuẩn (px)

    if (w > h) {
      // Ngang
      return { width: `${BASE_SIZE}px`, height: `${(BASE_SIZE * h) / w}px` };
    }
    if (h > w) {
      // Dọc
      return { height: `${BASE_SIZE}px`, width: `${(BASE_SIZE * w) / h}px` };
    }
    // Vuông
    return { width: `${BASE_SIZE * 0.9}px`, height: `${BASE_SIZE * 0.9}px` };
  };

  // Hàm kiểm tra xem tỷ lệ hiện tại có khớp với nút này không
  const isActiveRatio = (wRatio: number, hRatio: number) => {
    const currentRatio = width.value / height.value;
    const targetRatio = wRatio / hRatio;

    // So sánh với sai số rất nhỏ (epsilon) để tránh lỗi số học
    return Math.abs(currentRatio - targetRatio) < 0.05;
  };

  return {
    // State
    width,
    height,

    // Computed & Methods
    ratioList,
    applyRatio,
    isActiveRatio,
    getButtonStyle,
  };
};
