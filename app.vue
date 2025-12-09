<script setup lang="ts">
import { ref, reactive } from "vue";

// --- Interfaces ---
interface GenerateSettings {
  width: number;
  height: number;
  prompt: string;
  enableSafetyChecker: boolean;
  enableSyncMode: boolean;
  enableBase64Output: boolean;
}

interface Log {
  time: string;
  message: string;
  type: "info" | "error" | "success";
}

// --- State ---
const settings = reactive<GenerateSettings>({
  width: 1024,
  height: 1024,
  prompt:
    "Keep the model's pose and the flowing shape of the liquid clothing unchanged. Change the clothing material from silver metal to completely transparent clear water.",
  enableSafetyChecker: false,
  enableSyncMode: false,
  enableBase64Output: false,
});

// URL ảnh mặc định
const defaultImageUrl =
  "https://d1q70pf5vjeyhc.cloudfront.net/media/92d2d4ca66f84793adcb20742b15d262/images/1764761316371833793_r5ZX531Z.jpeg";

// Khởi tạo uploadedFiles với ảnh mặc định
const uploadedFiles = ref<string[]>([defaultImageUrl]);

const isProcessing = ref(false);
const logs = ref<Log[]>([]);
const resultImage = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// --- Helper: Convert File to Base64 & Append ---
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    // Duyệt qua các file mới chọn và thêm vào danh sách hiện có
    Array.from(target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          uploadedFiles.value.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input để có thể chọn lại cùng 1 file nếu muốn
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
};

// --- Helper: Remove Image ---
const removeImage = (index: number) => {
  // Xóa 1 phần tử tại vị trí index
  uploadedFiles.value.splice(index, 1);
};

// --- Helper: Logging ---
const addLog = (
  message: string,
  type: "info" | "error" | "success" = "info"
) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  });
};

const cleanBase64 = (str: string) => {
  // Nếu là URL (bắt đầu bằng http) thì giữ nguyên
  if (str.startsWith("http")) return str;
  // Nếu là Base64 có header (data:image...) thì cắt bỏ, chỉ lấy phần mã sau dấu phẩy
  if (str.includes(",")) return str.split(",")[1];
  return str;
};

