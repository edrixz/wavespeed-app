export const usePolling = () => {
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

  return { pollTask };
};
