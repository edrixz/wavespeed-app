<script setup lang="ts">
import { ref, watch } from "vue";
import { usePromptBuilderStore } from "~/stores/prompt-builder-store";
import {
  bodyTypeListItem,
  faceDetailListItem,
  skinDetailListItem,
  hairDetailListItem,
  poseListItem,
  sceneData,
} from "~/consts";

const imageStore = useImageStore();
const { images } = storeToRefs(imageStore);

const promptStore = usePromptBuilderStore();
const { addSubject, removeSubject } = promptStore;
const { subjects, activeSubjectId, scene, generatedPrompt } =
  storeToRefs(promptStore);

const props = defineProps<{
  modelValue: string; // v-model liên kết với settings.prompt ở cha
}>();

const emit = defineEmits(["update:modelValue"]);

const showBasicInfo = ref(false);
const showSkinDetails = ref(false);
const showFaceDetails = ref(false);
const showHairDetails = ref(false);
const showPoseDetails = ref(false);
const showGlobalScene = ref(false);

const toggleRefImage = (subjectIdx: number, imgIdx: number) => {
  subjects.value[subjectIdx].refImageIdx =
    subjects.value[subjectIdx].refImageIdx === imgIdx ? -1 : imgIdx;
};

// LOGIC XỬ LÝ CHỌN NHIỀU (TOGGLE)
const toggleSkinDetail = (sub: any, value: string) => {
  // 1. Tách chuỗi hiện tại thành mảng (dựa vào dấu phẩy)
  let currentTags = sub.skin
    ? sub.skin
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  // 2. Kiểm tra xem value đã có chưa
  const index = currentTags.indexOf(value);

  if (index !== -1) {
    // Nếu có rồi -> Xóa đi (Bỏ chọn)
    currentTags.splice(index, 1);
  } else {
    // Nếu chưa có -> Thêm vào
    currentTags.push(value);
  }

  // 3. Gộp lại thành chuỗi và gán ngược lại
  sub.skin = currentTags.join(", ");
};

// Helper để kiểm tra active class
const hasSkinDetail = (sub: any, value: string) => {
  if (!sub.skin) return false;
  return sub.skin.includes(value);
};

// 3. HÀM XỬ LÝ CHỌN (HỖ TRỢ CẢ SINGLE VÀ MULTI)
const updateAttribute = (
  sub: any,
  key: string,
  value: string,
  mode: "single" | "multi"
) => {
  if (mode === "single") {
    // Nếu chọn cái đang chọn -> Bỏ chọn (Reset)
    sub[key] = sub[key] === value ? "" : value;
  } else {
    // Multi-select: Tách chuỗi, thêm/xóa, gộp lại
    let currentTags = sub[key]
      ? sub[key]
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    const index = currentTags.indexOf(value);
    if (index !== -1) currentTags.splice(index, 1);
    else currentTags.push(value);
    sub[key] = currentTags.join(", ");
  }
};

// Helper check active
const hasAttr = (sub: any, key: string, value: string) => {
  if (!sub[key]) return false;
  return sub[key].includes(value);
};

// 3. HÀM UPDATE SCENE (Riêng cho object scene)
const updateScene = (
  key: keyof typeof scene.value,
  value: string,
  mode: "single" | "multi"
) => {
  if (mode === "single") {
    // @ts-ignore
    scene[key] = scene[key] === value ? "" : value;
  } else {
    // @ts-ignore
    let currentTags = scene[key]
      ? scene.value[key]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const index = currentTags.indexOf(value);
    if (index !== -1) currentTags.splice(index, 1);
    else currentTags.push(value);
    // @ts-ignore
    scene[key] = currentTags.join(", ");
  }
};

// Helper check active cho Scene
const hasSceneAttr = (key: keyof typeof scene.value, value: string) => {
  const currentVal = scene.value[key];
  if (!currentVal) return false;
  return currentVal.includes(value);
};

