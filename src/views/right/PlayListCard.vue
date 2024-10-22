<template>
  <div class="playlist-card">
    <div class="cover" :style="backgroundImg">

    </div>
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
import { ref } from 'vue';
import type { PlayList } from '@/types/global';

const props = defineProps<{
  playList: PlayList
}>();
const backgroundImg = ref({
  background: `url(${props.playList.cover})`
});
</script>

<style scoped lang="scss">
.playlist-card {

  .cover {
    background-size: cover;
    background-position: center;
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
