<script setup lang="ts">
import { ref, computed } from "vue";
import { onClickOutside, useElementBounding } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    placement?: "bottom-start" | "bottom-end" | "bottom-center";
    closeOnClick?: boolean;
    contentClass?: string;
  }>(),
  {
    placement: "bottom-start",
    closeOnClick: false,
    contentClass: "",
  }
);

const isOpen = ref(false);
const triggerWrapperRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { top, bottom, left, right, width } = useElementBounding(triggerWrapperRef);

// Handle clicking outside including trigger and popover body
onClickOutside(contentRef, (event) => {
  // If click was inside trigger wrapper, don't close here to let toggle handle it
  if (triggerWrapperRef.value && triggerWrapperRef.value.contains(event.target as Node)) {
    return;
  }
  isOpen.value = false;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleContentClick = () => {
  if (props.closeOnClick) {
    isOpen.value = false;
  }
};

const popoverStyle = computed(() => {
  if (props.placement === 'bottom-end') {
    return {
      top: `${bottom.value + 6}px`,
      left: `${right.value}px`,
      transform: 'translateX(-100%)'
    };
  } else if (props.placement === 'bottom-center') {
    return {
      top: `${bottom.value + 6}px`,
      left: `${left.value + width.value / 2}px`,
      transform: 'translateX(-50%)'
    };
  } else {
    // bottom-start
    return {
      top: `${bottom.value + 6}px`,
      left: `${left.value}px`,
    };
  }
});
</script>

<template>
  <div class="inline-block text-left" ref="triggerWrapperRef">
    <div @click="toggle" class="cursor-pointer inline-block w-full">
      <slot name="trigger" :isOpen="isOpen" />
    </div>

    <Teleport to="body">
      <transition
        enter-active-class="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        enter-from-class="transform opacity-0 scale-95 translate-y-[-10px]"
        enter-to-class="transform opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="transform opacity-100 scale-100 translate-y-0"
        leave-to-class="transform opacity-0 scale-95 translate-y-[-5px]"
      >
        <div
          v-if="isOpen"
          ref="contentRef"
          @click="handleContentClick"
          :style="popoverStyle"
          :class="[
            'fixed z-9999 rounded-2xl bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-xl transition-shadow focus:outline-none overflow-hidden',
            contentClass
          ]"
        >
          <slot name="content" :close="() => isOpen = false" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>
