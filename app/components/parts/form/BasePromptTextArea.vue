<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  label: string;
  placeholder?: string;
  variant?: "blue" | "red";
  rows?: number;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "blue",
  rows: 10,
  placeholder: "",
  readonly: false,
});

const modelValue = defineModel<string>({ required: true });

const themeClasses = computed(() => {
  if (props.variant === "red") {
    return {
      label: "text-red-700 dark:text-[#F2B8B5]",
      textarea:
        "bg-red-50/50 dark:bg-[#3C1010]/30 border-red-200 dark:border-[#8C1D18] text-red-900 dark:text-[#F2B8B5] focus:border-red-400 dark:focus:border-[#F2B8B5] focus:ring-1 focus:ring-red-400/50 dark:focus:ring-[#F2B8B5]/50 placeholder:text-red-300 dark:placeholder:text-[#F2B8B5]/30",
      dot: "bg-red-500 dark:bg-[#F2B8B5]",
    };
  }
  // Default: Google Blue 200 equivalent
  return {
    label: "text-blue-700 dark:text-[#A8C7FA]",
    textarea:
      "bg-blue-50/50 dark:bg-[#004A77]/20 border-blue-200 dark:border-[#004A77] text-blue-900 dark:text-[#D3E3FD] focus:border-blue-400 dark:focus:border-[#A8C7FA] focus:ring-1 focus:ring-blue-400/50 dark:focus:ring-[#A8C7FA]/50 placeholder:text-blue-300 dark:placeholder:text-[#A8C7FA]/30",
    dot: "bg-blue-500 dark:bg-[#A8C7FA]",
  };
});
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2 ml-1">
      <div class="w-1.5 h-1.5 rounded-full" :class="themeClasses.dot"></div>
      <span class="text-xs font-medium" :class="themeClasses.label">
        {{ label }}
      </span>
    </div>

    <div class="relative group">
      <textarea
        v-model="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :readonly="readonly"
        class="w-full rounded-xl p-4 text-sm font-mono leading-relaxed outline-none transition-all resize-none border no-scrollbar"
        :class="themeClasses.textarea"
      />
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
