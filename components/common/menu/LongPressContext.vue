<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  anchorX: number;
  anchorY: number;
  activeId: string | null;
}>();

const emit = defineEmits(["update:activeId"]);

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

const getButtonStyle = (index: number) => {
  const angle = index * 60 + getStartAngle();
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * 110;
  const ty = Math.sin(rad) * 110;

  return {
    "--tx": `${tx}px`,
    "--ty": `${ty}px`,
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
            v-for="(action, index) in actions"
            :key="action.id"
            class="action-button absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center shadow-2xl"
            :class="[
              action.color,
              activeId === action.id ? 'active-btn z-[2100]' : 'opacity-90',
            ]"
            :style="getButtonStyle(index)"
          >
            <Icon
              :name="action.icon"
              :size="22"
              :class="action.color === 'bg-white' ? 'text-black' : 'text-white'"
            />

            <Transition name="pop">
              <div
                v-if="activeId === action.id"
                class="absolute -top-12 bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl"
              >
                {{ action.label }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Hiệu ứng nổ từ tâm quan trọng nhất */
.action-button {
  animation: burst 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) var(--delay)
    forwards;
  will-change: transform, opacity;
}

@keyframes burst {
  from {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(var(--tx), var(--ty)) scale(1);
    opacity: 1;
  }
}

.active-btn {
  transform: translate(var(--tx), var(--ty)) scale(1.4) !important;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), 0 10px 20px rgba(0, 0, 0, 0.5);
  border: 4px solid white;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-enter-active {
  transition: opacity 0.4s ease;
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
