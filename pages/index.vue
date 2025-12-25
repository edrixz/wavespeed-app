<script setup lang="ts">
// 1. Khai báo Meta và Auth Senior Fullstack Developer...]
definePageMeta({ layout: "default" });

const authStore = useAuthStore();
const user = useSupabaseUser();

// 2. Logic tạo ảnh từ snippet của bạn
const { isCanNotGenerate, isProcessing, resultImage, handleGenerate } =
  useWavespeedApiGenerate();
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex items-center justify-between bg-gray-800/40 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5"
        >
          <span class="text-blue-400 text-xs font-black uppercase">{{
            user?.email?.charAt(0)
          }}</span>
        </div>
        <div>
          <p
            class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]"
          >
            Session Active
          </p>
          <p class="text-sm font-bold text-white tracking-tight">
            {{ user?.email?.split("@")[0] }}
          </p>
        </div>
      </div>

      <button
        @click="authStore.logout"
        class="px-5 py-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>
    </div>

    <div class="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-1 space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit"
      >
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Wavespeed Seedream
        </h1>

        <PartsImageUploader />

        <SettingsForm />

        <div
          class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-700 lg:static lg:bg-transparent lg:border-none lg:p-0 transition-all"
        >
          <button
            @click="handleGenerate"
            :disabled="isProcessing || isCanNotGenerate"
            class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl group relative overflow-hidden"
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
