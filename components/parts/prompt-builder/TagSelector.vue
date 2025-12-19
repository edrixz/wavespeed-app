<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string | undefined; // Chuỗi giá trị từ Store (ví dụ: "Oval, Round")
  options: string[]; // Danh sách tag mặc định từ consts
  mode?: "single" | "multi";
  activeClass?: string; // Màu sắc khi active (active-purple, active-blue...)
}

const props = withDefaults(defineProps<Props>(), {
  mode: "multi",
  activeClass: "active-blue",
});

const emit = defineEmits(["update:modelValue"]);
const { updateAttr, isActive } = usePromptBuilder();

/** * Wrapper cho hàm isActive để dùng cục bộ trong component này
 * vì dữ liệu chúng ta đang xử lý ở đây là một chuỗi modelValue đơn lẻ
 */
const checkActive = (tag: string): boolean => {
  if (!props.modelValue) return false;
  const tags = props.modelValue.split(",").map((s) => s.trim());
  return tags.includes(tag);
};

/**
 * displayTags: Xử lý gộp và sắp xếp
 * - Đưa các tag đang active lên đầu.
 * - Tự động thêm các tag mới từ Magic Fill vào danh sách.
 */
const displayTags = computed(() => {
  const currentTags = props.modelValue
    ? props.modelValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Tìm các tag "lạ" (do AI gợi ý) không có trong list mặc định
  const aiSuggestedTags = currentTags.filter(
    (tag) => !props.options.includes(tag)
  );

  // Gộp lại: Tag từ AI + Tag mặc định (Set để loại bỏ trùng lặp nếu có)
  const combined = Array.from(new Set([...aiSuggestedTags, ...props.options]));

  // Sắp xếp: Thằng nào active (checkActive = true) thì đứng trước
  return combined.sort((a, b) => {
    const aActive = checkActive(a) ? 1 : 0;
    const bActive = checkActive(b) ? 1 : 0;
    return bActive - aActive; // Sắp giảm dần (1 lên trước 0)
  });
});

const handleToggle = (tag: string) => {
  // Giả lập object để dùng helper updateAttr của usePromptLogic
  const tempObj = { value: props.modelValue || "" };
  updateAttr(tempObj, "value", tag, props.mode);
  emit("update:modelValue", tempObj.value);
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <TransitionGroup name="tag-list">
      <button
        v-for="tag in displayTags"
        :key="tag"
        @click="handleToggle(tag)"
        class="btn-chip"
        :class="checkActive(tag) ? activeClass : 'inactive'"
      >
        <span
          v-if="!options.includes(tag) && checkActive(tag)"
          class="text-[10px] animate-pulse"
          title="AI Suggested"
        >
          ✨
        </span>

        {{ tag }}
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Hiệu ứng chuyển động khi danh sách sắp xếp lại */
.tag-list-move {
  transition: transform 0.5s ease;
}

.tag-list-enter-active,
.tag-list-leave-active {
  transition: all 0.3s ease;
}

.tag-list-enter-from,
.tag-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
