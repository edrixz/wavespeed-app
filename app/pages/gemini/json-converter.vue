<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

definePageMeta({ layout: "default" });

const { copy, copied } = useClipboard();

// ======================== STATE ======================== //
const currentStep = ref(1);

const jsonInput = ref("");
const selectedRemovals = ref<string[]>([]);
const removalOptions = [
  "Hair",
  "Face",
  "Identity",
  "Makeup",
  "Expression",
  "Clothes",
  "Setting & Environment",
];

// STATE: Step 1 (JSON Lọc)
const cleanedJsonOutput = ref("");
const isCleaning = ref(false);
const cleanErrorMsg = ref("");

// STATE: Step 2 (Văn bản)
const promptOutput = ref("");
const isConverting = ref(false);
const convertErrorMsg = ref("");
const copiedField = ref("");

// ======================== ACTIONS ======================== //

const handleCopy = (text: string, fieldType: string) => {
  if (text) {
    copy(text);
    copiedField.value = fieldType;
    setTimeout(() => {
      copiedField.value = "";
    }, 2000);
  }
};

const goToStep = (targetStep: number) => {
  currentStep.value = targetStep;
};

// STEP 1: Xử lý loại bỏ thành phần JSON trực tiếp (Chỉ xử lý, KHÔNG TỰ ĐỘNG NHẢY STEP)
const handleCleanJSON = async () => {
  if (!jsonInput.value.trim()) {
    cleanErrorMsg.value = "Vui lòng nhập định dạng JSON để hệ thống bắt đầu quét.";
    return;
  }

  cleanErrorMsg.value = "";
  isCleaning.value = true;

  if (selectedRemovals.value.length === 0) {
    cleanedJsonOutput.value = jsonInput.value;
    isCleaning.value = false;
    return;
  }

  try {
    const response: any = await $fetch("/api/gemini/clean-json", {
      method: "POST",
      body: {
        jsonPrompt: jsonInput.value,
        elementsToRemove: [...selectedRemovals.value],
      },
    });

    if (response && response.success && response.data) {
      cleanedJsonOutput.value = response.data.trim();
    } else {
      cleanErrorMsg.value = "Hệ thống lỗi: JSON không xác định.";
    }
  } catch (err: any) {
    const errorDetail = err.data?.statusMessage || err.message;
    cleanErrorMsg.value = errorDetail;
  } finally {
    isCleaning.value = false;
  }
};

