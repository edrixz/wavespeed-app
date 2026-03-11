/**
 * Extracts a human-readable message from a Nuxt/ofetch FetchError or any error.
 *
 * ofetch throws FetchError with shape:
 *   error.data    = H3 error body { statusCode, statusMessage, data: { message } }
 *   error.status  = HTTP status code
 *   error.message = generic fetch message (e.g. "400 Bad Request")
 */
const extractErrorMessage = (error: any): string => {
  // ofetch FetchError — body từ H3 createError()
  if (error?.data) {
    return (
      error.data?.data?.message ||   // data.data.message (nested từ H3)
      error.data?.statusMessage ||   // statusMessage trực tiếp từ H3
      error.data?.message ||         // message trực tiếp
      error.message ||
      "Unknown error"
    );
  }

  // Fallback cho Error thông thường
  return error?.message || "Unknown error";
};

export const useResponseHandler = () => {
  const { setStatus } = useLogger();

  const handleError = (error: any): string => {
    const errorMsg = extractErrorMessage(error);
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
