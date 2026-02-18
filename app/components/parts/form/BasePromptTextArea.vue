// app/components/base/form/BasePromptArea.vue
<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  label: string;
  placeholder?: string;
  variant?: "blue" | "red";
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "blue",
  rows: 14,
  placeholder: "",
});

const modelValue = defineModel<string>({ required: true });

const themeClasses = computed(() => {
  if (props.variant === "red") {
    return {
      dot: "bg-red-500/50",
      label: "text-red-500/80",
      textarea:
        "bg-red-500/[0.03] border-red-500/20 text-red-200/60 focus:border-red-500/40 focus:bg-red-500/[0.06]",
    };
  }
  // Default Blue
  return {
    dot: "bg-blue-500",
    label: "text-blue-400/80",
    textarea:
      "bg-blue-600/[0.03] border-blue-600/20 text-blue-200/60 focus:border-blue-600/40 focus:bg-blue-600/[0.06]",
  };
});
</script>

<template>
  <div class="space-y-2 animate-fade-in">
    <div class="flex justify-between items-center ml-1">
      <div class="flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 rounded-full" :class="themeClasses.dot"></div>
        <span
          class="text-[9px] font-black uppercase tracking-widest"
          :class="themeClasses.label"
        >
          {{ label }}
        </span>
      </div>
    </div>

    <div class="relative group overflow-hidden rounded-xl">
      <textarea
        v-model="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        class="w-full rounded-xl p-4 text-[10px] font-mono italic leading-relaxed outline-none transition-all resize-none no-scrollbar"
        :class="themeClasses.textarea"
      />
    </div>
  </div>
</template>

<style scoped>
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
