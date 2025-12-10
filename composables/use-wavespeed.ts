export const useWaveSpeed = () => {
  const isProcessing = ref(false);
  const resultImage = ref<string | null>(null);

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

  return { isProcessing, resultImage, submitTask, pollTask };
};
