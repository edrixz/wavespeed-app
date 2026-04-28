<script setup lang="ts" generic="T">
import { onClickOutside } from "@vueuse/core";

type DropdownOption<V> = {
  label: string;
  value: V;
  icon?: string;
  description?: string;
};

const props = defineProps<{
  options: readonly DropdownOption<T>[];
  label?: string;
  placeholder?: string;
}>();

const model = defineModel<T>();

const isOpen = ref(false);

const target = ref<HTMLDivElement | null>(null);

onClickOutside(target, () => (isOpen.value = false));

const currentOption = computed(() => {
  return (
    props.options.find((opt) => opt.value === model.value) ?? props.options[0]
  );
});
</script>

<template>
  <div ref="target" class="relative w-full select-none font-sans">
    <label
      v-if="label"
      class="mb-2 block text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em]"
    >
      {{ label }}
    </label>
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-lg border border-white/10 bg-black px-4 py-2.5 transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-700"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <div
          class="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden"
        >
          <slot name="icon" :option="currentOption" />
        </div>
        <div class="flex items-baseline gap-2 overflow-hidden text-start">
          <span class="text-sm font-bold text-white truncate">{{
            currentOption?.label
          }}</span>
          <span
            v-if="currentOption?.description"
            class="text-[11px] text-neutral-500 truncate"
          >
            {{ currentOption.description }}
          </span>
        </div>
      </div>
      <svg
        class="h-4 w-4 text-neutral-600 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        v-if="isOpen"
        class="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-[#080808] p-1 shadow-2xl ring-1 ring-black"
      >
        <li v-for="option in options" :key="String(option.value)">
          <button
            type="button"
            class="group flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-white/5"
            :class="{ 'bg-white/5': model === option.value }"
            @click="
              model = option.value;
              isOpen = false;
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden"
              >
                <slot name="item-icon" :option="option">
                  <span
                    v-if="option.icon"
                    :class="option.icon"
                    class="text-lg text-neutral-400 group-hover:text-neutral-200"
                  />
                </slot>
              </div>
              <div class="flex items-baseline gap-2 overflow-hidden">
                <span
                  class="text-[13px] font-bold transition-colors"
                  :class="
                    model === option.value
                      ? 'text-white'
                      : 'text-neutral-400 group-hover:text-neutral-200'
                  "
                >
                  {{ option.label }}
                </span>
                <span
                  v-if="option.description"
                  class="text-[11px] text-neutral-600 truncate"
                  >{{ option.description }}</span
                >
              </div>
            </div>
            <svg
              v-if="model === option.value"
              class="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
