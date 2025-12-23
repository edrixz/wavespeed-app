<script setup lang="ts">
import { computed } from "vue";
import type { AnalyzedData, ListItem } from "~/types";

interface Props {
  modelValue: string | undefined; // Dữ liệu từ promptStore
  type: keyof AnalyzedData; // 'face', 'hair'...
  field: string; // 'shape', 'color'...
  options: ListItem[];
  mode?: "single" | "multi"; // Chế độ chọn
  activeClass?: string;
  aiActiveClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "multi",
  activeClass: "active-blue",
  aiActiveClass: "ai-active",
});

const emit = defineEmits(["update:modelValue"]);

const {
  isLoading,
  aiSuggestions,
  sortedOptions,
  isSelected,
  handleToggle,
  handleReset,
  isAiRecommended,
} = useTagSelector(
  computed(() => props.modelValue!),
  computed(() => props.mode),
  computed(() => props.options),
  computed(() => props.type),
  computed(() => props.field),
  (val) => emit("update:modelValue", val)
);

const onToggle = (val: string, isAiSuggestion: boolean = false) => {
  // Gọi handleToggle với cờ isAiSuggestion
  const newValue = handleToggle(val, isAiSuggestion);
  emit("update:modelValue", newValue);
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2 relative">
      <TransitionGroup name="tag-move">
        <button
          v-for="opt in sortedOptions"
          :key="opt.value"
          @click="onToggle(opt.value)"
          class="btn-chip transition-all duration-300"
          :class="[
            isSelected(opt.value)
              ? isAiRecommended(opt.value)
                ? aiActiveClass
                : activeClass
              : 'inactive',
          ]"
        >
          <span v-if="isAiRecommended(opt.value)" class="ai-star">✨</span>
          <span
            v-if="opt.color"
            class="w-3.5 h-3.5 rounded-full shadow-inner border border-white/10"
            :style="{ backgroundColor: opt.color }"
          ></span>
          {{ opt.label }}
        </button>
      </TransitionGroup>
    </div>

    <div
      v-if="isLoading || aiSuggestions.length > 0"
      class="pt-3 border-t border-gray-800/50 animate-container"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span
            :class="
              isLoading
                ? 'text-gray-500 text-[9px] font-black uppercase tracking-widest'
                : 'ai-label-neon'
            "
          >
            {{
              isLoading
                ? "AI is analyzing " + field + "..."
                : "✨ AI Magic Insights"
            }}
          </span>
          <div
            :class="[
              'h-px w-8 transition-colors',
              isLoading ? 'bg-gray-700' : 'bg-green-500/30',
            ]"
          ></div>
        </div>

        <button
          v-if="!isLoading && aiSuggestions.length > 0"
          @click="handleReset"
          class="reset-ai-btn"
          title="Clear AI Suggestions for this section"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          RESET
        </button>
      </div>

      <div class="mt-2">
        <div v-if="isLoading" class="flex flex-wrap gap-2">
          <div
            v-for="i in 3"
            :key="i"
            class="skeleton-item shimmer-loading"
            :style="{
              width: `${Math.floor(Math.random() * (100 - 50 + 1) + 50)}px`,
            }"
          ></div>
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <TransitionGroup name="staggered-fade">
            <button
              v-for="(val, index) in aiSuggestions"
              :key="val"
              @click="onToggle(val, true)"
              class="btn-chip ai-magic-chip"
              :class="isSelected(val) ? aiActiveClass : 'ai-inactive'"
              :style="{ '--delay': `${index * 0.05}s` }"
            >
              <span v-if="!isSelected(val)" class="ai-star">✨</span>
              {{ val }}
            </button>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-move-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Đảm bảo layout không bị giật khi tag di chuyển */
.tag-move-item {
  display: inline-block;
}

/* --- HIỆU ỨNG MAGIC SHIMMER (GREEN TONE) --- */
.shimmer-loading {
  position: relative;
  overflow: hidden;
  background-color: rgba(31, 41, 55, 0.7); /* gray-800 mờ một chút */
  border: 1px dashed rgba(34, 197, 94, 0.2); /* Viền xanh rất mờ */
}

.shimmer-loading::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  /* Tông màu xanh Magic: mờ ở hai đầu và sáng xanh ở giữa */
  background: linear-gradient(
    90deg,
    rgba(34, 197, 94, 0) 0%,
    rgba(34, 197, 94, 0.05) 20%,
    rgba(34, 197, 94, 0.2) 60%,
    rgba(34, 197, 94, 0) 100%
  );
  animation: magic-shimmer 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes magic-shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-item {
  @apply h-7 rounded-md transition-all duration-500;
}

/* --- STYLE NÚT RESET --- */
.reset-ai-btn {
  @apply flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black tracking-tighter
         text-red-400/50 border border-red-500/20 hover:text-red-400 hover:border-red-500/50 
         hover:bg-red-500/10 transition-all active:scale-90 uppercase;
}

/* Hiệu ứng biến mất của khối AI khi Reset */
.animate-container {
  transition: all 0.4s ease-out;
}

/* 1. Nhãn AI: Tăng độ sáng và hiệu ứng Neon */
.ai-label-pulse {
  @apply text-[9px] font-black text-green-300 uppercase tracking-widest flex items-center gap-1;
  /* Hiệu ứng phát sáng mạnh hơn */
  text-shadow: 0 0 12px rgba(34, 197, 94, 0.8), 0 0 4px rgba(34, 197, 94, 0.4);
  animation: label-glow 2s infinite alternate;
}

@keyframes label-glow {
  from {
    opacity: 0.8;
    filter: brightness(1);
  }
  to {
    opacity: 1;
    filter: brightness(1.3);
    transform: translateX(3px);
  }
}

/* 2. Chip AI: Viền sáng hơn và đổ bóng Glow */
.ai-magic-chip {
  @apply border-dashed border-green-400/40 transition-all duration-300;
  background: linear-gradient(
    145deg,
    rgba(34, 197, 94, 0.1),
    rgba(0, 0, 0, 0.2)
  );
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.1);
}

.ai-magic-chip:hover {
  @apply border-green-400/80 bg-green-500/20;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
  transform: translateY(-2px);
}

:deep(.ai-active) {
  @apply bg-green-500/30 border-green-400 text-green-50 shadow-[0_0_15px_rgba(34,197,94,0.5)] ring-1 ring-green-400/50 !important;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.ai-label-neon {
  @apply text-[9px] font-black text-green-300 uppercase tracking-widest;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
}

.ai-inactive {
  /* Tăng độ hiển thị cho text AI khi chưa chọn */
  @apply text-green-300/90;
}

/* 3. Ngôi sao ✨: Tăng độ rực rỡ */
.ai-star {
  @apply text-[10px] mr-1 text-green-300;
  filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.6));
  animation: star-bounce 1.5s infinite ease-in-out;
}

@keyframes star-bounce {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.4) rotate(25deg);
    filter: brightness(1.5);
  }
}

/* 4. Animation Staggered khi xuất hiện */
.staggered-fade-enter-active {
  animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.4) translateY(15px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}
</style>
