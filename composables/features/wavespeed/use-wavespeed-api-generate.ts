import { useLogger } from "~/composables";
import type {
  AnalyzedData,
  AnalyzeResponse,
  seedreamEditPayload,
} from "~/types";

export const useWavespeedApiGenerate = () => {
  const { setStatus } = useLogger();

  const { uploadMultipleFiles } = useUploadToTmpFiles();

  const imageStore = useImageStore();
  const { images, filesToUpload } = storeToRefs(imageStore);

  const isProcessing = ref(false);
  const resultImage = ref<string | null>(null);

  const payloadStore = useWavespeedPayloadStore();
  const {
    prompt,
    negative_prompt,
    width,
    height,
    enableSafetyChecker,
    enableBase64Output,
    enableSyncMode,
  } = storeToRefs(payloadStore);

  // Hàm gọi API tạo task
  const submitTask = async (payload: any) => {
    const response: any = await $fetch("/api/generate", {
      method: "POST",
      body: payload,
    });

    if (!response?.data?.id) throw new Error("Không nhận được Task ID");
    return response.data.id;
  };

  // Hàm Polling kiểm tra trạng thái
  const pollTask = async (
    taskId: string,
    onStatus?: (status: string) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const statusRes: any = await $fetch(`/api/status?id=${taskId}`);
          const data = statusRes.data;
          const status = data.status;

          if (onStatus) onStatus(status);

          if (status === "completed") {
            clearInterval(pollInterval);
            resolve(data.outputs[0]);
          } else if (status === "failed") {
            clearInterval(pollInterval);
            reject(new Error(data.error || "Task failed"));
          }
        } catch (err) {
          clearInterval(pollInterval);
          reject(err);
        }
      }, 2000);
    });
  };

  const handleGenerate = async () => {
    if (images.value.length === 0) {
      setStatus("Vui lòng có ít nhất 1 ảnh reference!", "error");
      return;
    }

    isProcessing.value = true;
    resultImage.value = null;
    setStatus("Bắt đầu xử lý...", "info");

    try {
      // 1. Chuẩn bị URL
      const finalImageUrls: string[] = [];

      // Lấy URL cũ
      images.value.forEach((img) => {
        if (img.url.startsWith("http") && !img.url.startsWith("blob:"))
          finalImageUrls.push(img.url);
      });

      // Upload file mới
      if (filesToUpload.value.length > 0) {
        setStatus(
          `Đang upload ${filesToUpload.value.length} ảnh lên server tạm...`,
          "loading"
        );

        const uploadedUrls = await uploadMultipleFiles(filesToUpload.value);
        finalImageUrls.push(...uploadedUrls);
        setStatus("Upload xong.", "success");
      }

      // 2. Gọi API
      const payload = <seedreamEditPayload>{
        enable_base64_output: enableBase64Output.value,
        enable_sync_mode: enableSyncMode.value,
        enable_safety_checker: enableSafetyChecker.value,
        prompt: prompt.value,
        negative_prompt: negative_prompt.value,
        images: finalImageUrls,
        size: `${width.value}*${height.value}`,
      };

      setStatus("Đang gửi yêu cầu tới AI...", "loading");
      const taskId = await submitTask(payload);
      setStatus(`Task ID: ${taskId}. Đang vẽ (Vui lòng đợi)...`, "loading");

      // 3. Polling
      const finalUrl = await pollTask(taskId, (taskStatus) => {
        // Cập nhật trạng thái realtime từ polling
        setStatus(`AI đang xử lý: ${taskStatus}...`, "loading");
      });

      resultImage.value = finalUrl;
      setStatus("Hoàn thành! Ảnh đã sẵn sàng.", "success");
    } catch (error: any) {
      isProcessing.value = false;

      // Logic ưu tiên để lấy tin nhắn lỗi chính xác nhất:
      // 1. Lấy message từ cấu trúc data chi tiết (nếu server WaveSpeed trả về)
      // 2. Lấy statusMessage (nơi chứa "Insufficient credits...")
      // 3. Nếu không có, mới lấy message chung chung
      const errorMsg =
        error.response?._data?.data?.message ||
        error.response?._data?.statusMessage ||
        error.response?._data?.message ||
        error.message ||
        "Lỗi không xác định";

      setStatus(`Lỗi: ${errorMsg}`, "error");
    } finally {
      isProcessing.value = false;
    }
  };

  const isCanNotGenerate = computed(() => prompt.value === "");

  return { isProcessing, resultImage, isCanNotGenerate, handleGenerate };
};
