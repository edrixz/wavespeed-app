<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  anchorX: number;
  anchorY: number;
  activeId: string | null;
  currentTab?: "session" | "favorites" | "presets";
}>();

// --- 1. CONFIG MENU ---
// Lưu ý: Thứ tự này phải KHỚP với mảng ID trong pages/gallery.vue

const sessionActions = [
  {
    id: "save",
    icon: "lucide:heart",
    label: "Favorite",
    color: "bg-red-500",
    text: "text-red-400",
  },
  {
    id: "preset",
    icon: "lucide:zap",
    label: "Save Preset",
    color: "bg-blue-600",
    text: "text-blue-400",
  },
  {
    id: "cloud",
    icon: "lucide:upload-cloud",
    label: "Upload Cloud",
    color: "bg-white",
    text: "text-white",
  },
];

const presetActions = [
  {
    id: "cloud",
    icon: "lucide:upload-cloud",
    label: "Upload Cloud",
    color: "bg-white",
    text: "text-white",
  },
  {
    id: "delete",
    icon: "lucide:trash-2",
    label: "Delete Preset",
    color: "bg-red-600",
    text: "text-red-500",
  },
];

// Computed chọn list nút dựa trên tab
const actions = computed(() => {
  if (props.currentTab === "presets") return presetActions;
  return sessionActions;
});

const activeAction = computed(() =>
  actions.value.find((a) => a.id === props.activeId)
);

// --- 2. LOGIC CĂN GIỮA (DYNAMIC CENTERING) ---
const SPREAD_ANGLE = 60; // Khoảng cách giữa các nút luôn là 60 độ

const getStartAngle = () => {
  if (typeof window === "undefined") return -150;

  // Thuật toán: Luôn căn giữa cụm nút vào góc -90 độ (12 giờ)
  // - 3 nút: Start = -150. (Nút giữa ở -90)
  // - 2 nút: Start = -120. (2 nút đối xứng qua trục -90: -120 và -60)
  const count = actions.value.length;
  const totalSpan = (count - 1) * SPREAD_ANGLE;
  const centeredStart = -90 - totalSpan / 2;

  // Xử lý né mép màn hình
  if (props.anchorX < 100) return -90; // Sát trái -> Bung sang phải
  if (props.anchorX > window.innerWidth - 100) return -90 - totalSpan; // Sát phải -> Bung sang trái

  return centeredStart;
};

defineExpose({ getStartAngle });

// --- 3. VISUAL LAYOUT ---
const getButtonLayout = (index: number) => {
  if (!props.show)
    return {
      "--base-tx": "0px",
      "--base-ty": "0px",
      "--push-tx": "0px",
      "--push-ty": "0px",
      "--delay": "0s",
    };

  const angle = index * SPREAD_ANGLE + getStartAngle();
  const rad = (angle * Math.PI) / 180;

  const baseTx = Math.cos(rad) * 80;
  const baseTy = Math.sin(rad) * 80;
  const pushTx = Math.cos(rad) * 25;
  const pushTy = Math.sin(rad) * 25;

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
          class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md pointer-events-none"
        ></div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <div v-if="show" class="fixed inset-0 z-[3000] pointer-events-none">
        <div
          class="absolute top-0 left-0 p-6 pt-12 flex flex-col items-start gap-2 max-w-[80%]"
        >
          <Transition name="slide-down" mode="out-in">
            <div
              v-if="activeAction"
              :key="activeAction.id"
              class="flex flex-col gap-1"
            >
              <span
                class="text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-1"
                >Selected Action</span
              >
              <h2
                class="text-3xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl"
                :class="activeAction.text"
              >
                {{ activeAction.label }}
              </h2>
            </div>
            <div v-else class="flex flex-col gap-1 opacity-40">
              <span
                class="text-[10px] font-mono text-white uppercase tracking-widest pl-1"
                >Menu Active</span
              >
              <h2
                class="text-3xl font-black uppercase tracking-tighter text-white leading-none"
              >
                Select Option
              </h2>
            </div>
          </Transition>
        </div>
      </div>
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
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
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
.inner-button {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease;
  transform: translate(0, 0) scale(1);
  will-change: transform;
}
.is-active {
  z-index: 2100;
  transform: translate(var(--push-tx), var(--push-ty)) scale(1.3);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4), 0 20px 40px rgba(0, 0, 0, 0.6);
  border: 2px solid white;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
