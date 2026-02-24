<script lang="ts" setup>
interface Props {
  label: string;
  placeholder?: string;
  variant?: "blue" | "red";
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "blue",
  rows: 10,
  placeholder: "",
});

const modelValue = defineModel<string>({ required: true });

const themeClasses = computed(() => {
  if (props.variant === "red") {
    return {
      label: "text-[#F2B8B5]",
      textarea:
        "bg-[#3C1010]/30 border-[#8C1D18] text-[#F2B8B5] focus:border-[#F2B8B5] focus:ring-1 focus:ring-[#F2B8B5]/50 placeholder:text-[#F2B8B5]/30",
      dot: "bg-[#F2B8B5]",
    };
  }
  // Default: Google Blue 200
  return {
    label: "text-[#A8C7FA]",
    textarea:
      "bg-[#004A77]/20 border-[#004A77] text-[#D3E3FD] focus:border-[#A8C7FA] focus:ring-1 focus:ring-[#A8C7FA]/50 placeholder:text-[#A8C7FA]/30",
    dot: "bg-[#A8C7FA]",
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
