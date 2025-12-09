// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    // Private keys (chỉ server mới thấy)
    wavespeedApiKey: process.env.NUXT_WAVESPEED_API_KEY,
    // Public keys (client thấy)
    public: {},
  },
});
