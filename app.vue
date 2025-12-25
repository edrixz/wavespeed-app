<script setup lang="ts">
const { hasLogMessage } = useLogger();
const { isCanNotGenerate, isProcessing, resultImage, handleGenerate } =
  useWavespeedApiGenerate();
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 text-white p-6 pb-32 lg:pb-6 font-sans transition-all duration-500"
  >
    <Transition name="expand">
      <div v-if="hasLogMessage" class="status-bar-wrapper">
        <StatusBar />
      </div>
    </Transition>

    <ToastContainer />

    <div class="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        <SettingsForm />

        <div
          class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 lg:static lg:bg-transparent lg:border-none lg:p-0 transition-all"
        >
          <button
            @click="handleGenerate"
            :disabled="isProcessing || isCanNotGenerate"
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
        <ResultDisplay :image="resultImage" :loading="isProcessing" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #111827;
  /* Tăng khoảng cách này giúp layout dưới không bị dính sát khi trượt */
  padding-bottom: 1.25rem;
}

.expand-enter-active {
  /* Khi xuất hiện: mượt và có độ nảy nhẹ */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.expand-leave-active {
  /* Khi biến mất: trượt lên nhanh và dứt khoát */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
  /* Trượt nhẹ lên trên cùng lúc với co chiều cao */
  transform: translateY(-20px);
}

.expand-enter-to,
.expand-leave-from {
  max-height: 120px; /* Đảm bảo con số này lớn hơn StatusBar thực tế */
  opacity: 1;
  padding-bottom: 1.25rem;
  transform: translateY(0);
}
</style>
