<template>
  <div class="playlist-group-wrapper" v-for="data in groupPlayList">
    <span class="playlist-group-title">{{data.groupTitle}}</span>
    <div class="flex-row playlist-info-wrapper">
      <PlayListCard class="playlist-card" v-for="playList in data.playList" :playList="playList"></PlayListCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import PlayListCard from '@/views/right/PlayListCard.vue';
import type { PlayList } from '@/types/global';

interface groupPlayListArray {
  groupTitle: string,
  playList: Array<PlayList>
}
const groupPlayList: Array<groupPlayListArray> = reactive([
  {
    groupTitle: '热门歌单',
    playList: [
      {
        cover: 'https://img.js.design/assets/smartFill/img314164da746310.jpg',
        title: '李志原声带',
        singers: ['李志'],
        musicCount: 10
      },
      {
        cover: 'https://img.js.design/assets/smartFill/img306164da746310.jpg',
        title: '李志、电声与管弦乐',
        singers: ['李志'],
        musicCount: 5
      },
      {
        cover: 'https://img.js.design/assets/smartFill/img308164da746310.jpeg',
        title: '2016跨年音乐会',
        singers: ['李志'],
        musicCount: 7
      },
      {
        cover: 'https://img.js.design/assets/smartFill/img329164da748e08.jpg',
        title: '2018相信未来不插电版',
        singers: ['李志'],
        musicCount: 9
      },
      {
        cover: 'https://img.js.design/assets/smartFill/img320164da746310.jpg',
        title: '1701',
        singers: ['李志'],
        musicCount: 3
      },
      {
        cover: 'https://img.js.design/assets/smartFill/img331164da748e08.jpg',
        title: '这个世界会好吗',
        singers: ['李志、许巍、陈奕迅'],
        musicCount: 20
      },
    ]
  }
]);
</script>

<style scoped lang="scss">
.playlist-group-wrapper {
  //margin-top: 1rem;
  margin-right: var(--base-margin);

  .playlist-group-title {
    font-size: 1.375rem;
    padding: var(--base-padding);
    margin: .75rem 0;
    display: inline-block;
    text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);
  }

  .playlist-info-wrapper {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;

    .playlist-card {
      flex: 0 1 20%;
      cursor: pointer;
      //margin-right: 3vw;
      //padding: 1rem 1rem 1rem 0;
      margin: var(--base-padding);
    }

    .playlist-card:nth-last-child(-n + 5) {
      align-self: flex-start;
    }
  }
}
</style>
