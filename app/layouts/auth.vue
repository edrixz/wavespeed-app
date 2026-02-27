<template>
  <div
    class="relative h-screen bg-neutral-50 dark:bg-[#050505] flex items-center justify-center p-6 overflow-hidden transition-colors"
  >
    <div class="absolute top-4 right-4 z-50">
      <CommonThemeToggle />
    </div>

    <CommonToastContainer />

    <div class="w-full max-w-[400px]">
      <slot />
    </div>
  </div>
</template>