// --- Main Logic: Submit & Poll ---
const handleSubmit = async () => {
  if (uploadedFiles.value.length === 0) {
    addLog("Vui lòng upload ít nhất 1 ảnh reference!", "error");
    return;
  }

  isProcessing.value = true;
  resultImage.value = null;
  addLog("Đang gửi yêu cầu...", "info");

  try {
    // 1. Xử lý danh sách ảnh: Làm sạch Base64 trước khi gửi
    const processedImages = uploadedFiles.value.map((img) => cleanBase64(img));

    // 1. Chuẩn bị payload
    const payload = {
      enable_base64_output: settings.enableBase64Output,
      enable_sync_mode: settings.enableSyncMode,
      enable_safety_checker: settings.enableSafetyChecker,
      images: processedImages,
      prompt: settings.prompt,
      size: `${settings.width}*${settings.height}`,
    };

    console.log("Payload gửi đi:", payload); // F12 để xem payload

    // 2. Gọi Server API để submit
    const submitResponse: any = await $fetch("/api/generate", {
      method: "POST",
      body: payload,
    });

    if (!submitResponse?.data?.id) {
      throw new Error("Không nhận được Request ID từ server");
    }

    const requestId = submitResponse.data.id;
    addLog(`Task ID: ${requestId}. Đang xử lý...`, "info");

    // 3. Polling Loop
    const pollInterval = setInterval(async () => {
      try {
        const statusRes: any = await $fetch(`/api/status?id=${requestId}`);
        const data = statusRes.data;
        const status = data.status;

        if (status === "completed") {
          clearInterval(pollInterval);
          isProcessing.value = false;
          resultImage.value = data.outputs[0];
          addLog("Hoàn thành! Ảnh đã được tạo.", "success");
        } else if (status === "failed") {
          clearInterval(pollInterval);
          isProcessing.value = false;
          addLog(`Thất bại: ${data.error || "Lỗi không xác định"}`, "error");
        } else {
          console.log(`Status: ${status}`);
        }
      } catch (err) {
        clearInterval(pollInterval);
        isProcessing.value = false;
        addLog(`Lỗi khi kiểm tra trạng thái: ${err}`, "error");
      }
    }, 2000);
  } catch (error: any) {
    isProcessing.value = false;
    console.log("Full Error Object:", error);

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

        <div>
          <label class="block text-sm font-medium mb-2 text-gray-300">
            Reference Images ({{ uploadedFiles.length }})
          </label>

          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer mb-3"
          />

          <div
            v-if="uploadedFiles.length > 0"
            class="flex flex-wrap gap-3 p-2 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <div
              v-for="(img, idx) in uploadedFiles"
              :key="idx"
              class="relative group h-20 w-20 flex-shrink-0"
            >
              <img
                :src="img"
                class="h-full w-full object-cover rounded border border-gray-600"
              />

              <button
                @click="removeImage(idx)"
                class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-gray-500 italic mt-2">
            Chưa có ảnh nào được chọn.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-gray-300"
            >Prompt</label
          >
          <textarea
            v-model="settings.prompt"
            rows="4"
            class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4 bg-gray-700/30 p-3 rounded-lg">
          <div>
            <label class="block text-xs mb-1 text-gray-400"
              >Width:
              <span class="text-blue-400 font-bold">{{ settings.width }}</span
              >px</label
            >
            <input
              type="range"
              v-model.number="settings.width"
              min="64"
              max="4096"
              step="64"
              class="w-full accent-blue-500"
            />
          </div>
          <div>
            <label class="block text-xs mb-1 text-gray-400"
              >Height:
              <span class="text-blue-400 font-bold">{{ settings.height }}</span
              >px</label
            >
            <input
              type="range"
              v-model.number="settings.height"
              min="64"
              max="4096"
              step="64"
              class="w-full accent-blue-500"
            />
          </div>
          <p class="col-span-2 text-xs text-center text-gray-500">
            Size payload: {{ settings.width }}*{{ settings.height }}
          </p>
        </div>

        <div class="space-y-3 p-3 bg-gray-700/30 rounded-lg">
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              v-model="settings.enableSafetyChecker"
              class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
            />
            <span class="text-sm group-hover:text-blue-300 transition-colors"
              >Enable Safety Checker</span
            >
          </label>
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              v-model="settings.enableSyncMode"
              class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
            />
            <span class="text-sm group-hover:text-blue-300 transition-colors"
              >Enable Sync Mode</span
            >
          </label>
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              v-model="settings.enableBase64Output"
              class="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
            />
            <span class="text-sm group-hover:text-blue-300 transition-colors"
              >Base64 Output</span
            >
          </label>
        </div>

        <button
          @click="handleSubmit"
          :disabled="isProcessing || uploadedFiles.length === 0"
          class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <span v-if="isProcessing" class="animate-spin text-xl">⟳</span>
          {{ isProcessing ? "Processing..." : "Generate Image" }}
        </button>
      </div>

      <div class="lg:col-span-2 flex flex-col gap-6 h-[85vh] lg:h-auto">
        <div
          class="flex-1 bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center justify-center relative overflow-hidden group min-h-[400px]"
        >
          <div
            v-if="!resultImage && !isProcessing"
            class="text-gray-500 text-center"
          >
            <p class="text-5xl mb-4 opacity-50">🎨</p>
            <p class="text-lg">Kết quả sẽ hiển thị tại đây</p>
          </div>

          <div v-if="isProcessing && !resultImage" class="text-center">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"
            ></div>
            <p class="text-gray-300 animate-pulse text-lg">AI đang vẽ...</p>
          </div>

          <img
            v-if="resultImage"
            :src="resultImage"
            class="w-full h-full object-contain rounded-lg shadow-2xl"
          />

          <a
            v-if="resultImage"
            :href="resultImage"
            download="generated-image.png"
            class="absolute bottom-6 right-6 bg-blue-600/90 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-4"
          >
            Download Image
          </a>
        </div>

        <div
          class="h-64 bg-[#0d1117] rounded-xl border border-gray-800 p-4 font-mono text-xs overflow-y-auto shadow-inner"
        >
          <div class="mb-2 text-gray-500 font-bold uppercase tracking-wider">
            System Logs
          </div>
          <div
            v-for="(log, i) in logs"
            :key="i"
            :class="{
              'text-green-400': log.type === 'success',
              'text-red-400': log.type === 'error',
              'text-blue-300': log.type === 'info',
            }"
            class="mb-1.5 border-l-2 pl-2 border-gray-800 hover:bg-gray-900/50 transition-colors"
          >
            <span class="opacity-50 text-gray-500">[{{ log.time }}]</span>
            <span class="ml-1">{{ log.message }}</span>
          </div>
          <div v-if="logs.length === 0" class="text-gray-600 italic">
            Waiting for actions...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
