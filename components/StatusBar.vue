<script setup lang="ts">
const { progress, loggerStatus } = useLogger();

// Màu sắc thanh progress tương ứng với loại thông báo
const progressColor = computed(() => {
  switch (loggerStatus.value.type) {
    case "error":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    default:
      return "bg-blue-500";
  }
});
</script>

<template>
  <div
    class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3 shadow-sm min-h-[50px] transition-colors duration-300 relative overflow-hidden"
    :class="{
      'border-blue-500/50 bg-blue-900/10': loggerStatus.type === 'loading',
      'border-green-500/50 bg-green-900/10': loggerStatus.type === 'success',
      'border-red-500/50 bg-red-900/10': loggerStatus.type === 'error',
      'border-yellow-500/50 bg-yellow-900/10': loggerStatus.type === 'warning',
    }"
  >
    <div class="flex-shrink-0 flex items-center justify-center w-5">
      <div
        v-if="loggerStatus.type === 'loading'"
        class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"
      ></div>

      <PartsIconsSuccess v-else-if="loggerStatus.type === 'success'" />

      <PartsIconsError v-else-if="loggerStatus.type === 'error'" />

      <PartsIconsWarning v-else-if="loggerStatus.type === 'warning'" />

      <PartsIconsInformation v-else />
    </div>

    <div class="flex-1 overflow-hidden relative h-5">
      <Transition name="slide-up" mode="out-in">
        <p
          :key="loggerStatus.message"
          class="text-sm font-medium truncate absolute w-full leading-5"
          :class="{
            'text-blue-200': loggerStatus.type === 'loading',
            'text-green-300': loggerStatus.type === 'success',
            'text-red-300': loggerStatus.type === 'error',
            'text-gray-300': loggerStatus.type === 'info',
            'text-yellow-300': loggerStatus.type === 'warning',
          }"
        >
          {{ loggerStatus.message }}
        </p>
      </Transition>
    </div>

    <div
      v-if="loggerStatus.message && loggerStatus.type !== 'loading'"
      class="absolute bottom-0 left-0 h-[2px] transition-all duration-100 ease-linear"
      :class="progressColor"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<style scoped>
/* Animation trượt chữ lên khi đổi status */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
