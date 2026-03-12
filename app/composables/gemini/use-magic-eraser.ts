// app/composables/gemini/use-magic-eraser.ts
import { ref, onMounted, onUnmounted } from "vue";
import SamWorker from "~/utils/workers/sam.worker?worker";

export const useMagicEraser = () => {
  const { setStatus } = useLogger();

  const isModelLoading = ref(true);
  const isImageProcessing = ref(false);
  const isProcessing = ref(false);

  // Tools & State
  const brushSize = ref(30);
  const activeTool = ref<"brush" | "eraser">("brush");
  const isDrawing = ref(false);
  let lastPos = { x: 0, y: 0 };

  const uploadedImage = ref<string | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const originalImg = ref<HTMLImageElement | null>(null);

  let maskCanvas: HTMLCanvasElement | null = null;
  let maskCtx: CanvasRenderingContext2D | null = null;
  const hasMaskContent = ref(false);
  let worker: Worker | null = null;

  onMounted(() => {
    maskCanvas = document.createElement("canvas");
    maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    worker = new SamWorker();
    worker.onmessage = (e) => {
      const { status, message, maskImage, error } = e.data;
      if (status === "loading") setStatus(message, "loading");
      if (status === "ready") {
        isModelLoading.value = false;
        setStatus("AI Sẵn sàng!", "success");
      }
      if (status === "image_ready") {
        isImageProcessing.value = false;
        setStatus("Click để chọn vật thể!", "success");
      }
      if (status === "mask_ready" && maskImage) applyAiMask(maskImage);
      if (error) setStatus(error, "error");
    };
    worker.postMessage({ type: "init" });
  });

  onUnmounted(() => worker?.terminate());

  const getPixelPos = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.value || !originalImg.value) return { x: 0, y: 0 };
    const rect = canvasRef.value.getBoundingClientRect();
    const scaleX = originalImg.value.width / rect.width;
    const scaleY = originalImg.value.height / rect.height;
    const clientX =
      "touches" in e ? e.touches[0]!.clientX : (e as MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0]!.clientY : (e as MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  /** Manual Drawing Engine */
  const drawManual = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) => {
    if (!maskCtx) return;
    maskCtx.lineCap = "round";
    maskCtx.lineWidth = brushSize.value;
    if (activeTool.value === "brush") {
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.strokeStyle = "white";
    } else {
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.strokeStyle = "rgba(0,0,0,1)";
    }
    maskCtx.beginPath();
    maskCtx.moveTo(p1.x, p1.y);
    maskCtx.lineTo(p2.x, p2.y);
    maskCtx.stroke();
    hasMaskContent.value = true;
    render();
  };

  const handleAiSelect = (e: MouseEvent) => {
    if (
      isDrawing.value ||
      isImageProcessing.value ||
      isModelLoading.value ||
      !originalImg.value ||
      !canvasRef.value
    )
      return;

    const rect = canvasRef.value.getBoundingClientRect();

    // Tính tỷ lệ dựa trên kích thước thực hiển thị trên màn hình
    const scaleX = originalImg.value.width / rect.width;
    const scaleY = originalImg.value.height / rect.height;

    // Lấy tọa độ click và nhân với tỷ lệ để ra tọa độ pixel thật
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    worker?.postMessage({
      type: "decode",
      data: {
        points: [[x, y]],
        labels: [1],
        // Không cần gửi width/height vì worker đã lưu từ bước process_image
      },
    });
  };

  const applyAiMask = (maskData: ImageData) => {
    if (!maskCtx) return;
    const temp = document.createElement("canvas");
    [temp.width, temp.height] = [maskData.width, maskData.height];
    temp.getContext("2d")?.putImageData(maskData, 0, 0);
    maskCtx.globalCompositeOperation = "source-over";
    maskCtx.drawImage(temp, 0, 0);
    hasMaskContent.value = true;
    render();
  };

  const render = () => {
    if (!canvasRef.value || !originalImg.value || !maskCanvas) return;
    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;
    const [w, h] = [canvasRef.value.width, canvasRef.value.height];
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(originalImg.value, 0, 0);
    if (hasMaskContent.value) {
      const tint = document.createElement("canvas");
      [tint.width, tint.height] = [w, h];
      const tCtx = tint.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(maskCanvas, 0, 0);
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = "#ef4444";
        tCtx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(tint, 0, 0);
        ctx.restore();
      }
    }
  };

  return {
    canvasRef,
    isModelLoading,
    isImageProcessing,
    isProcessing,
    uploadedImage,
    hasMaskContent,
    brushSize,
    activeTool,
    handleAiSelect,
    init: (url: string) => {
      uploadedImage.value = url;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        originalImg.value = img;
        if (canvasRef.value)
          [canvasRef.value.width, canvasRef.value.height] = [
            img.width,
            img.height,
          ];
        if (maskCanvas && maskCtx) {
          [maskCanvas.width, maskCanvas.height] = [img.width, img.height];
          maskCtx.clearRect(0, 0, img.width, img.height);
        }
        render();
        isImageProcessing.value = true;
        worker?.postMessage({ type: "process_image", data: { imageUrl: url } });
      };
    },
    startDraw: (e: any) => {
      if (!uploadedImage.value) return;
      isDrawing.value = true;
      lastPos = getPixelPos(e);
    },
    moveDraw: (e: any) => {
      if (!isDrawing.value) return;
      const p = getPixelPos(e);
      drawManual(lastPos, p);
      lastPos = p;
    },
    stopDraw: () => (isDrawing.value = false),
    clear: () => {
      if (maskCtx && maskCanvas)
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      hasMaskContent.value = false;
      render();
    },
  };
};
