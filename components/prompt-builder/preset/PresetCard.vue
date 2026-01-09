<script setup lang="ts">
import { ref } from "vue";
import type { PromptPreset } from "~/types";
import { usePresetStore } from "~/stores/prompt/preset-store";
import { useAiGeneratedPromptStore } from "~/stores/prompt/ai-generated-prompt-store";
import { usePromptBuilderStore } from "~/stores/prompt/prompt-builder-store";

const props = defineProps<{ preset: PromptPreset }>();
const presetStore = usePresetStore();
const aiStore = useAiGeneratedPromptStore();
const promptBuilderStore = usePromptBuilderStore();

const { getOptimizedUrl } = useImageProxy();
const toast = useToast();

const isExpanded = ref(false);
const isClosing = ref(false); // Trạng thái chờ nội dung đóng xong mới thu nhỏ ảnh
const isTransitioning = ref(false); // Chặn hover khi đang bay
const isConfirmingDelete = ref(false);

/**
 * Logic xóa Preset từ màn hình Expanded
 */
const handleDelete = async () => {
  if (!isConfirmingDelete.value) {
    isConfirmingDelete.value = true;
    setTimeout(() => {
      isConfirmingDelete.value = false;
    }, 3000);
    return;
  }

  const result = await presetStore.deletePreset(props.preset.id);
  if (result.success) {
    isExpanded.value = false;
    presetStore.isDialogOpen = false;
    toast.success("Đã xóa mẫu preset thành công!"); // Gọi toast tại đây
  } else {
    toast.error("Lỗi: Không thể xóa dữ liệu.");
  }
};

const getGroupLabel = (key: string) => {
  const map: any = {
    subject: "Nhân vật",
    face: "Gương mặt",
    hair: "Tóc",
    outfit: "Trang phục",
    pose: "Tư thế",
    environment: "Bối cảnh",
    tech: "Kỹ thuật",
  };
  return map[key] || key;
};

// Hàm mở thẻ
const openCard = async () => {
  if (!document.startViewTransition) {
    isExpanded.value = true;
    return;
  }

  isTransitioning.value = true;
  const transition = document.startViewTransition(() => {
    isExpanded.value = true;
  });

  await transition.finished;
  isTransitioning.value = false;
};

// Hàm đóng thẻ: Theo thứ tự Nội dung -> Title -> Ảnh
const closeCard = async () => {
  if (!document.startViewTransition) {
    isExpanded.value = false;
    return;
  }

  // Bước 1: Kích hoạt hiệu ứng ẩn nội dung và title
  isClosing.value = true;

  // Bước 2: Chờ hiệu ứng ẩn hoàn tất (khoảng 400ms) sau đó mới thu nhỏ ảnh
  setTimeout(() => {
    isTransitioning.value = true;
    document.startViewTransition(() => {
      isExpanded.value = false;
      isClosing.value = false;
    });

    setTimeout(() => {
      isTransitioning.value = false;
    }, 500);
  }, 400);
};

const handleApply = async (e: Event) => {
  e.stopPropagation();
  const subjectId = promptBuilderStore.activeSubjectId;

  if (subjectId) {
    // 1. Lưu dữ liệu thô vào AI Store (để gen prompt)
    await aiStore.setAiGeneratedData(subjectId, props.preset.data);

    // 2. Cập nhật giao diện (để sáng các Tag)
    const presetData = props.preset.data as Record<string, Record<string, any>>;

    Object.entries(presetData).forEach(([groupKey, fields]) => {
      Object.entries(fields).forEach(([fieldKey, value]) => {
        if (value && value.value !== "") {
          // Gọi action đã sửa ở trên
          promptBuilderStore.updateSelection(
            subjectId,
            groupKey,
            fieldKey,
            value
          );
        }
      });
    });

    await closeCard();
    const toast = useToast();
    toast.success("Đã áp dụng công thức");
  }
};

// 1. URL cho ảnh nhỏ ở Gallery (300-400px)
const lowResThumbnail = computed(() => {
  return getOptimizedUrl(props.preset.thumbnail, { w: 400, q: 80 });
});

// 2. URL cho ảnh lớn khi phóng to (1200px, nét hơn)
const highResThumbnail = computed(() => {
  return getOptimizedUrl(props.preset.thumbnail, { w: 1200, q: 90 });
});
</script>

