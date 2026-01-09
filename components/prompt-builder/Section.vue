<script setup lang="ts">
const props = defineProps<{ title: string; color: string; isOpen: boolean }>();
defineEmits(["toggle"]);

const textColor = computed(() => `text-${props.color}-300`);

const { scrollToSection } = usePromptBuilder();
</script>

<template>
  <section
    :id="title"
    class="mb-4 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 scroll-mt-20"
  >
    <button
      @click="
        async () => {
          await $emit('toggle');
          await nextTick();
          await scrollToSection(props.title);
        }
      "
      class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
    >
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-bold uppercase tracking-wide"
          :class="textColor"
        >
          {{ title }}
        </span>
      </div>
      <PartsIconsArrow :is-open="isOpen" />
    </button>
    <Transition name="expand">
      <div v-show="isOpen" class="p-4 bg-gray-900/50 border-t border-gray-700">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 1000px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.scroll-mt-20 {
  /* Khi cuộn đến, nó sẽ tự cách mép trên 80px */
  scroll-margin-top: 5rem;
}
</style>
