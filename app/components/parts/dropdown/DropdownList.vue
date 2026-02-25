<script setup lang="ts">
import { computed, ref } from "vue";

interface Option {
  label: string;
  value: string;
}

const props = defineProps<{
  options: Option[];
}>();

// Vue 3.4+
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
    <div class="select-wrapper" @click="toggleOpen">
      <span class="selected">{{ selectedLabel }}</span>

      <svg
        class="arrow"
        :class="{ open: isOpen }"
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
      <ul v-if="isOpen" class="dropdown">
        <li
          v-for="option in options"
          :key="option.value"
          :class="{ active: option.value === model }"
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

.label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #888;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-wrapper:hover {
  border-color: #555;
  background: #252525;
}

.selected {
  color: #fff;
  font-weight: 500;
}

.arrow {
  width: 16px;
  height: 16px;
  color: #aaa;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  width: 100%;
  margin-top: 6px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.dropdown li {
  padding: 10px 14px;
  cursor: pointer;
  color: #ccc;
  transition: background 0.15s ease;
}

.dropdown li:hover {
  background: #2a2a2a;
}

.dropdown li.active {
  background: #333;
  color: #fff;
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
