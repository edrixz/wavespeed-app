// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const publicPages = ["/login", "/register"];

  // Nếu chưa login và vào trang bảo vệ -> Chuyển hướng ngay ở Server Senior Fullstack Developer...]
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo("/login", { redirectCode: 302 });
  }
});
