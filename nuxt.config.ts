// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4, // Kích hoạt cấu trúc Nuxt 4 (ưu tiên app/)
  },
  devtools: { enabled: true },

  // 1. Tự động load Components (bao gồm cả các thư mục con sâu)
  components: [
    {
      path: "~/components",
      pathPrefix: true,
    },
  ],

  // 2. Tự động load Composables, Utils, Stores từ các thư mục con
  imports: {
    dirs: [
      "composables/**", // Quét tất cả file trong app/composables và thư mục con
      "utils/**", // Quét tất cả file trong app/utils và thư mục con
      "stores/**", // Quét tất cả file trong app/stores và thư mục con (dành cho Pinia)
    ],
  },

  modules: [
    "@nuxt/ui",
    "@nuxt/icon",
    "@pinia/nuxt",
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
    wavespeedApiKey: process.env.NUXT_WAVESPEED_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
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

  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    },
  },
});
