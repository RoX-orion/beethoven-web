<template>
  <div class="flex-row playlist-wrapper">
    <img class="playlist-cover" :src='playlist.cover' alt="cover"/>
    <div class="playlist-card">
      <span>{{ playlist.title }}</span>
      <span class="info">{{playlist.author}} · {{playlist.musicCount}}首歌曲</span>
    </div>
  </div>
</template>

<script setup lang="ts">

const playlist = defineProps({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  musicCount: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.playlist-wrapper {
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

.playlist-card {
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
