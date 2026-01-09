<script setup lang="ts">
import {
  poseActionListItem,
  poseInteractionListItem,
  postureListItem,
  headAngleListItem,
  handsListItem,
  framingListItem,
  perspectiveListItem,
  aspectRatioListItem,
} from "~/consts/list-items/pose";
import type { PoseData } from "~/types/entities";

const props = defineProps<{ modelValue?: PoseData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Action -->
    <div>
      <h5 class="category-title border-purple-600">Action</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.action"
        type="pose"
        field="action"
        :options="poseActionListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Interaction -->
    <div>
      <h5 class="category-title border-purple-600">Interaction</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.interaction"
        type="pose"
        field="interaction"
        :options="poseInteractionListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Posture -->
    <div>
      <h5 class="category-title border-purple-600">Posture</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.posture"
        type="pose"
        field="posture"
        :options="postureListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- HeadAngle -->
    <div>
      <h5 class="category-title border-purple-600">HeadAngle</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.headAngle"
        type="pose"
        field="headAngle"
        :options="headAngleListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Hands -->
    <div>
      <h5 class="category-title border-purple-600">Hands</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.hands"
        type="pose"
        field="hands"
        :options="handsListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Framing -->
    <div>
      <h5 class="category-title border-purple-600">Framing</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.framing"
        type="pose"
        field="framing"
        :options="framingListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Perspective -->
    <div>
      <h5 class="category-title border-purple-600">Perspective</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.perspective"
        type="pose"
        field="perspective"
        :options="perspectiveListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Aspect Ratio -->
    <div>
      <h5 class="category-title border-purple-600">Aspect Ratio</h5>
      <PromptBuilderTagSelector
        v-model="modelValue!.aspectRatio"
        type="pose"
        field="aspectRatio"
        :options="aspectRatioListItem"
        mode="multi"
        active-class="active-blue"
      />
    </div>
  </div>
</template>

<style scoped></style>
