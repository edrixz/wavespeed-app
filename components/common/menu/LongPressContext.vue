<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  anchorX: number;
  anchorY: number;
  activeId: string | null;
}>();

const actions = [
  { id: "save", icon: "lucide:heart", label: "Save", color: "bg-red-500" },
  { id: "preset", icon: "lucide:zap", label: "Preset", color: "bg-blue-600" },
  {
    id: "cloud",
    icon: "lucide:upload-cloud",
    label: "Cloud",
    color: "bg-white",
  },
];

const getStartAngle = () => {
  if (typeof window === "undefined") return -150;
  if (props.anchorX < 100) return -90;
  if (props.anchorX > window.innerWidth - 100) return -210;
  return -150;
};

defineExpose({ getStartAngle });

// Tách biệt logic tính toán
const getButtonLayout = (index: number) => {
  if (!props.show)
    return {
      "--base-tx": "0px",
      "--base-ty": "0px",
      "--push-tx": "0px",
      "--push-ty": "0px",
      "--delay": "0s",
    };

  const angle = index * 60 + getStartAngle();
  const rad = (angle * Math.PI) / 180;

  // 1. Tọa độ Gốc (Cho Wrapper) - Cố định ở 80px
  const baseTx = Math.cos(rad) * 80;
  const baseTy = Math.sin(rad) * 80;

  // 2. Vector Đẩy (Cho Inner Button) - Đẩy thêm 20px theo cùng hướng
  const pushTx = Math.cos(rad) * 20;
  const pushTy = Math.sin(rad) * 20;

  return {
    "--base-tx": `${baseTx}px`,
    "--base-ty": `${baseTy}px`,
    "--push-tx": `${pushTx}px`,
    "--push-ty": `${pushTy}px`,
    "--delay": `${index * 0.05}s`,
  };
};
</script>

<template>
  <div>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="show"
          class="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md pointer-events-none"
        ></div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="show"
        class="fixed inset-0 z-[2000] pointer-events-none overflow-hidden"
      >
        <div
          class="absolute"
          :style="{ left: `${anchorX}px`, top: `${anchorY}px` }"
        >
          <div
            class="w-16 h-16 -ml-8 -mt-8 rounded-full border border-white/20 bg-white/5 animate-ping opacity-30"
          ></div>

          <div
            v-for="(action, index) in actions"
            :key="action.id"
            class="button-wrapper absolute w-14 h-14 -ml-7 -mt-7 flex items-center justify-center"
            :style="getButtonLayout(index)"
          >
            <div
              class="inner-button w-full h-full rounded-full flex items-center justify-center shadow-2xl"
              :class="[
                action.color,
                activeId === action.id ? 'is-active' : 'opacity-90',
              ]"
            >
              <Icon
                :name="action.icon"
                :size="22"
                :class="
                  action.color === 'bg-white' ? 'text-black' : 'text-white'
                "
              />

              <Transition name="pop">
                <div
                  v-if="activeId === action.id"
                  class="absolute -top-12 bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl whitespace-nowrap"
                >
                  {{ action.label }}
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 1. LỚP VỎ: Chỉ xử lý việc bay từ tâm ra vị trí gốc (80px) */
.button-wrapper {
  animation: entrance-burst 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    var(--delay) forwards;
  will-change: transform;
}

@keyframes entrance-burst {
  from {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(var(--base-tx), var(--base-ty)) scale(1);
    opacity: 1;
  }
}

/* 2. LỚP LÕI: Xử lý hiệu ứng nảy khi tương tác */
.inner-button {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease;
  transform: translate(0, 0) scale(1); /* Mặc định */
  will-change: transform;
}

/* Khi Active: Đẩy thêm vector push và phóng to */
.is-active {
  z-index: 2100;
  /* Đây là mấu chốt: Di chuyển thêm một đoạn push-tx/ty từ vị trí gốc */
  transform: translate(var(--push-tx), var(--push-ty)) scale(1.2);

  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4), 0 15px 35px rgba(0, 0, 0, 0.6);
  border: 2px solid white;
}

/* Transition phụ */
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
}
.pop-enter-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.5);
}
</style>
