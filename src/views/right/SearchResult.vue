<template>
  <div>
    <MusicItem
      v-for="music in musicList"
      :music="music"/>
  </div>
</template>

<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import eventBus from '@/util/eventBus';
import { onBeforeUnmount, reactive } from 'vue';
import type { MusicItemType } from '@/types/global'

let musicList:Array<MusicItemType> = reactive([]);

const getSearchMusicResult = (result: any) => {
  console.log(result);
  musicList = result;
}
eventBus.on('getSearchMusicResult', getSearchMusicResult);

onBeforeUnmount(() => {
  eventBus.off('getSearchMusicResult', getSearchMusicResult);
});
</script>

<style scoped lang="scss">

</style>
