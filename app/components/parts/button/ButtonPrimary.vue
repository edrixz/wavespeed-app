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
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-2xl shadow-blue-500/20 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 disabled:opacity-100"
  >
    <Icon
      v-if="loading"
      name="lucide:loader-2"
      class="animate-spin"
      size="16"
    />

    <Icon v-else-if="icon" :name="icon" size="16" />

    <slot />
  </button>
</template>
