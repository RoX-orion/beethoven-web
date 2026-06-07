<template>
  <div class="playlist-card">
    <img class="cover" :src="playList.cover" alt="">
    <div class="playlist-detail">
      <span class="title">{{playList.title}}</span>
      <div>
        <span v-for="singer in playList.singers" :key="singer">{{ singer }}</span>
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
  min-width: 0;
  padding: .65rem;
  border: 1px solid transparent;
  border-radius: .9rem;
  transition: transform .18s ease, background-color .18s ease, border-color .18s ease, box-shadow .18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(32, 53, 77, .08);
    background: rgba(255, 255, 255, .68);
    box-shadow: 0 .9rem 1.8rem rgba(32, 53, 77, .12);
  }

  .cover {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 100%;
    border-radius: .75rem;
    box-shadow: 0 .6rem 1.2rem rgba(32, 53, 77, .13);
  }

  .playlist-detail {
    padding: .7rem .1rem .15rem;
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      color: var(--text-primary);
      font-weight: 800;
      line-height: 1.45;
    }
    div {
      margin-top: .25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        color: var(--text-secondary);
        font-size: .82rem;
      }
    }
  }
}

@media (max-width: 800px) {
  .playlist-card {
    width: 100%;
    padding: .45rem;

    .cover {
      border-radius: .625rem;
    }
  }
}
</style>
