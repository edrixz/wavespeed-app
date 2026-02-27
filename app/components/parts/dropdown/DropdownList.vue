<script setup lang="ts">
import { computed, ref } from "vue";

interface Option {
  label: string;
  value: string;
}

const props = defineProps<{
  options: Option[];
}>();

const model = defineModel<string>({ required: true });

const isOpen = ref(false);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const select = (value: string) => {
  model.value = value;
  isOpen.value = false;
};

const selectedLabel = computed(() => {
  return props.options.find((o) => o.value === model.value)?.label ?? "";
});
</script>

<template>
  <div class="version-select">
    <div
      class="flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-all duration-200 bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-[#333] hover:border-black/20 hover:bg-neutral-50 dark:hover:border-[#555] dark:hover:bg-[#252525]"
      @click="toggleOpen"
    >
      <span class="font-medium text-neutral-900 dark:text-white">{{ selectedLabel }}</span>

      <svg
        class="w-4 h-4 text-gray-400 dark:text-[#aaa] transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute w-full mt-1.5 rounded-xl overflow-hidden z-10 bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-[#333] shadow-[0_10px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="px-3.5 py-2.5 cursor-pointer text-gray-600 dark:text-[#ccc] transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]"
          :class="{
            'bg-neutral-100 text-neutral-900 dark:bg-[#333] dark:text-white': option.value === model
          }"
          @click.stop="select(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.version-select {
  width: 220px;
  position: relative;
  font-family: Inter, sans-serif;
}



.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
