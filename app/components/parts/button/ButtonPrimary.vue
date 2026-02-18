<script setup lang="ts">
interface Props {
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: "button",
});
</script>

<template>
  <div class="w-full">
    <button
      :type="type"
      :disabled="disabled || loading"
      class="group relative w-full overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-[#A8C7FA] focus:ring-offset-2 focus:ring-offset-[#131314] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
    >
      <div
        v-if="!disabled"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="aspect-square min-w-[200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#3b82f6_20%,#ffffff_35%,#60a5fa_50%,#ffffff_65%,#3b82f6_80%,transparent_100%)]"
        />
      </div>

      <span
        class="relative flex h-full w-full items-center justify-center rounded-full bg-[#1E1F20] px-8 py-3 text-sm font-medium text-[#E3E3E3] backdrop-blur-3xl transition-colors duration-300 group-hover:bg-[#131314] group-hover:text-white"
      >
        <Icon
          v-if="loading"
          name="lucide:loader-2"
          class="mr-2 h-4 w-4 animate-spin text-[#A8C7FA]"
          size="16"
        />

        <div v-else class="flex items-center gap-2">
          <Icon
            v-if="icon"
            :name="icon"
            size="16"
            class="transition-transform duration-300 group-hover:scale-110 group-hover:text-[#A8C7FA]"
          />
          <slot />
        </div>
      </span>
    </button>
  </div>
</template>
