<script setup lang="ts">
import {
  artStyleListItem,
  atmosphereListItem,
  cameraListItem,
  colorPaletteListItem,
  filmEffectListItem,
  lensSettingsListItem,
  lightColorListItem,
  lightingListItem,
  locationListItem,
  postProcessingListItem,
  shadowsListItem,
  viewpointListItem,
} from "~/consts/list-items/scene";
import type { Scene } from "~/types/entities";
const props = defineProps<{ modelValue?: Scene }>();
</script>

<template>
  <div class="space-y-5">
    <!-- Location -->
    <div>
      <h5 class="category-title border-indigo-600">Location</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.location"
        type="environment"
        field="location"
        :options="locationListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Lighting -->
    <div>
      <h5 class="category-title border-indigo-600">Lighting</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.lighting"
        type="environment"
        field="lighting"
        :options="lightingListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Light Color -->
    <div>
      <h5 class="category-title border-indigo-600">Light Color</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.lighting"
        type="environment"
        field="lightColor"
        :options="lightColorListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Shadows -->
    <div>
      <h5 class="category-title border-indigo-600">Shadows</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.shadows"
        type="environment"
        field="shadows"
        :options="shadowsListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Atmosphere -->
    <div>
      <h5 class="category-title border-indigo-600">Atmosphere</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.atmosphere"
        type="environment"
        field="atmosphere"
        :options="atmosphereListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Color Palette -->
    <div>
      <h5 class="category-title border-indigo-600">Color Palette</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.environment!.colorPalette"
        type="environment"
        field="colorPalette"
        :options="colorPaletteListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- TECH -->
    <!-- Camera -->
    <div>
      <h5 class="category-title border-indigo-600">Camera</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.camera"
        type="tech"
        field="camera"
        :options="cameraListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Lens Settings -->
    <div>
      <h5 class="category-title border-indigo-600">Lens Settings</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.lensSettings"
        type="tech"
        field="lensSettings"
        :options="lensSettingsListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- FilmEffect -->
    <div>
      <h5 class="category-title border-indigo-600">FilmEffect</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.filmEffect"
        type="tech"
        field="filmEffect"
        :options="filmEffectListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Art Style -->
    <div>
      <h5 class="category-title border-indigo-600">Art Style</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.artStyle"
        type="tech"
        field="artStyle"
        :options="artStyleListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Post Processing -->
    <div>
      <h5 class="category-title border-indigo-600">Post Processing</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.postProcessing"
        type="tech"
        field="postProcessing"
        :options="postProcessingListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>

    <!-- Viewpoint -->
    <div>
      <h5 class="category-title border-indigo-600">Viewpoint</h5>
      <PartsPromptBuilderTagSelector
        v-model="modelValue!.tech!.viewpoint"
        type="tech"
        field="viewpoint"
        :options="viewpointListItem"
        mode="multi"
        active-class="active-indigo"
      />
    </div>
  </div>
</template>

<style scoped></style>
