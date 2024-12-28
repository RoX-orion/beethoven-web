<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';

const route = useRoute();

watch(() => route?.params?.type, type => {
  switch (type) {
    case 'playlist':
      componentState.currentRightComponent = ComponentType.PLAYLIST;
      break;
    case 'music':
      componentState.currentRightComponent = ComponentType.SEARCH_RESULT;
      break;
    default:
      componentState.currentRightComponent = ComponentType.DEFAULT;
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
