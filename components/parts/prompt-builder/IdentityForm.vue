<script setup lang="ts">
import { bodyTypeListItem } from "~/consts";
import type { SubjectData } from "~/types";
const props = defineProps<{ modelValue?: SubjectData }>();
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-6">
      <label class="lbl">Gender</label>
      <div class="flex bg-gray-800 border border-gray-600 rounded p-1 h-[34px]">
        <div
          v-for="g in ['Female', 'Male']"
          :key="g"
          @click="modelValue!.gender = g"
          class="flex-1 flex items-center justify-center rounded cursor-pointer transition-all text-[10px] font-bold uppercase"
          :class="
            modelValue!.gender === g
              ? g === 'Female'
                ? 'bg-pink-600 text-white'
                : 'bg-blue-600 text-white'
              : 'text-gray-500 hover:bg-gray-700'
          "
        >
          {{ g }}
        </div>
      </div>
    </div>

    <div class="col-span-6">
      <label class="lbl">Age</label>
      <div class="relative">
        <input
          v-model="modelValue!.age"
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

    <div class="col-span-12">
      <label class="lbl">Body Type & Skin Tone</label>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.bodyType"
        :options="bodyTypeListItem.map((i) => i.value)"
        mode="single"
        active-class="active-blue"
      />
    </div>
  </div>
</template>

<style scoped></style>
