<template>
  <header
    class="absolute top-0 left-0 right-0 h-12 px-4 lg:px-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/60 dark:bg-[#1E1F20]/40 backdrop-blur-xl transition-all duration-300 z-1000"
  >
    <div class="flex items-center gap-4">
      <div class="hidden lg:flex items-center gap-2">
        <span
          class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
        ></span>
        <span
          class="text-[10px] font-black uppercase text-gray-500 tracking-widest"
        >
          Global Cluster: Asia
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-4">
      <CommonThemeToggle />
      <LayoutPartsNotification />
      <LayoutPartsUserMenu />
    </div>
  </header>
</template>
