<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  anchorX: number;
  anchorY: number;
  activeId: string | null;
}>();

const actions = [
  {
    id: "save",
    icon: "lucide:heart",
    label: "Add to Favorites",
    color: "bg-red-500",
    text: "text-red-400",
  },
  {
    id: "preset",
    icon: "lucide:zap",
    label: "Save as Preset",
    color: "bg-blue-600",
    text: "text-blue-400",
  },
  {
    id: "cloud",
    icon: "lucide:upload-cloud",
    label: "Upload to Cloud",
    color: "bg-white",
    text: "text-white",
  },
];

const activeAction = computed(() =>
  actions.find((a) => a.id === props.activeId)
);

// Logic góc bung (Giữ nguyên)
const getStartAngle = () => {
  if (typeof window === "undefined") return -150;
  if (props.anchorX < 100) return -90;
  if (props.anchorX > window.innerWidth - 100) return -210;
  return -150;
};

defineExpose({ getStartAngle });

// Logic Layout nút (Giữ nguyên)
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
          class="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl pointer-events-none"
        ></div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <div v-if="show" class="fixed inset-0 z-[3000] pointer-events-none">
        <div
          class="absolute top-5 left-0 p-6 pt-12 flex flex-col items-start gap-2 max-w-[80%]"
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
            class="w-24 h-24 -ml-12 -mt-12 rounded-full border border-white/10 bg-white/5 animate-ping opacity-20"
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
/* Animation Nút (Giữ nguyên) */
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
  transform: translate(var(--push-tx), var(--push-ty)) scale(1.35);
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.7);
  border: 2px solid white;
}

/* Fade Blur Background */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SLIDE DOWN ANIMATION CHO LABEL (Hiệu ứng rơi từ trên xuống) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
} /* Bay từ trên xuống */
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
} /* Bay xuống dưới khi mất */
</style>
