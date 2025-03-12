<template>
  <div class="right-wrapper custom-scroll">
    <RouterView/>
    <PlayListGroup v-if="componentState.currentRightComponent === ComponentType.DEFAULT"/>
    <SearchResult v-else-if="componentState.currentRightComponent === ComponentType.SEARCH_RESULT"/>
    <PlayListInfo v-else-if="componentState.currentRightComponent === ComponentType.PLAYLIST"/>
  </div>
</template>

<script setup lang="ts">
import PlayListGroup from './PlayListGroup.vue';
import SearchResult from './SearchResult.vue';
import { ComponentType } from '@/types/global';
import PlayListInfo from '@/views/middle/PlayListInfo.vue';
import { componentState } from '@/store/componentState';

</script>

<style scoped lang="scss">
.right-wrapper {
  width: 100%;
  //border-radius: .25rem;
  overflow: hidden;
  overflow-y: scroll;
  //padding: var(--base-padding);
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
