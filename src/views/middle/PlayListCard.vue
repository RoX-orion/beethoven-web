<template>
  <div class="playlist-card" :style="{ backgroundImage: `url(${playList.cover})` }">
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
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-card);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: transform .18s ease, background-color .18s ease, border-color .18s ease, box-shadow .18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--surface-border);
    box-shadow: var(--surface-shadow-strong);
    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, .12);
    opacity: 0;
    transition: opacity .18s ease;
    pointer-events: none;
  }

  .playlist-detail {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.8rem .75rem .55rem;
    background: linear-gradient(to top, rgba(0, 0, 0, .62) 0%, rgba(0, 0, 0, .18) 58%, transparent 100%);
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      color: #fff;
      font-weight: 800;
      line-height: 1.45;
    }
    div {
      margin-top: .25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        color: rgba(255, 255, 255, .78);
        font-size: .82rem;
      }
    }
  }
}

@media (max-width: 800px) {
  .playlist-card {
    width: 100%;
  }
}
</style>