<template>
  <div class="preset-card-root">
    <div
      @click="!isExpanded && openCard()"
      :class="[
        'preset-card overflow-hidden select-none min-h-36',
        isExpanded
          ? 'fixed inset-0 z-[100] flex flex-col lg:flex-row bg-[#0a0a0a] cursor-default'
          : 'relative aspect-[3/4] rounded-2xl border border-white/5 bg-[#111] cursor-pointer group',
      ]"
    >
      <div
        :class="[
          'relative shrink-0 overflow-hidden bg-black transition-all duration-500',
          isExpanded ? 'w-full lg:w-2/5 h-[30vh] lg:h-full' : 'w-full h-full',
        ]"
      >
        <NuxtImg
          :src="isExpanded ? highResThumbnail : lowResThumbnail"
          :alt="preset.title"
          format="webp"
          loading="lazy"
          placeholder
          class="w-full h-full object-cover"
          :class="[
            !isExpanded && !isTransitioning
              ? 'transition-transform duration-700 group-hover:scale-105'
              : '',
          ]"
          :style="{ viewTransitionName: `preset-img-${preset.id}` }"
        />

        <div
          v-if="isExpanded"
          class="absolute inset-x-0 bottom-[-2px] h-[70%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10 pointer-events-none"
        ></div>

        <div
          v-if="isExpanded"
          class="absolute inset-x-0 bottom-0 p-8 z-20 entry-title-expanded"
        >
          <h2
            class="text-2xl lg:text-4xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl"
          >
            {{ preset.title }}
          </h2>
        </div>

        <button
          v-if="isExpanded"
          @click="handleDelete"
          class="absolute top-6 left-6 z-30 px-5 py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 group"
          :class="[
            isConfirmingDelete
              ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
              : 'bg-black/30 border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/50',
            isClosing ? 'exit-content' : 'entry-content',
          ]"
        >
          <svg
            v-if="!isConfirmingDelete"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span class="text-[9px] font-black uppercase tracking-widest">
            {{ isConfirmingDelete ? "Xác nhận xóa?" : "Xóa mẫu" }}
          </span>
        </button>

        <button
          v-if="isExpanded"
          @click="closeCard"
          class="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          ✕
        </button>

        <div
          v-if="!isExpanded"
          class="absolute top-3 flex right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all z-20"
        >
          <span
            class="text-[8px] font-black text-white italic tracking-[0.15em]"
            >PRESET</span
          >
        </div>
      </div>

      <div
        v-if="isExpanded"
        class="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a] z-20"
      >
        <div
          :class="[
            'flex-1 overflow-y-auto p-8 custom-scrollbar pb-32',
            isClosing ? 'exit-content' : 'entry-content',
          ]"
        >
          <div class="space-y-8">
            <div
              v-for="(groupData, groupKey) in preset.data"
              :key="groupKey"
              class="space-y-4"
            >
              <h4
                class="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"
              >
                <span
                  class="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]"
                ></span>
                {{ getGroupLabel(groupKey) }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <template v-for="fieldValue in groupData">
                  <span
                    v-for="tag in fieldValue!.label_vi.split(',')"
                    :key="tag"
                    class="px-3 py-1.5 bg-white/[0.04] border border-white/5 rounded-lg text-[10px] text-gray-400 font-medium"
                  >
                    {{ tag.trim() }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div
          :class="[
            'p-8 border-t border-white/5 bg-[#0a0a0a] relative',
            isClosing ? 'exit-content' : 'entry-content',
          ]"
        >
          <button
            @click="handleApply"
            class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all"
          >
            Apply This Recipe
          </button>
        </div>
      </div>

      <div
        v-if="!isExpanded"
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4"
      >
        <h3 class="text-[10px] font-black uppercase tracking-widest text-white">
          {{ preset.title }}
        </h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Title mở rộng từ dưới ảnh lên */
.entry-title-expanded {
  animation: title-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.3s;
}

@keyframes title-rise {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Các Tags trồi lên sau Title */
.entry-content {
  animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.5s;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Logic đóng thẻ mượt mà */
.exit-content {
  animation: slide-out 0.4s ease-in both;
}

@keyframes slide-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(15px);
  }
}

/* Custom Scrollbar siêu mỏng cho Premium Feel */
.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}
</style>
