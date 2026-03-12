// use-magic-eraser.ts
import { ref, onMounted, onUnmounted, toRaw } from "vue";
import SamWorker from "~/utils/workers/sam.worker?worker";

export const useMagicEraser = () => {
  const { setStatus } = useLogger();
  const isModelLoading = ref(true);
  const isImageProcessing = ref(false);
  const uploadedImage = ref<string | null>(null);
  const hasMaskContent = ref(false);
  const activeTool = ref<"ai" | "brush" | "eraser">("ai");
  const brushSize = ref(30);

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const originalImg = ref<HTMLImageElement | null>(null);
  const activePoints = ref<{ x: number; y: number }[]>([]);
  const activeLabels = ref<number[]>([]);

  let worker: Worker | null = null;
  const isDrawing = ref(false);
  let lastPos = { x: 0, y: 0 };
  let maskCanvas: HTMLCanvasElement | null = null;
  let maskCtx: CanvasRenderingContext2D | null = null;

  const updateHasMaskContent = () => {
    if (!maskCtx || !maskCanvas) return;
    const data = maskCtx.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height,
    )?.data;
    if (!data) return;
    // Kiểm tra undefined/null nghiêm ngặt cho alpha channel
    for (let i = 3; i < data.length; i += 4) {
      if ((data[i] ?? 0) > 0) {
        hasMaskContent.value = true;
        return;
      }
    }
    hasMaskContent.value = false;
  };

  const getPixelPos = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.value || !originalImg.value) return { x: 0, y: 0 };
    const rect = canvasRef.value.getBoundingClientRect();
    const scaleX = originalImg.value.width / rect.width;
    const scaleY = originalImg.value.height / rect.height;
    const clientX =
      "touches" in e ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX;
    const clientY =
      "touches" in e ? (e.touches[0]?.clientY ?? 0) : (e as MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const render = () => {
    if (!canvasRef.value || !originalImg.value || !maskCanvas) return;
    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.drawImage(
      originalImg.value,
      0,
      0,
      canvasRef.value.width,
      canvasRef.value.height,
    );
    if (hasMaskContent.value) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      const temp = document.createElement("canvas");
      [temp.width, temp.height] = [
        canvasRef.value.width,
        canvasRef.value.height,
      ];
      const tCtx = temp.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(
          maskCanvas,
          0,
          0,
          canvasRef.value.width,
          canvasRef.value.height,
        );
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = "#ef4444";
        tCtx.fillRect(0, 0, temp.width, temp.height);
        ctx.drawImage(temp, 0, 0);
      }
      ctx.restore();
    }
  };

  onMounted(() => {
    maskCanvas = document.createElement("canvas");
    maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
    worker = new SamWorker();
    worker.onmessage = (e) => {
      const { status, maskImage, error } = e.data ?? {};
      if (status === "ready") isModelLoading.value = false;
      if (status === "image_ready") isImageProcessing.value = false;
      if (status === "mask_ready" && maskImage) {
        if (maskCanvas && maskCtx) {
          maskCanvas.width = maskImage.width;
          maskCanvas.height = maskImage.height;
          maskCtx.putImageData(maskImage, 0, 0);
          updateHasMaskContent();
          render();
        }
      }
      if (error) setStatus(error, "error");
    };
    worker.postMessage({ type: "init" });
  });

  return {
    canvasRef,
    isModelLoading,
    isImageProcessing,
    uploadedImage,
    hasMaskContent,
    brushSize,
    activeTool,
    init: (url: string) => {
      uploadedImage.value = url;
      activePoints.value = [];
      activeLabels.value = [];
      const img = new Image();
      img.onload = () => {
        originalImg.value = img;
        if (canvasRef.value)
          [canvasRef.value.width, canvasRef.value.height] = [
            img.width,
            img.height,
          ];
        if (maskCanvas)
          [maskCanvas.width, maskCanvas.height] = [img.width, img.height];
        render();
        isImageProcessing.value = true;
        worker?.postMessage({ type: "process_image", data: { imageUrl: url } });
        // Tự động phân tích điểm giữa ảnh
        worker?.postMessage({
          type: "decode",
          data: { points: [[img.width / 2, img.height / 2]], labels: [1] },
        });
      };
      img.src = url;
    },
    handleAiSelect: (e: any) => {
      if (
        activeTool.value !== "ai" ||
        isModelLoading.value ||
        !uploadedImage.value
      )
        return;
      const pos = getPixelPos(e);
      activePoints.value.push(pos);
      activeLabels.value.push(1);
      worker?.postMessage({
        type: "decode",
        data: {
          points: toRaw(activePoints.value).map((p) => [p.x, p.y]),
          labels: [...activeLabels.value],
        },
      });
    },
    startDraw: (e: any) => {
      if (activeTool.value === "ai") return;
      isDrawing.value = true;
      lastPos = getPixelPos(e);
    },
    moveDraw: (e: any) => {
      if (isDrawing.value) {
        const p = getPixelPos(e);
        if (maskCtx) {
          maskCtx.save();
          maskCtx.lineCap = "round";
          maskCtx.lineWidth = brushSize.value;
          maskCtx.globalCompositeOperation =
            activeTool.value === "brush" ? "source-over" : "destination-out";
          maskCtx.strokeStyle = "white";
          maskCtx.beginPath();
          maskCtx.moveTo(lastPos.x, lastPos.y);
          maskCtx.lineTo(p.x, p.y);
          maskCtx.stroke();
          maskCtx.restore();
          lastPos = p;
          updateHasMaskContent();
          render();
        }
      }
    },
    stopDraw: () => {
      isDrawing.value = false;
    },
    clear: () => {
      activePoints.value = [];
      activeLabels.value = [];
      if (maskCtx && maskCanvas)
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      hasMaskContent.value = false;
      render();
    },
  };
};