watch(
  () => generatedPrompt,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="flex flex-col gap-6 bg-gray-800/40 p-4 rounded-xl border border-gray-700"
  >
    <div
      class="flex flex-col gap-2 justify-between items-center border-b border-gray-700 pb-3"
    >
      <div class="w-full flex items-center gap-2">
        <span class="text-lg">🛠️</span>
        <h3 class="text-sm font-bold text-gray-200 uppercase tracking-wider">
          Prompt Builder
        </h3>
      </div>

      <div class="flex w-full justify-between">
        <PartsImageAnalyzer />

        <!-- Copy Button -->
        <PartsButtonCopy />
      </div>
    </div>

    <div>
      <div
        class="flex items-center gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar"
      >
        <button
          v-for="sub in subjects"
          :key="sub.id"
          @click="activeSubjectId = sub.id"
          class="flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold border-b-2 transition-all whitespace-nowrap"
          :class="
            activeSubjectId === sub.id
              ? 'bg-gray-800 text-blue-400 border-blue-500 shadow-sm'
              : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50'
          "
        >
          {{ sub.role || `Subject ${sub.id + 1}` }}
          <span
            v-if="subjects.length > 1"
            @click.stop="removeSubject(sub.id)"
            class="ml-1 text-gray-600 hover:text-red-400 p-0.5 rounded-full hover:bg-gray-700"
            >✕</span
          >
        </button>

        <button
          @click="addSubject"
          class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 ml-1"
          title="Add Subject"
        >
          <span class="text-lg font-bold leading-none mb-0.5">+</span>
        </button>
      </div>

      <div
        class="bg-gray-900/80 rounded-b-lg rounded-r-lg p-4 border border-gray-600 relative min-h-[300px]"
      >
        <template v-for="(sub, idx) in subjects" :key="sub.id">
          <div v-show="activeSubjectId === sub.id" class="animate-fade-in">
            <!-- LINK FACE ID -->
            <div class="mb-5 bg-black/20 p-3 rounded border border-gray-700/50">
              <label
                class="text-[10px] text-gray-400 font-bold uppercase mb-2 flex justify-between"
              >
                <span>Link Face ID</span>
                <span
                  class="text-blue-400 text-[9px] normal-case"
                  v-if="sub.refImageIdx !== -1"
                  >Linked to Image #{{ sub.refImageIdx + 1 }}</span
                >
              </label>
              <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                <div
                  @click="sub.refImageIdx = -1"
                  class="h-12 w-12 rounded flex-shrink-0 flex items-center justify-center cursor-pointer border transition-all text-[10px] font-bold"
                  :class="
                    sub.refImageIdx === -1
                      ? 'bg-gray-700 border-gray-500 text-gray-300'
                      : 'bg-gray-800 border-gray-700 text-gray-600 hover:bg-gray-700'
                  "
                >
                  None
                </div>
                <div
                  v-for="(img, imgIdx) in images"
                  :key="imgIdx"
                  @click="toggleRefImage(idx, imgIdx)"
                  class="h-12 w-12 rounded flex-shrink-0 cursor-pointer border-2 relative overflow-hidden transition-all group"
                  :class="
                    sub.refImageIdx === imgIdx
                      ? 'border-blue-500 shadow-md scale-105 ring-2 ring-blue-500/20'
                      : 'border-gray-700 opacity-60 hover:opacity-100'
                  "
                >
                  <img :src="img.url" class="w-full h-full object-cover" />
                  <div
                    class="absolute bottom-0 right-0 bg-blue-600 text-white text-[8px] px-1 font-bold"
                  >
                    #{{ imgIdx + 1 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- BASIC -->
            <div
              class="mb-5 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                @click="showBasicInfo = !showBasicInfo"
                class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold text-blue-300 uppercase tracking-wide"
                    >Identity & Body</span
                  >
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="showBasicInfo ? 'rotate-180' : ''"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-show="showBasicInfo"
                class="p-4 bg-gray-900/50 border-t border-gray-700 animate-fade-in"
              >
                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-12">
                    <label class="lbl">Role Name</label>
                    <input
                      v-model="sub.role"
                      class="inp"
                      placeholder="The Woman"
                    />
                  </div>

                  <div class="col-span-6">
                    <label class="lbl">Gender</label>
                    <div
                      class="flex bg-gray-800 border border-gray-600 rounded p-1 h-[34px]"
                    >
                      <div
                        @click="sub.gender = 'Female'"
                        class="flex-1 flex items-center justify-center gap-1 rounded cursor-pointer transition-all text-[10px] font-bold uppercase select-none"
                        :class="
                          sub.gender === 'Female'
                            ? 'bg-pink-600 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3 h-3"
                        >
                          <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                          <path d="M12 15v7" />
                          <path d="M9 19h6" />
                        </svg>
                      </div>
                      <div
                        @click="sub.gender = 'Male'"
                        class="flex-1 flex items-center justify-center gap-1 rounded cursor-pointer transition-all text-[10px] font-bold uppercase select-none"
                        :class="
                          sub.gender === 'Male'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3 h-3"
                        >
                          <path d="M16 3h5v5" />
                          <path d="M21 3 13.5 10.5" />
                          <path d="M16.5 16.5a6 6 0 1 1-6-6 6 6 0 0 1 6 6Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="col-span-6">
                    <label class="lbl">Age</label>
                    <div class="relative">
                      <input
                        v-model="sub.age"
                        type="number"
                        class="inp pr-6 no-spinner text-left"
                        placeholder="20"
                      />
                      <span
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 font-bold"
                        >y.o</span
                      >
                    </div>
                  </div>

                  <div class="col-span-12">
                    <label class="lbl flex justify-between">
                      Body Type:
                      <span
                        class="text-[9px] text-blue-400 font-normal"
                        v-if="sub.bodyType"
                        >{{ sub.bodyType }}</span
                      >
                    </label>
                    <div
                      class="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 h-[60px]"
                    >
                      <div
                        v-for="(group, gIdx) in bodyTypeListItem"
                        :key="group.name"
                        class="flex items-center gap-1.5 flex-shrink-0"
                      >
                        <button
                          v-for="item in group.items"
                          :key="item.value"
                          @click="sub.bodyType = item.value"
                          class="px-2.5 h-[30px] rounded border flex items-center justify-center whitespace-nowrap text-[10px] font-medium transition-all"
                          :class="
                            sub.bodyType === item.value
                              ? 'bg-blue-600 border-blue-500 text-white shadow-sm ring-1 ring-blue-400'
                              : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                          "
                          :title="item.value"
                        >
                          {{ item.label }}
                        </button>
                        <div
                          v-if="gIdx < bodyTypeListItem.length - 1"
                          class="w-[1px] h-[20px] bg-gray-700 mx-1"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SKIN DETAILS -->
            <div
              class="mb-5 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                @click="showSkinDetails = !showSkinDetails"
                class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold text-pink-300 uppercase tracking-wide group-hover:text-pink-200"
                  >
                    Skin Details
                  </span>

                  <span
                    class="bg-pink-900/50 text-pink-300 text-[9px] px-1.5 py-0.5 rounded border border-pink-500/30"
                    v-if="sub.skin"
                  >
                    {{ sub.skin.split(",").length }} selected
                  </span>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="showSkinDetails ? 'rotate-180' : ''"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-show="showSkinDetails"
                class="bg-gray-900/50 border-t border-gray-700 p-4 space-y-5 animate-fade-in"
              >
                <div v-for="group in skinDetailListItem" :key="group.name">
                  <h5
                    class="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"
                  >
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    {{ group.name }}
                  </h5>

                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in group.items"
                      :key="item.value"
                      @click="toggleSkinDetail(sub, item.value)"
                      class="px-3 py-1.5 rounded border text-[10px] font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                      :class="
                        hasSkinDetail(sub, item.value)
                          ? 'bg-pink-600 border-pink-500 text-white shadow-md ring-1 ring-pink-400'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                      "
                      :title="item.value"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div class="pt-2 border-t border-gray-700/50">
                  <input
                    v-model="sub.skin"
                    class="inp text-gray-300 bg-black/20 border-gray-700 focus:border-pink-500 placeholder-gray-600"
                    placeholder="Type more details manually (e.g. scar on left cheek)..."
                  />
                </div>
              </div>
            </div>

            <!-- FACE DETAILS -->
            <div
              class="mb-5 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                @click="showFaceDetails = !showFaceDetails"
                class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold text-purple-300 uppercase tracking-wide group-hover:text-purple-200"
                  >
                    Face Features
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="showFaceDetails ? 'rotate-180' : ''"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-show="showFaceDetails"
                class="bg-gray-900/50 border-t border-gray-700 p-4 space-y-5 animate-fade-in"
              >
                <div>
                  <h5 class="category-title">Face Shape (Khuôn mặt)</h5>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in faceDetailListItem.shapes"
                      :key="item.value"
                      @click="
                        updateAttribute(sub, 'faceShape', item.value, 'single')
                      "
                      class="btn-chip"
                      :class="
                        sub.faceShape === item.value
                          ? 'active-purple'
                          : 'inactive'
                      "
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div>
                  <h5 class="category-title">Freckles (Tàn nhang)</h5>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in faceDetailListItem.freckles"
                      :key="item.value"
                      @click="
                        updateAttribute(sub, 'freckles', item.value, 'multi')
                      "
                      class="btn-chip"
                      :class="
                        hasAttr(sub, 'freckles', item.value)
                          ? 'active-purple'
                          : 'inactive'
                      "
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div>
                  <h5 class="category-title">Eyes & Iris (Mắt & Mống mắt)</h5>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in faceDetailListItem.eyes"
                      :key="item.value"
                      @click="updateAttribute(sub, 'eyes', item.value, 'multi')"
                      class="btn-chip"
                      :class="
                        hasAttr(sub, 'eyes', item.value)
                          ? 'active-blue'
                          : 'inactive'
                      "
                    >
                      {{ item.label }}
                    </button>
                    <div class="w-[1px] bg-gray-700 mx-1"></div>
                    <button
                      v-for="item in faceDetailListItem.iris"
                      :key="item.value"
                      @click="updateAttribute(sub, 'iris', item.value, 'multi')"
                      class="btn-chip"
                      :class="
                        hasAttr(sub, 'iris', item.value)
                          ? 'active-cyan'
                          : 'inactive'
                      "
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div>
                  <h5 class="category-title">Makeup (Trang điểm)</h5>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in faceDetailListItem.makeup"
                      :key="item.value"
                      @click="
                        updateAttribute(sub, 'makeup', item.value, 'multi')
                      "
                      class="btn-chip"
                      :class="
                        hasAttr(sub, 'makeup', item.value)
                          ? 'active-pink'
                          : 'inactive'
                      "
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hair Details -->
            <div
              class="mb-5 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                @click="showHairDetails = !showHairDetails"
                class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold text-amber-400 uppercase tracking-wide group-hover:text-amber-300"
                  >
                    Hair Style
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="showHairDetails ? 'rotate-180' : ''"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-show="showHairDetails"
                class="bg-gray-900/50 border-t border-gray-700 p-4 space-y-5 animate-fade-in"
              >
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <h5 class="category-title border-amber-600">
                      Length (Độ dài)
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="item in hairDetailListItem.lengths"
                        :key="item.value"
                        @click="
                          updateAttribute(
                            sub,
                            'hairLength',
                            item.value,
                            'single'
                          )
                        "
                        class="btn-chip"
                        :class="
                          sub.hairLength === item.value
                            ? 'active-amber'
                            : 'inactive'
                        "
                      >
                        {{ item.label }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 class="category-title border-amber-600">
                      Color (Màu sắc)
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="item in hairDetailListItem.colors"
                        :key="item.value"
                        @click="
                          updateAttribute(sub, 'hairColor', item.value, 'multi')
                        "
                        class="btn-chip"
                        :class="
                          hasAttr(sub, 'hairColor', item.value)
                            ? 'active-amber'
                            : 'inactive'
                        "
                      >
                        {{ item.label }}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 class="category-title border-amber-600 mb-3">
                    Style & Texture (Kiểu dáng)
                  </h5>

                  <div class="space-y-4">
                    <div
                      v-for="group in hairDetailListItem.styleGroups"
                      :key="group.name"
                      class="bg-black/20 p-3 rounded border border-gray-700/50"
                    >
                      <h6
                        class="text-[10px] font-bold text-gray-400 uppercase mb-2"
                      >
                        {{ group.name }}
                      </h6>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="style in group.items"
                          :key="style"
                          @click="
                            updateAttribute(sub, 'hairStyle', style, 'multi')
                          "
                          class="btn-chip"
                          :class="
                            hasAttr(sub, 'hairStyle', style)
                              ? 'active-amber'
                              : 'inactive'
                          "
                        >
                          {{ style }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-2 border-t border-gray-700/50">
                  <input
                    v-model="sub.hairStyle"
                    class="inp text-gray-300 bg-black/20 border-gray-700 focus:border-amber-500 placeholder-gray-600"
                    placeholder="Type specific hair style manually..."
                  />
                </div>
              </div>
            </div>

            <!-- Pose -->
            <div
              class="mb-5 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
            >
              <button
                @click="showPoseDetails = !showPoseDetails"
                class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold text-emerald-400 uppercase tracking-wide group-hover:text-emerald-300"
                  >
                    Pose & Action
                  </span>
                  <span
                    class="text-[9px] text-gray-500 font-normal normal-case truncate max-w-[200px]"
                    v-if="!showPoseDetails && sub.pose"
                  >
                    {{ sub.pose }}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="showPoseDetails ? 'rotate-180' : ''"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div
                v-show="showPoseDetails"
                class="bg-gray-900/50 border-t border-gray-700 p-4 space-y-5"
              >
                <div v-for="group in poseListItem" :key="group.name">
                  <h5 class="category-title border-emerald-600 mb-2">
                    {{ group.name }}
                  </h5>

                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in group.items"
                      :key="item.value"
                      @click="updateAttribute(sub, 'pose', item.value, 'multi')"
                      class="btn-chip"
                      :class="
                        hasAttr(sub, 'pose', item.value)
                          ? 'active-emerald'
                          : 'inactive'
                      "
                      :title="item.value"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>

                <div class="pt-2 border-t border-gray-700/50">
                  <input
                    v-model="sub.pose"
                    class="inp text-gray-300 bg-black/20 border-gray-700 focus:border-emerald-500 placeholder-gray-600"
                    placeholder="Type specific pose (e.g. Flying kick)..."
                  />
                </div>
              </div>
            </div>

            <div class="space-y-3 border-t border-gray-700 pt-3">
              <div>
                <label class="lbl">Clothes</label
                ><input v-model="sub.clothes" class="inp" />
              </div>
              <div>
                <label class="lbl">Expression</label
                ><input v-model="sub.expression" class="inp" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      class="mt-2 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
    >
      <button
        @click="showGlobalScene = !showGlobalScene"
        class="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 transition-colors group"
      >
        <div class="flex items-center gap-2">
          <span
            class="text-xs font-bold text-indigo-400 uppercase tracking-wide group-hover:text-indigo-300"
          >
            Global Scene & Tech
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="showGlobalScene ? 'rotate-180' : ''"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Scene -->
      <div
        v-show="showGlobalScene"
        class="bg-gray-900/50 border-t border-gray-700 p-4 space-y-5"
      >
        <div
          v-if="subjects.length > 1"
          class="animate-fade-in border-b border-gray-700 pb-4"
        >
          <label class="lbl text-green-300"
            >Interaction (Hành động chung)</label
          >
          <textarea
            v-model="scene.interaction"
            rows="3"
            class="inp-area border-green-500/30 focus:border-green-500"
            placeholder="e.g. Holding hands, Walking together, Looking at each other..."
          ></textarea>
        </div>

        <div>
          <h5 class="category-title border-indigo-600">
            Background (Bối cảnh)
          </h5>
          <div
            v-for="group in sceneData.backgrounds"
            :key="group.name"
            class="mb-3"
          >
            <h6 class="text-[9px] font-bold text-gray-500 uppercase mb-1 ml-1">
              {{ group.name }}
            </h6>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in group.items"
                :key="item.value"
                @click="updateScene('background', item.value, 'multi')"
                class="btn-chip"
                :class="
                  hasSceneAttr('background', item.value)
                    ? 'active-indigo'
                    : 'inactive'
                "
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          <input
            v-model="scene.background"
            class="inp bg-black/20"
            placeholder="Custom background..."
          />
        </div>

        <div>
          <h5 class="category-title border-indigo-600">Lighting (Ánh sáng)</h5>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in sceneData.lighting.flatMap((g) => g.items)"
              :key="item.value"
              @click="updateScene('lighting', item.value, 'multi')"
              class="btn-chip"
              :class="
                hasSceneAttr('lighting', item.value)
                  ? 'active-indigo'
                  : 'inactive'
              "
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 pt-2 border-t border-gray-700/50">
          <div>
            <h5 class="category-title border-indigo-600">
              Viewpoint (Góc máy)
            </h5>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in sceneData.viewpoints"
                :key="item.value"
                @click="updateScene('viewpoint', item.value, 'single')"
                class="btn-chip"
                :class="
                  scene.viewpoint === item.value ? 'active-indigo' : 'inactive'
                "
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div>
            <h5 class="category-title border-indigo-600">Camera & Tech</h5>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in sceneData.cameras"
                :key="item.value"
                @click="updateScene('camera', item.value, 'multi')"
                class="btn-chip"
                :class="
                  hasSceneAttr('camera', item.value)
                    ? 'active-indigo'
                    : 'inactive'
                "
              >
                {{ item.label }}
              </button>
            </div>
            <div class="mt-2">
              <label class="text-[9px] text-gray-500">Quality Keywords:</label>
              <input
                v-model="scene.quality"
                class="inp bg-black/20 text-gray-500 italic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-4 p-3 bg-black/40 rounded border border-gray-800 relative group"
    >
      <div class="flex justify-between items-center mb-2">
        <label
          class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
        >
          Generated Prompt Preview
        </label>

        <PartsButtonCopy />
      </div>

      <div
        class="max-h-32 overflow-y-auto custom-scrollbar p-2 bg-black/20 rounded border border-white/5"
      >
        <p
          class="text-xs text-gray-300 font-mono break-words leading-relaxed selection:bg-blue-500/30"
        >
          {{ generatedPrompt }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style chung cho nút bấm dạng thẻ (Chip) */
.btn-chip {
  @apply px-3 py-1.5 rounded border text-[10px] font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 text-left;
}
/* Trạng thái chưa chọn */
.inactive {
  @apply bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200;
}
/* Các màu Active khác nhau để phân biệt từng mục */
.active-purple {
  @apply bg-purple-600 border-purple-500 text-white shadow-md ring-1 ring-purple-400;
}
.active-blue {
  @apply bg-blue-600 border-blue-500 text-white shadow-md ring-1 ring-blue-400;
}
.active-cyan {
  @apply bg-cyan-600 border-cyan-500 text-white shadow-md ring-1 ring-cyan-400;
}
.active-pink {
  @apply bg-pink-600 border-pink-500 text-white shadow-md ring-1 ring-pink-400;
}
.active-orange {
  @apply bg-orange-600 border-orange-500 text-white shadow-md ring-1 ring-orange-400;
}
.active-amber {
  @apply bg-amber-600 border-amber-500 text-white shadow-md ring-1 ring-amber-400;
}
.active-emerald {
  @apply bg-emerald-600 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400;
}
.active-indigo {
  @apply bg-indigo-600 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400;
}
.category-title {
  @apply text-[10px] font-bold text-gray-500 uppercase mb-2 border-l-2 border-gray-600 pl-2;
}
.lbl {
  @apply block text-[10px] text-gray-500 mb-1 font-semibold uppercase tracking-wide;
}
.inp {
  @apply w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-blue-500 transition-all;
}
.inp-area {
  @apply w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-blue-500 resize-none transition-all;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar ẩn cho Tab mượt mà */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
</style>
