<script lang="ts" setup>
const payloadStore = useGrokPayloadStore();

const { prompt, enableSafetyChecker, enableSyncMode, enableBase64Output } =
  storeToRefs(payloadStore);
</script>

<template>
  <PartsFormBasePromptTextArea
    v-model="prompt"
    label="Prompt"
    variant="blue"
    placeholder="Describe your vision..."
  />

  <div
    class="grid grid-cols-1 gap-2 p-4 bg-gray-800/20 rounded-2xl border border-white/5"
  >
    <PartsFormBaseCheckboxItem
      label="Safety Checker"
      v-model="enableSafetyChecker"
    />
    <PartsFormBaseCheckboxItem
      label="Sync Mode (Real-time)"
      v-model="enableSyncMode"
    />
    <PartsFormBaseCheckboxItem
      label="Base64 Output"
      v-model="enableBase64Output"
    />
  </div>
</template>

<style scoped>
/* Hiệu ứng mượt mà khi chuyển đổi] */
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
