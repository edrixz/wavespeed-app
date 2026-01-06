<script setup lang="ts">
import {
  genderOptions,
  bodyTypeListItem,
  skinToneListItem,
  ethnicityListItem,
  skinDetailListItem,
  breastListItem,
  nippleDetailListItem,
  pubicHairListItem,
  genitalDetailListItem,
} from "~/consts/list-items/identity";
import type { SubjectData } from "~/types/entities";
import type { ListItem } from "~/types/list-item";
const props = defineProps<{ modelValue?: SubjectData }>();
const emit = defineEmits(["update:modelValue"]);

/**
 * HÀM CẬP NHẬT GENERIC (Dùng cho tất cả các trường chọn đơn)
 * @param field Tên trường trong SubjectData (gender, bodyType...)
 * @param valEn Giá trị tiếng Anh được chọn
 * @param optionsList Danh sách options tương ứng để tìm label_vi
 */
const updateField = (
  field: keyof SubjectData,
  valEn: string,
  optionsList: ListItem[]
) => {
  // 1. Tìm bản dịch tiếng Việt tương ứng từ danh sách options
  const found = optionsList.find((opt) => opt.value === valEn);
  const valVi = found?.label_vi || found?.label || valEn;

  // 2. Tạo bản sao mới của modelValue để tránh mutate trực tiếp props
  const newModelValue = {
    ...(props.modelValue || {}),
    [field]: {
      value: valEn,
      label_vi: valVi,
    },
  };

  emit("update:modelValue", newModelValue);
};

const handleAgeUpdate = (val: string) => {
  if (!val) {
    emit("update:modelValue", {
      ...props.modelValue,
      age: { value: "", label_vi: "" },
    });
    return;
  }

  emit("update:modelValue", {
    ...props.modelValue,
    age: {
      value: val, // Ví dụ: "20"
      label_vi: `${val} tuổi`, // Tự động tạo nhãn tiếng Việt sát nghĩa
    },
  });
};
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-6">
      <label class="lbl">Gender</label>
      <div class="flex bg-gray-800 border border-gray-600 rounded p-1 h-[34px]">
        <div
          v-for="opt in genderOptions"
          :key="opt.value"
          @click="updateField('gender', opt.value, genderOptions)"
          class="flex-1 flex items-center justify-center rounded cursor-pointer transition-all text-[10px] font-bold uppercase"
          :class="
            modelValue!.gender?.value === opt.value
              ? opt.value === 'Female'
                ? 'bg-pink-600 text-white'
                : 'bg-blue-600 text-white'
              : 'text-gray-500 hover:bg-gray-700'
          "
        >
          {{ opt.value }}
        </div>
      </div>
    </div>

    <div class="col-span-6">
      <label class="lbl">Age</label>
      <div class="relative">
        <input
          :value="modelValue?.age?.value"
          @input="handleAgeUpdate(($event.target as HTMLInputElement).value)"
          type="number"
          class="inp"
          placeholder="20"
        />
        <span
          class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 font-bold"
          >y.o</span
        >
      </div>
    </div>

    <!-- Ethnicity -->
    <div class="col-span-12">
      <label class="lbl">Ethnicity</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.ethnicity"
        type="subject"
        field="ethnicity"
        :options="ethnicityListItem"
        mode="single"
        active-class="active-blue"
      />
    </div>

    <div class="col-span-12">
      <label class="lbl">Body Type</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.bodyType"
        type="subject"
        field="bodyType"
        :options="bodyTypeListItem"
        mode="single"
        active-class="active-blue"
      />
    </div>

    <div class="col-span-12">
      <label class="lbl">Skin Tone</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.skinTone"
        type="subject"
        field="skinTone"
        :options="skinToneListItem"
        mode="single"
        active-class="active-blue"
      />
    </div>

    <!-- Skin Details -->
    <div class="col-span-12">
      <label class="lbl">Skin Details</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.skinDetails"
        type="subject"
        field="skinDetails"
        :options="skinDetailListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Breast -->
    <div class="col-span-12">
      <label class="lbl">Chest</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.breast"
        type="subject"
        field="breast"
        :options="breastListItem"
        mode="single"
        active-class="active-blue"
      />
    </div>

    <!-- Nipple -->
    <div class="col-span-12">
      <label class="lbl">Nipple</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.nipple"
        type="subject"
        field="nipple"
        :options="nippleDetailListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- pubicHair -->
    <div class="col-span-12">
      <label class="lbl">pubic Hair</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.pubicHair"
        type="subject"
        field="pubicHair"
        :options="pubicHairListItem"
        mode="single"
        active-class="active-blue"
      />
    </div>

    <!-- genitals -->
    <div class="col-span-12">
      <label class="lbl">Genitals</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.genitals"
        type="subject"
        field="genitals"
        :options="genitalDetailListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>
  </div>
</template>

<style scoped></style>
