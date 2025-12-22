<script setup lang="ts">
import { poseListItem } from "~/consts";
import type { OutfitData, PoseData } from "~/types";
const props = defineProps<{ outfit?: OutfitData; pose?: PoseData }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Description -->
    <div>
      <h5 class="category-title border-purple-600">Description</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.description"
        type="outfit"
        field="description"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Materials -->
    <div>
      <h5 class="category-title border-purple-600">Materials</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.materials"
        type="outfit"
        field="materials"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Layering -->
    <div>
      <h5 class="category-title border-purple-600">Layering</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.layering"
        type="outfit"
        field="layering"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Fit -->
    <div>
      <h5 class="category-title border-purple-600">Fit</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.fit"
        type="outfit"
        field="fit"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Details -->
    <div>
      <h5 class="category-title border-purple-600">Details</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.details"
        type="outfit"
        field="details"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Accessories -->
    <div>
      <h5 class="category-title border-purple-600">Accessories</h5>
      <PartsPromptBuilderTagSelector
        v-model="outfit!.accessories"
        type="outfit"
        field="accessories"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- POSE -->
    <!-- Action -->
    <div>
      <h5 class="category-title border-purple-600">Action</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.action"
        type="pose"
        field="action"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Posture -->
    <div>
      <h5 class="category-title border-purple-600">Posture</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.posture"
        type="pose"
        field="posture"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- HeadAngle -->
    <div>
      <h5 class="category-title border-purple-600">HeadAngle</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.headAngle"
        type="pose"
        field="headAngle"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Hands -->
    <div>
      <h5 class="category-title border-purple-600">Hands</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.hands"
        type="pose"
        field="hands"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Framing -->
    <div>
      <h5 class="category-title border-purple-600">Framing</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.framing"
        type="pose"
        field="framing"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Perspective -->
    <div>
      <h5 class="category-title border-purple-600">Perspective</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.perspective"
        type="pose"
        field="perspective"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>

    <!-- Aspect Ratio -->
    <div>
      <h5 class="category-title border-purple-600">Aspect Ratio</h5>
      <PartsPromptBuilderTagSelector
        v-model="pose!.aspectRatio"
        type="pose"
        field="aspectRatio"
        :options="[]"
        mode="multi"
        active-class="active-blue"
      />
    </div>
  </div>
</template>

<style scoped></style>
