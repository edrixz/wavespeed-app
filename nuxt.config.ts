// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Be Vietnam Pro": [300, 400, 500, 600, 700],
        },
        display: "swap",
        subsets: ["vietnamese"],
        download: true,
        inject: true,
      },
    ],
    "@nuxtjs/supabase",
    "@nuxt/image",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    // Private keys (chỉ server mới thấy)
    wavespeedApiKey: process.env.NUXT_WAVESPEED_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    // Public keys (client thấy)
    public: {},
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/register"],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
