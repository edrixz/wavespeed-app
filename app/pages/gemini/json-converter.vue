<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

definePageMeta({ layout: "default" });

const jsonInput = ref("");
const promptOutput = ref("");
const errorMsg = ref("");
const isConverting = ref(false);

const { copy, copied } = useClipboard();

const handleConvert = async () => {
  if (!jsonInput.value.trim()) {
    errorMsg.value = "Vui lòng nhập định dạng JSON hoặc văn bản.";
    return;
  }

  errorMsg.value = "";
  promptOutput.value = "";
  isConverting.value = true;

  try {
    const response: any = await $fetch("/api/gemini/convert-prompt", {
      method: "POST",
      body: { jsonPrompt: jsonInput.value },
    });

    if (response.success && response.data) {
      promptOutput.value = response.data.trim();
    } else {
      errorMsg.value = "Không thể đọc kết quả phân tích từ AI.";
    }
  } catch (err: any) {
    errorMsg.value = "Lỗi khi gọi Gemini: " + err.message;
  } finally {
    isConverting.value = false;
  }
};

const handleCopy = () => {
  if (promptOutput.value) {
    copy(promptOutput.value);
  }
};
</script>

<template>
  <div class="flex flex-col max-w-7xl mx-auto pb-28 lg:pb-8 pt-6 px-4">
    <div class="mb-8 flex items-center gap-3">
      <NuxtLink
        to="/gemini"
        class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl lg:text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
          AI Prompt Converter
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl text-sm">
          Sử dụng sức mạnh của Gemini AI để đọc hiểu, tóm tắt và chuyển đổi các mã thông tin rời rạc thành văn bản prompt liền mạch, chuẩn mực.
        </p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Input Section -->
      <div class="space-y-4">
        <label class="font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-wider text-sm">
          <UIcon name="i-heroicons-code-bracket" class="text-blue-500 w-5 h-5" />
          Payload Input
        </label>
        
        <div class="relative group">
          <textarea
            v-model="jsonInput"
            rows="20"
            placeholder="Dán đoạn JSON hoặc mã chứa thông tin mô tả vào đây..."
            class="w-full bg-white dark:bg-[#0d0d0d] border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm font-mono leading-relaxed outline-none transition-all resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 shadow-sm"
          ></textarea>
        </div>

        <div v-if="errorMsg" class="flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
          <UIcon name="i-heroicons-exclamation-triangle" />
          {{ errorMsg }}
        </div>

        <PartsButtonPrimary
          icon="lucide:sparkles"
          :loading="isConverting"
          @click="handleConvert"
          class="w-full md:w-auto"
        >
          {{ isConverting ? "Gemini đang xử lý..." : "Gemini Convert" }}
        </PartsButtonPrimary>
      </div>

      <!-- Output Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="font-bold flex items-center gap-2 text-neutral-900 dark:text-white uppercase tracking-wider text-sm">
            <UIcon name="i-heroicons-document-text" class="text-emerald-500 w-5 h-5" />
            Plain Text Output
          </label>
          
          <UButton
            v-if="promptOutput"
            :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document-check'"
            :label="copied ? 'Copied' : 'Copy Result'"
            :color="copied ? 'success' : 'neutral'"
            variant="soft"
            @click="handleCopy"
            class="rounded-xl font-bold transition-all shadow-sm"
          />
        </div>
        
        <div class="relative h-full">
          <div v-if="isConverting" class="absolute inset-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-4">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
            <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Đang phân tích và định dạng dữ liệu...</p>
          </div>
          <textarea
            v-model="promptOutput"
            rows="20"
            readonly
            placeholder="Kết quả văn bản thông minh từ AI sẽ hiển thị ở đây..."
            class="w-full h-full min-h-[500px] bg-gray-50 dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-2xl p-6 text-sm font-mono leading-relaxed outline-none transition-all resize-y shadow-inner text-gray-800 dark:text-gray-300 whitespace-pre-wrap"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
