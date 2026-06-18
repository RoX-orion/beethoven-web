<template>
  <div class="middle-wrapper custom-scroll">
    <RouterView/>
    <PlayListGroup v-if="componentState.currentMiddleComponent === ComponentType.DEFAULT"/>
    <SearchResult v-else-if="componentState.currentMiddleComponent === ComponentType.SEARCH_RESULT"/>
    <PlayListInfo v-else-if="componentState.currentMiddleComponent === ComponentType.PLAYLIST"/>
    <VideoPlayer v-else-if="componentState.currentMiddleComponent === ComponentType.VIDEO_PLAYER"/>
  </div>
</template>

<script setup lang="ts">
import PlayListGroup from './PlayListGroup.vue';
import SearchResult from './SearchResult.vue';
import { ComponentType } from '@/types/global';
import PlayListInfo from '@/views/middle/PlayListInfo.vue';
import { componentState } from '@/store/componentState';
import VideoPlayer from '@/views/player/VideoPlayer.vue';
</script>

<style scoped lang="scss">
.middle-wrapper {
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
  background: var(--surface-color);
  box-shadow: var(--surface-shadow);
  backdrop-filter: blur(1.25rem);
}
</style>
