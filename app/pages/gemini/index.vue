<script setup lang="ts">
definePageMeta({
  layout: "default",
});

/**
 * List of available Gemini AI tools.
 * Using const object array to avoid enums as per project rules.
 */
const geminiTools = [
  {
    id: "image-analyzer",
    title: "Image Analyzer",
    description:
      "Phân tích và trích xuất thông tin chi tiết từ hình ảnh của bạn và trả về theo định dạng chuẩn.",
    icon: "lucide:scan-search",
    path: "/gemini/image-analyzer",
    iconColor: "text-blue-500",
  },
  {
    id: "magic-eraser",
    title: "Magic Eraser",
    description:
      "Chọn và xóa bỏ các chủ thể không mong muốn khỏi bức ảnh một cách mượt mà và tự nhiên.",
    icon: "lucide:eraser",
    path: "/gemini/magic-eraser",
    iconColor: "text-purple-500",
  },
  {
    id: "ai-retouch",
    title: "AI Retouch",
    description:
      "Nâng cấp chất lượng, thêm texture chi tiết và điều chỉnh ánh sáng chuyên nghiệp cho ảnh gốc.",
    icon: "lucide:paintbrush",
    path: "/gemini/ai-retouch",
    iconColor: "text-emerald-500",
  },
  {
    id: "json-converter",
    title: "JSON Prompt Converter",
    description:
      "Chuyển đổi dữ liệu JSON từ các mô hình AI thành đoạn prompt văn bản thuần túy với cấu trúc chuẩn.",
    icon: "lucide:file-json-2",
    path: "/gemini/json-converter",
    iconColor: "text-amber-500",
  },
] as const;
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-28 lg:pb-8">
    <div class="flex flex-col space-y-2">
      <h1
        class="text-2xl lg:text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight"
      >
        Gemini Tools
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Khám phá bộ công cụ xử lý ảnh thông minh được trợ lực bởi sức mạnh của
        Gemini AI.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="tool in geminiTools"
        :key="tool.id"
        :to="tool.path"
        class="group block outline-none"
      >
        <div
          class="bg-white dark:bg-[#0d0d0d] p-5 ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-primary/50 rounded-2xl flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div class="flex flex-col h-full space-y-5">
            <div
              class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            >
              <Icon
                :name="tool.icon"
                class="w-7 h-7"
                :class="tool.iconColor"
              />
            </div>

            <div class="flex-1">
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors"
              >
                {{ tool.title }}
              </h3>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
              >
                {{ tool.description }}
              </p>
            </div>

            <div
              class="pt-4 mt-auto border-t border-gray-100 dark:border-white/5 flex items-center justify-between"
            >
              <span class="text-sm font-semibold text-primary">Thử ngay</span>
              <Icon
                name="lucide:arrow-right"
                class="w-5 h-5 text-primary opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