// STEP 2: Chuyển đổi JSON rác đã lọc sạch thành chuỗi chữ tiếng anh
const handleConvert = async () => {
  const inputPayload = cleanedJsonOutput.value || jsonInput.value;

  if (!inputPayload.trim()) {
    convertErrorMsg.value = "Không có bất kỳ dữ liệu (JSON) nào hợp lệ để xuất ra chữ! Bạn cần chạy Bước 1 trước hoặc nhập JSON gốc.";
    return;
  }

  convertErrorMsg.value = "";
  isConverting.value = true;

  try {
    const response: any = await $fetch("/api/gemini/convert-prompt", {
      method: "POST",
      body: { jsonPrompt: inputPayload },
    });

    if (response && response.success && response.data) {
      promptOutput.value = response.data.trim();
    } else {
      convertErrorMsg.value = "Lỗi khi trích xuất chữ từ Gemini.";
    }
  } catch (err: any) {
    const errorDetail = err.data?.statusMessage || err.message;
    convertErrorMsg.value = "Từ chối thực thi: " + errorDetail;
  } finally {
    isConverting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col w-full px-6 lg:px-12 py-8 max-w-[1600px] mx-auto min-h-screen">
    
    <!-- 1. HEADER CHUNG -->
    <div class="flex items-center gap-4 mb-10">
      <button
        @click="$router.push('/gemini')"
        class="flex items-center justify-center p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-gray-700 dark:text-gray-300"
      >
        <Icon name="lucide:arrow-left" class="w-6 h-6" />
      </button>
      <div>
        <h1 class="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">AI Prompt Converter</h1>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Eliminate unnecessary JSON prompts and switch to a plain text prompt using the power of AI.</p>
      </div>
    </div>

    <!-- 2. TRẠNG THÁI STEPPER -->
    <div class="flex items-center justify-center gap-4 mb-10 max-w-2xl mx-auto w-full select-none">
      <div 
        @click="goToStep(1)"
        class="flex flex-col items-center gap-2 cursor-pointer group"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all border-2 text-lg"
            :class="currentStep === 1 ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-600/20' : 'bg-transparent text-gray-400 border-gray-300 dark:border-gray-700 group-hover:border-blue-400'">
          1
        </div>
      </div>
      
      <div class="flex-1 h-[2px] rounded-full transition-all" :class="currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-800'"></div>
      
      <div 
        @click="goToStep(2)"
        class="flex flex-col items-center gap-2 cursor-pointer group"
      >
        <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all border-2 text-lg"
             :class="currentStep === 2 ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-600/20' : 'bg-transparent text-gray-400 border-gray-300 dark:border-gray-700 group-hover:border-blue-400'">
          2
        </div>
      </div>
    </div>

    <!-- =================MÀN HÌNH STEP 1================= -->
    <div v-show="currentStep === 1" class="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      
      <!-- Top Bar Step 1 -->
      <div class="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
        <h2 class="text-xl font-bold uppercase tracking-wider flex items-center gap-3">
          <Icon name="lucide:settings-2" class="text-blue-500 w-6 h-6" />
          Bóc tách dữ liệu JSON
        </h2>
      </div>

      <!-- Không gian làm việc 2 cột -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
        
        <!-- Cột Input -->
        <div class="flex flex-col h-full space-y-3">
          <label class="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <Icon name="lucide:code" class="w-4 h-4" />
            Original JSON
          </label>
          <textarea
            v-model="jsonInput"
            placeholder="Dán mã JSON gốc cần dọn dẹp vào đây..."
            class="w-full flex-1 min-h-[400px] lg:min-h-[500px] bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/10 rounded-2xl p-6 text-[13px] font-mono leading-relaxed outline-none transition-all resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>

        <!-- Cột Output JSON Sạch -->
        <div class="flex flex-col h-full space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
              <Icon name="lucide:code-2" class="w-4 h-4" />
              Filtered JSON
            </label>
            <button
               v-if="cleanedJsonOutput"
               class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold transition-all border outline-none cursor-pointer"
               :class="copiedField === 'json' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'bg-transparent border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'"
               @click="handleCopy(cleanedJsonOutput, 'json')"
             >
               <Icon :name="copiedField === 'json' ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" />
               {{ copiedField === 'json' ? 'Đã chép' : 'Copy' }}
             </button>
          </div>
          
          <div class="relative w-full flex-1 min-h-[400px] lg:min-h-[500px]">
            <textarea
              v-model="cleanedJsonOutput"
              readonly
              placeholder="Văn bản JSON sạch sau khi nhấn 'Thực thi Lọc JSON' sẽ hiển thị tại đây nhé!"
              class="w-full h-full bg-blue-50/30 dark:bg-blue-900/5 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-6 text-[13px] font-mono leading-relaxed outline-none resize-none shadow-inner text-blue-900 dark:text-blue-300 whitespace-pre-wrap selection:bg-blue-200"
            ></textarea>
            
            <div v-if="isCleaning" class="absolute inset-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center space-y-4 border border-blue-100 dark:border-blue-900/50">
              <Icon name="lucide:loader-2" class="w-8 h-8 text-blue-500 animate-spin" />
              <p class="text-sm font-bold text-blue-700 dark:text-blue-300 tracking-wide animate-pulse">AI Đang quét & xóa rác...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Panel (Bottom of Step 1) -->
      <div class="mt-8 bg-gray-50 dark:bg-[#0d0d0d] p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
        <div>
          <label class="font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-wider text-sm mb-3">
            <Icon name="lucide:list-filter" class="w-5 h-5 text-blue-500" />
            Chọn Danh Mục Cần Xóa Bỏ
          </label>
          <div class="flex flex-wrap gap-3">
            <label 
              v-for="opt in removalOptions" 
              :key="opt"
              class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-solid cursor-pointer select-none transition-all duration-200"
              :class="selectedRemovals.includes(opt) ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400 font-bold shadow-sm' : 'bg-white dark:bg-black border-transparent shadow-sm text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/20'"
            >
              <input type="checkbox" :value="opt" v-model="selectedRemovals" class="hidden" />
              <Icon v-if="selectedRemovals.includes(opt)" name="lucide:check-circle-2" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span class="text-sm tracking-wide">{{ opt }}</span>
            </label>
          </div>
        </div>

        <div v-if="cleanErrorMsg" class="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20">
          <Icon name="lucide:alert-circle" class="w-5 h-5 shrink-0" />
          <p>{{ cleanErrorMsg }}</p>
        </div>

        <div class="flex justify-start">
          <PartsButtonPrimary
            :loading="isCleaning"
            @click="handleCleanJSON"
            class="w-full sm:w-auto font-bold tracking-wide"
          >
            Lọc JSON
          </PartsButtonPrimary>
        </div>
      </div>

    </div>

    <!-- =================MÀN HÌNH STEP 2================= -->
    <div v-show="currentStep === 2" class="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <!-- Top Bar Step 2 -->
      <div class="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
        <h2 class="text-xl font-bold uppercase tracking-wider flex items-center gap-3">
          <Icon name="lucide:languages" class="text-blue-500 w-6 h-6" />
          Generate Text
        </h2>
      </div>

      <!-- Không gian làm việc 2 cột -->
      <div class="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-8 lg:gap-12 flex-1 relative">
        
        <!-- Cột Xem Lại Trạng Thái Cleaned -->
        <div class="flex flex-col h-full space-y-3 opacity-60 hover:opacity-100 transition-opacity">
          <label class="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <Icon name="lucide:book-open" class="w-4 h-4" />
            Filtered Json
          </label>
          <textarea
            :value="cleanedJsonOutput || jsonInput"
            readonly
            class="w-full flex-1 min-h-[400px] lg:min-h-[500px] bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-white/10 rounded-2xl p-6 text-[12px] font-mono leading-relaxed outline-none resize-none shadow-inner text-gray-600 dark:text-gray-400"
          ></textarea>
        </div>

        <!-- Cột Final Output -->
        <div class="flex flex-col h-full space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-black tracking-widest text-[#3b82f6] uppercase flex items-center gap-2">
              <Icon name="lucide:sparkles" class="w-5 h-5 fill-blue-500/20" />
              Plain Text Prompt
            </label>
            <button
               v-if="promptOutput"
               class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase font-black transition-all border outline-none cursor-pointer shadow-sm"
               :class="copiedField === 'text' ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'"
               @click="handleCopy(promptOutput, 'text')"
             >
               <Icon :name="copiedField === 'text' ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
               {{ copiedField === 'text' ? 'Thành công' : 'Sao chép đoạn Text' }}
             </button>
          </div>
          
          <div class="relative w-full flex-1 min-h-[400px] lg:min-h-[500px]">
            <textarea
              v-model="promptOutput"
              readonly
              placeholder="Văn bản Plain Text chuẩn mực từ thuật toán AI sẽ hiện ra ở đây."
              class="w-full h-full bg-white dark:bg-[#0a0a0a] border-2 border-blue-600/20 dark:border-blue-900/50 rounded-2xl p-8 text-sm lg:text-[15px] font-mono leading-relaxed outline-none resize-none shadow-md text-neutral-900 dark:text-blue-100 whitespace-pre-wrap selection:bg-blue-200"
            ></textarea>
            
            <div v-if="isConverting" class="absolute inset-0 z-10 bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center space-y-5 border border-blue-100 dark:border-blue-800/50">
              <Icon name="lucide:loader-2" class="w-10 h-10 text-blue-500 animate-spin" />
              <p class="text-base font-bold text-blue-700 dark:text-blue-300 tracking-wide animate-pulse">AI Đang định dạng và nhóm cú pháp tiếng Anh...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Panel (Bottom of Step 2) -->
      <div class="mt-8 bg-gray-50 dark:bg-[#0d0d0d] p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Hãy luôn kiểm tra lại nội dung phía trên. Nếu vẫn chưa ưng ý, bạn có thể quay lại Bước 1 để loại bỏ thêm các từ khoá thừa.
        </p>

        <div v-if="convertErrorMsg" class="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 mt-4">
          <Icon name="lucide:alert-circle" class="w-5 h-5 shrink-0" />
          <p>{{ convertErrorMsg }}</p>
        </div>

        <div class="flex justify-end gap-4">
          <PartsButtonPrimary
            :loading="isConverting"
            @click="handleConvert"
            class="w-full sm:w-auto font-bold tracking-wide"
          >
            To Plain Text Prompt
          </PartsButtonPrimary>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
html.dark .border-solid {
  border-style: solid;
}
</style>
