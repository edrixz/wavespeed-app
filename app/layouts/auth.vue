<template>
  <div
    class="h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden"
  >
    <ToastContainer />

    <div class="w-full max-w-[400px]">
      <slot />
    </div>
  </div>
</template>
