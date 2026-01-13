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
    class="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
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
