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
  align-items: center;
  gap: .65rem;
  padding: .55rem;
  border-radius: .75rem;
  cursor: pointer;
  transition: background-color .18s ease, transform .18s ease, box-shadow .18s ease;

  &:hover {
    background-color: rgba(255, 255, 255, .72);
    box-shadow: 0 .45rem 1.2rem rgba(32, 53, 77, .08);
    transform: translateY(-1px);
  }
}

.playlist-cover {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: .6rem;
  object-fit: cover;
  box-shadow: 0 .35rem .8rem rgba(32, 53, 77, .12);
}

.playlist-card {
  min-width: 0;

  span {
    display: block;
    overflow: hidden;
    color: var(--text-primary);
    font-weight: 700;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info {
    font-size: var(--info-font-size);
    color: var(--text-secondary);
    font-weight: 400;
  }
}
</style>
