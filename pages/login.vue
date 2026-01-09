<script setup lang="ts">
import { storeToRefs } from "pinia";
definePageMeta({ layout: "auth" });

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");

// Sử dụng AuthStore từ hệ thống của bạn
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);

const validateAndLogin = async () => {
  errorMessage.value = "";

  // Validation cơ bản trước khi gọi API
  if (username.value.length < 3) {
    errorMessage.value = "Username tối thiểu 3 ký tự";
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = "Mật khẩu tối thiểu 6 ký tự";
    return;
  }

  // Gọi hàm login từ store
  await authStore.handleLogin(username.value, password.value);
};
</script>

<template>
  <div class="space-y-8 w-full max-w-[360px]">
    <div class="text-center">
      <h1 class="text-2xl font-black uppercase tracking-[0.4em] text-white">
        Wavespeed
      </h1>
      <p class="text-[9px] text-gray-500 uppercase mt-2 tracking-widest">
        Hệ thống tạo ảnh AI chuyên nghiệp
      </p>
    </div>

    <form @submit.prevent="validateAndLogin" class="space-y-4">
      <div class="relative group">
        <Icon
          name="lucide:user"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"
          size="18"
        />
        <input
          v-model="username"
          type="text"
          placeholder="Tên đăng nhập"
          required
          class="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
        />
      </div>

      <div class="relative group">
        <Icon
          name="lucide:lock"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"
          size="18"
        />
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mật khẩu"
          required
          class="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <Icon
            :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
            size="18"
          />
        </button>
      </div>

      <div class="h-4">
        <p
          v-if="errorMessage"
          class="text-[10px] text-red-500 text-center uppercase font-bold tracking-widest"
        >
          {{ errorMessage }}
        </p>
      </div>

      <button
        :disabled="isLoading"
        class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        <Icon
          v-if="isLoading"
          name="lucide:loader-2"
          class="animate-spin"
          size="16"
        />
        {{ isLoading ? "Đang kiểm tra..." : "Đăng nhập ngay" }}
      </button>
    </form>

    <div class="text-center space-y-4">
      <p
        class="text-[9px] text-gray-600 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
      >
        Quên mật khẩu?
      </p>
      <div class="h-px bg-white/5 w-full"></div>
      <p class="text-[9px] text-gray-500 uppercase tracking-widest">
        Chưa có tài khoản?
        <span
          class="text-blue-500 font-bold ml-1 cursor-pointer hover:underline"
          >Đăng ký</span
        >
      </p>
    </div>
  </div>
</template>
