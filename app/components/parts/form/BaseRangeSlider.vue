// app/components/base/form/BaseRangeSlider.vue
<script lang="ts" setup>
interface Props {
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 64,
  max: 4096,
  step: 64,
});

const modelValue = defineModel<number>({ required: true });
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <label
        class="text-[10px] font-black uppercase text-gray-500 tracking-widest"
      >
        {{ label }}
      </label>
      <input
        v-model.number="modelValue"
        type="number"
        class="w-16 bg-transparent text-right text-xs text-blue-500 dark:text-blue-400 font-bold outline-none"
        :step="step"
      />
    </div>
    <USlider
      v-model="modelValue"
      :min="min"
      :max="max"
      :step="step"
      color="info"
      class="w-full"
    />
  </div>
</template>
