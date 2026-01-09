// stores/common/auth-store.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "./ui/toast-store";

export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient();
  const toastStore = useToastStore();
  const isLoading = ref(false);

  const handleLogin = async (username: string, pass: string) => {
    isLoading.value = true;
    try {
      // Mapping: Username -> Email nội bộ
      const internalEmail = `${username.toLowerCase()}@wavespeed.internal`;

      const { error } = await client.auth.signInWithPassword({
        email: internalEmail,
        password: pass,
      });

      if (error) throw error;

      toastStore.addToast("Chào mừng bạn trở lại!", "success");
      // Dùng window.location để refresh sạch sẽ trạng thái
      window.location.href = "/";
    } catch (err: any) {
      toastStore.addToast("Tên đăng nhập hoặc mật khẩu không đúng.", "error");
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    const client = useSupabaseClient();

    // 1. Xóa session trên Supabase
    await client.auth.signOut();

    // 2. Chuyển hướng và reload trang để chặn đứng mọi logic cũ
    window.location.href = "/login";
  };

  return { isLoading, handleLogin, logout };
});
