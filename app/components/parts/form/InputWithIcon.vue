<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  icon?: string; // Tên icon từ thư viện (lucide)
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  placeholder: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Xử lý logic ẩn/hiện password nội bộ
const isPasswordVisible = ref(false);

// Computed để xác định type thực tế của input
const currentType = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "text" : "password";
  }
  return props.type;
});

// Xử lý input change
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="w-full">
    <div v-if="$slots.label" class="mb-2">
      <slot name="label" />
    </div>

    <div class="relative group">
      <Icon
        v-if="icon"
        :name="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"
        size="18"
      />

      <input
        :value="modelValue"
        :type="currentType"
        :placeholder="placeholder"
        :required="required"
        @input="onInput"
        class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
        :class="[
          icon ? 'pl-12' : 'pl-4', // Padding trái tùy thuộc có icon không
          type === 'password' ? 'pr-12' : 'pr-4', // Padding phải nếu là password
        ]"
      />

      <button
        v-if="type === 'password'"
        type="button"
        @click="isPasswordVisible = !isPasswordVisible"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
        tabindex="-1"
      >
        <Icon
          :name="isPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'"
          size="18"
        />
      </button>
    </div>
  </div>
</template>
