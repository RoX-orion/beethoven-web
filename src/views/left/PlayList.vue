<template>
  <div class="flex-row play-list-wrapper">
    <img class="playlist-cover" :src='playlist.cover' alt="cover"/>
    <div class="play-list-info">
      <span>喜欢</span>
      <span class="info">{{playlist.author}} · {{playlist.musicCount}}首歌曲</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const playlist = reactive({
  cover: 'http://sl3btfsle.hb-bkt.clouddn.com/cover/cover.png',
  author: 'Andre Lina',
  musicCount: 10
})
</script>

<style scoped>
.play-list-wrapper {
  padding: .5rem;
  border-radius: .25rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }


}

.playlist-cover {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: .2rem;
}

.play-list-info {
  padding: 0 .5rem;

  span {
    display: block;
  }

  .info {
    font-size: var(--info-font-size);
    color: grey;
  }
}
</style>
