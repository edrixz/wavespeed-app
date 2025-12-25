// stores/authStore.ts
export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const isLoading = ref(false);

  const handleLogin = async (username: string, pass: string) => {
    isLoading.value = true;
    try {
      // Mapping: Username -> Email nội bộ Senior Fullstack Developer...]
      const internalEmail = `${username.toLowerCase()}@wavespeed.internal`;

      const { error } = await client.auth.signInWithPassword({
        email: internalEmail,
        password: pass,
      });

      if (error) throw error;

      toast.success("Chào mừng bạn trở lại!");
      // Dùng window.location để refresh sạch sẽ trạng thái Senior Fullstack Developer...]
      window.location.href = "/";
    } catch (err: any) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    const client = useSupabaseClient();

    // 1. Xóa session trên Supabase Senior Fullstack Developer]
    await client.auth.signOut();

    // 2. Chuyển hướng và reload trang để chặn đứng mọi logic cũ Senior Fullstack Developer]
    window.location.href = "/login";
  };

  return { isLoading, handleLogin, logout };
});
