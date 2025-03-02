<template>
  <div class="playlist-card">
    <img class="cover" :src="playList.cover" alt="">
    <div class="playlist-detail">
      <span class="title">{{playList.title}}</span>
      <div>
        <span v-for="singer in playList.singers">{{singer}}</span>
        <span>·{{playList.musicCount}}首歌曲</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayList } from '@/types/global';

defineProps<{
  playList: PlayList
}>();
</script>

<style scoped lang="scss">
.playlist-card {

  .cover {
    width: 14.687rem;
    height: 14.687rem;
    border-radius: 10px;
  }

  .playlist-detail {
    padding: .5rem 0;
    .title {
      display: block;
    }
    div {
      span {
        color: grey;
        font-size: var(--info-font-size);
      }
    }
  }
}
</style>
