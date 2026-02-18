<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({ layout: "auth" });

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);

// Computed: Kiểm tra form có hợp lệ không
// Button sẽ disable nếu giá trị này là false
const isFormValid = computed(() => {
  return username.value.length >= 3 && password.value.length >= 6;
});

const validateAndLogin = async () => {
  errorMessage.value = "";

  // Safety net: Chặn thêm 1 lần nữa phòng trường hợp user hack disable attribute trong HTML
  if (!isFormValid.value) return;

  try {
    await authStore.handleLogin(username.value, password.value);
  } catch (error) {
    // Xử lý lỗi nếu API trả về (ví dụ: sai mật khẩu)
    errorMessage.value = "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
  }
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
      <PartsFormInputWithIcon
        v-model="username"
        icon="lucide:user"
        placeholder="Tên đăng nhập"
        required
      />

      <PartsFormInputWithIcon
        v-model="password"
        type="password"
        icon="lucide:lock"
        placeholder="Mật khẩu"
        required
      />

      <div class="h-4">
        <p
          v-if="errorMessage"
          class="text-[10px] text-red-500 text-center uppercase font-bold tracking-widest"
        >
          {{ errorMessage }}
        </p>
      </div>

      <PartsButtonPrimary
        type="submit"
        :loading="isLoading"
        :disabled="!isFormValid"
      >
        {{ isLoading ? "Đang kiểm tra..." : "Đăng nhập ngay" }}
      </PartsButtonPrimary>
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
        >
          Đăng ký
        </span>
      </p>
    </div>
  </div>
</template>
