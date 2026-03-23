<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

export interface ActionItem {
  label: string;
  icon?: string;
  click: () => void;
}

const props = withDefaults(
  defineProps<{
    items: ActionItem[];
    placement?: "bottom-start" | "bottom-end";
  }>(),
  {
    placement: "bottom-start",
  }
);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleItemClick = (item: ActionItem) => {
  item.click();
  isOpen.value = false;
};
</script>

<template>
  <div class="relative w-full h-full" ref="dropdownRef">
    <div @click="toggle" class="cursor-pointer w-full h-full">
      <slot />
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-2 w-48 rounded-xl bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-[#333] shadow-lg focus:outline-none',
          placement === 'bottom-end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
        ]"
      >
        <div class="p-1">
          <button
            v-for="(item, idx) in items"
            :key="idx"
            @click="handleItemClick(item)"
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 dark:text-[#ccc] hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <UIcon
              v-if="item.icon"
              :name="item.icon"
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
            />
            <span class="font-medium whitespace-nowrap">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
