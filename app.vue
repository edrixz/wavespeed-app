<script setup lang="ts">
import { ref, reactive } from "vue";
import { useLogger, useWaveSpeed, useUploadToTmpFiles } from "./composables";
import type { GenerateSettings, seedreamEditPayload } from "./types";

const { logs, addLog } = useLogger();
const { uploadMultipleFiles } = useUploadToTmpFiles();
const { isProcessing, resultImage, submitTask, pollTask } = useWaveSpeed();

// Settings State
const settings = reactive<GenerateSettings>({
  width: 1024,
  height: 1024,
  prompt:
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water.",
  enableSafetyChecker: false,
  enableSyncMode: false,
  enableBase64Output: false,
});

// Image State
const defaultImageUrl =
  "https://d1q70pf5vjeyhc.cloudfront.net/media/92d2d4ca66f84793adcb20742b15d262/images/1764761316371833793_r5ZX531Z.jpeg";
const selectedFiles = ref<File[]>([]);
const previewImages = ref<string[]>([]);

// --- Handlers ---
const handleFilesSelected = (files: FileList) => {
  Array.from(files).forEach((file) => {
    selectedFiles.value.push(file);
    previewImages.value.push(URL.createObjectURL(file));
  });
};

// Logic xóa ảnh
const handleRemoveImage = (index: number) => {
  if (
    previewImages.value[index] === defaultImageUrl &&
    selectedFiles.value.length < previewImages.value.length
  ) {
    previewImages.value.splice(index, 1);
    return;
  }
  previewImages.value.splice(index, 1);
  if (index < selectedFiles.value.length) selectedFiles.value.splice(index, 1);
};

const handleGenerate = async () => {
  if (previewImages.value.length === 0) {
    addLog("Vui lòng có ít nhất 1 ảnh reference!", "error");
    return;
  }

  isProcessing.value = true;
  resultImage.value = null;
  addLog("Bắt đầu xử lý...", "info");

  try {
    // 1. Chuẩn bị URL
    const finalImageUrls: string[] = [];

    // Lấy URL cũ
    previewImages.value.forEach((img) => {
      if (img.startsWith("http") && !img.startsWith("blob:"))
        finalImageUrls.push(img);
    });

    // Upload file mới
    if (selectedFiles.value.length > 0) {
      addLog(
        `Đang upload ${selectedFiles.value.length} ảnh lên server tạm...`,
        "info"
      );
      const uploadedUrls = await uploadMultipleFiles(selectedFiles.value);
      finalImageUrls.push(...uploadedUrls);
      addLog("Upload xong.", "success");
    }

    // 2. Gọi API
    const payload = <seedreamEditPayload>{
      enable_base64_output: settings.enableBase64Output,
      enable_sync_mode: settings.enableSyncMode,
      enable_safety_checker: settings.enableSafetyChecker,
      prompt: settings.prompt,
      images: finalImageUrls,
      size: `${settings.width}*${settings.height}`,
    };

    const taskId = await submitTask(payload);
    addLog(`Task ID: ${taskId}. Đang vẽ...`, "info");

    // 3. Polling
    const finalUrl = await pollTask(taskId, (status) => {
      // Có thể log status nếu muốn cho đỡ buồn
      addLog(`Status: ${status}`, "info");
    });

    resultImage.value = finalUrl;
    addLog("Hoàn thành! Ảnh đã được tạo.", "success");
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

    addLog(`Lỗi từ API: ${errorMsg}`, "error");
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 font-sans">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-1 space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit"
      >
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          WaveSpeed Generator
        </h1>

        <ImageUploader
          :preview-images="previewImages"
          @files-selected="handleFilesSelected"
          @remove-image="handleRemoveImage"
        />

        <SettingsForm v-model="settings" />

        <button
          @click="handleGenerate"
          :disabled="isProcessing"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <div v-if="isProcessing" className="flex justify-center">
            <div
              className="animate-spin h-5 w-5 border-4 border-blue-400 rounded-full border-t-transparent"
            ></div>
          </div>
          {{ isProcessing ? "Processing..." : "Generate Image" }}
        </button>
      </div>

      <div class="lg:col-span-2 flex flex-col gap-6">
        <ResultDisplay :image="resultImage" :loading="isProcessing" />

        <LogConsole :logs="logs" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar cho logs */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #111827;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
