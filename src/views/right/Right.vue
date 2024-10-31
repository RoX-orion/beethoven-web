<template>
  <div class="right-wrapper custom-scroll">
    <TagGroup/>
    <RouterView/>
    <SearchResult v-if="componentState.searchResult"/>
    <PlayListGroup v-else/>
  </div>
</template>

<script setup lang="ts">
import TagGroup from './TagGroup.vue';
import PlayListGroup from './PlayListGroup.vue';
import { useComponentStateStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import SearchResult from './SearchResult.vue';

const componentStateStore = useComponentStateStore();
const { componentState } = storeToRefs(componentStateStore);

</script>

<style scoped lang="scss">
.right-wrapper {
  width: 100%;
  border-radius: .25rem;
  overflow: hidden;
  overflow-y: scroll;
  padding: var(--base-padding);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
