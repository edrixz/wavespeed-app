import { useLogger } from "~/composables/common";

export const useResponseHandler = () => {
  const { setStatus } = useLogger();

  const handleError = (error: any): string => {
    const errorMsg =
      error.response?._data?.data?.message ||
      error.response?._data?.statusMessage ||
      error.response?._data?.message ||
      error.message ||
      "Unknown error";

    setStatus(`Error: ${errorMsg}`, "error");
    return errorMsg;
  };

  const handleSuccess = (message: string = "Completed!") => {
    setStatus(message, "success");
  };

  return {
    handleError,
    handleSuccess,
  };
};
