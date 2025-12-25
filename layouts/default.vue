<script setup lang="ts">
const { hasLogMessage } = useLogger();
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 text-white p-6 pb-32 lg:pb-6 font-sans transition-all duration-500"
  >
    <ToastContainer />

    <Transition name="expand">
      <div v-if="hasLogMessage" class="status-bar-wrapper">
        <StatusBar />
      </div>
    </Transition>

    <slot />
  </div>
</template>

<style scoped>
.status-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #111827;
  padding-bottom: 1.25rem;
}

.expand-enter-active {
  /* Khi xuất hiện: mượt và có độ nảy nhẹ */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.expand-leave-active {
  /* Khi biến mất: trượt lên nhanh và dứt khoát */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
  /* Trượt nhẹ lên trên cùng lúc với co chiều cao */
  transform: translateY(-20px);
}

.expand-enter-to,
.expand-leave-from {
  max-height: 120px; /* Đảm bảo con số này lớn hơn StatusBar thực tế */
  opacity: 1;
  padding-bottom: 1.25rem;
  transform: translateY(0);
}
</style>
