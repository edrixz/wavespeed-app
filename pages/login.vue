<script setup lang="ts">
definePageMeta({ layout: "auth" });

const username = ref("");
const password = ref("");
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
</script>

<template>
  <div class="space-y-8 w-full max-w-[360px]">
    <div class="text-center">
      <h1 class="text-xl font-black uppercase tracking-[0.4em] text-white">
        Wavespeed
      </h1>
      <p class="text-[9px] text-gray-500 uppercase mt-2 tracking-widest">
        Sign in with Username
      </p>
    </div>

    <form
      @submit.prevent="authStore.handleLogin(username, password)"
      class="space-y-4"
    >
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
        class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
      />

      <button
        :disabled="isLoading"
        class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-500/20"
      >
        {{ isLoading ? "Checking Account..." : "Sign In" }}
      </button>
    </form>
  </div>
</template>
