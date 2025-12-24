<script setup lang="ts">
import { ref } from "vue";
import { PRESET_CATEGORIES } from "~/consts";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

const presetStore = usePresetStore();
const aiStore = useAiGeneratedPromptStore();
const promptBuilderStore = usePromptBuilderStore();

const form = ref({
  title: "",
  category: "Fine Art",
  thumbnail: "", // Có thể lấy link ảnh AI vừa tạo
});

const handleSave = async () => {
  if (!form.value.title) return alert("Vui lòng nhập tên Preset");

  // Lấy dữ liệu AI hiện tại để làm "công thức"
  const currentData = promptBuilderStore.activeSubjectId
    ? aiStore.generatedData[promptBuilderStore.activeSubjectId]
    : null;

  if (!currentData) return alert("Không có dữ liệu để lưu!");

  const result = await presetStore.savePreset({
    ...form.value,
    data: currentData,
  });

  if (result?.success) {
    alert("Đã lưu Preset thành công!");
    emit("close");
  }
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div class="p-6 border-b border-white/5">
          <h3 class="text-sm font-black uppercase tracking-[0.2em] text-white">
            Lưu Công Thức Mới
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Tên Preset</label
            >
            <input
              v-model="form.title"
              type="text"
              placeholder="VD: Dark Cinematic Portrait"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Danh mục</label
            >
            <select
              v-model="form.category"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
            >
              <option
                v-for="cat in PRESET_CATEGORIES.filter(
                  (c) => c.value !== 'All'
                )"
                :key="cat.value"
                :value="cat.value"
              >
                {{ cat.label }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Link ảnh mẫu (URL)</label
            >
            <input
              v-model="form.thumbnail"
              type="text"
              placeholder="Dán link ảnh tại đây..."
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="p-6 bg-white/[0.02] flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            @click="handleSave"
            :disabled="presetStore.isSaving"
            class="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
          >
            {{ presetStore.isSaving ? "Đang lưu..." : "Xác nhận lưu" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
