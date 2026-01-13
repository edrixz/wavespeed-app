<script setup lang="ts">
defineEmits(["open-menu"]);
</script>

<template>
  <header
    class="h-16 lg:h-20 px-4 lg:px-8 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0 z-40"
  >
    <div class="flex items-center gap-4">
      <button
        @click="$emit('open-menu')"
        class="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
      >
        <Icon name="lucide:menu" size="24" />
      </button>

      <div class="hidden lg:flex items-center gap-2">
        <span
          class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
        ></span>
        <span
          class="text-[10px] font-black uppercase text-gray-500 tracking-widest"
          >Global Cluster: Asia</span
        >
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-4">
      <LayoutPartsNotification />

      <LayoutPartsUserMenu />
    </div>
  </header>
</template>
