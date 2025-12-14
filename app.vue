<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  useLogger,
  useWaveSpeed,
  useUploadToTmpFiles,
  useImageUploader,
} from "./composables";
import type { GenerateSettings, seedreamEditPayload } from "./types";

const { loggerStatus, setStatus } = useLogger();
const { uploadMultipleFiles } = useUploadToTmpFiles();
const { isProcessing, resultImage, submitTask, pollTask } = useWaveSpeed();
const { images, filesToUpload } = useImageUploader();

// Settings State
const settings = reactive<GenerateSettings>({
  width: 2752,
  height: 4096,
  prompt:
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water.",
  negative_prompt:
    "blurry, low quality, jpeg artifacts, ugly, deformed, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, signature, watermark, bad feet, distorted, mutation.",
  enableSafetyChecker: false,
  enableSyncMode: false,
  enableBase64Output: false,
});

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
      enable_base64_output: settings.enableBase64Output,
      enable_sync_mode: settings.enableSyncMode,
      enable_safety_checker: settings.enableSafetyChecker,
      prompt: settings.prompt,
      negative_prompt: settings.negative_prompt,
      images: finalImageUrls,
      size: `${settings.width}*${settings.height}`,
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
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 pb-32 lg:pb-6 font-sans">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-1 space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit"
      >
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Wavespeed Seedream
        </h1>

        <!-- Reference Image Uploader -->
        <PartsImageUploader />

        <SettingsForm v-model="settings" />

        <div
          class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 lg:static lg:bg-transparent lg:border-none lg:p-0 transition-all"
        >
          <button
            @click="handleGenerate"
            :disabled="isProcessing"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg group relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            ></div>

            <span
              v-if="isProcessing"
              class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"
            />
            <span v-else class="flex items-center gap-2 relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"
                />
              </svg>
              Generate Image
            </span>
          </button>
        </div>
      </div>

      <div class="lg:col-span-2 flex flex-col gap-6">
        <StatusBar v-model="loggerStatus" />
        <ResultDisplay :image="resultImage" :loading="isProcessing" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
