<script lang="ts" setup>
import { ASPECT_RATIOS, RESOLUTION, QUALITY } from "@/consts";
const payloadStore = useGptImagePayloadStore();

const {
  prompt,
  aspectRatio,
  resolution,
  quality,
  enableSafetyChecker,
  enableSyncMode,
  enableBase64Output,
} = storeToRefs(payloadStore);

const getIconBoxStyle = (ratio: string | undefined): Record<string, string> => {
  // 1. Fallback mặc định cho trường hợp Auto (undefined) hoặc Square (1:1)
  const defaultStyle = { width: "16px", height: "16px" };
  if (!ratio) return defaultStyle;

  // 2. Phân tách chuỗi và ép kiểu an toàn
  const parts = ratio.split(":");
  if (parts.length !== 2) return defaultStyle;

  const w = Number(parts[0]);
  const h = Number(parts[1]);

  // 3. Kiểm tra nếu giá trị không phải là số hợp lệ hoặc bằng 0 (để tránh chia cho 0)
  if (isNaN(w) || isNaN(h) || w === 0 || h === 0) return defaultStyle;

  if (w === h) return defaultStyle;

  // 4. Tính toán tỷ lệ dựa trên kích thước tối đa (18px) để icon luôn rõ nét
  const MAX_SIZE = 18;
  if (w > h) {
    // Landscape: Rộng tối đa 18px, cao co lại theo tỷ lệ
    return {
      width: `${MAX_SIZE}px`,
      height: `${(h / w) * MAX_SIZE}px`,
    };
  } else {
    // Portrait: Cao tối đa 18px, rộng co lại theo tỷ lệ
    return {
      height: `${MAX_SIZE}px`,
      width: `${(w / h) * MAX_SIZE}px`,
    };
  }
};
</script>

<template>
  <PartsFormBasePromptTextArea
    v-model="prompt"
    label="Prompt"
    variant="blue"
    placeholder="Describe your vision..."
  />

  <PartsDropdownListWithIcon
    v-model="aspectRatio"
    :options="ASPECT_RATIOS"
    label="Aspect Ratio"
  >
    <template #icon="{ option }">
      <div
        class="border-[1.5px] border-neutral-400 rounded-[1px] shrink-0"
        :class="[!option?.value ? 'border-dashed' : 'border-solid']"
        :style="getIconBoxStyle(option?.value)"
      />
    </template>
    <template #item-icon="{ option }">
      <div
        class="border-[1.5px] rounded-[1px] shrink-0 transition-colors"
        :class="[
          !option.value ? 'border-dashed' : 'border-solid',
          aspectRatio === option.value ? 'border-white' : 'border-neutral-600',
        ]"
        :style="getIconBoxStyle(option.value)"
      />
    </template>
  </PartsDropdownListWithIcon>

  <!-- Resolution -->
  <PartsDropdownListWithIcon
    v-model="resolution"
    :options="RESOLUTION"
    label="Resolution"
  />

  <!-- Quality -->
  <PartsDropdownListWithIcon
    v-model="quality"
    :options="QUALITY"
    label="Quality"
  />

  <div
    class="grid grid-cols-1 gap-2 p-4 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-gray-200 dark:border-white/5"
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
