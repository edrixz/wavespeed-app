import { storeToRefs } from "pinia";
import { useWavespeedPayloadStore } from "~/stores/wavespeed";

export const useRatio = () => {
  const payloadStore = useWavespeedPayloadStore();
  const { width, height } = storeToRefs(payloadStore);

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
    const BASE_SIZE = 20;

    if (w > h) {
      return { width: `${BASE_SIZE}px`, height: `${(BASE_SIZE * h) / w}px` };
    }
    if (h > w) {
      return { height: `${BASE_SIZE}px`, width: `${(BASE_SIZE * w) / h}px` };
    }
    return { width: `${BASE_SIZE * 0.9}px`, height: `${BASE_SIZE * 0.9}px` };
  };

  const isActiveRatio = (wRatio: number, hRatio: number) => {
    const currentRatio = width.value / height.value;
    const targetRatio = wRatio / hRatio;

    return Math.abs(currentRatio - targetRatio) < 0.05;
  };

  return {
    width,
    height,
    ratioList,
    applyRatio,
    isActiveRatio,
    getButtonStyle,
  };
};
