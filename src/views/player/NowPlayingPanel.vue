<template>
  <div class="now-playing-panel">
    <div class="panel-header">
      <p class="panel-title">正在播放</p>
    </div>

    <div class="current-track">
      <img
        class="track-cover"
        :src="music.cover || globalStore.global.defaultMusicCover || fallbackCover"
        alt=""
        @error="useFallbackCover"
      />
      <div class="track-info">
        <p class="track-name">{{ music.name || '未在播放' }}</p>
        <p class="track-singer">{{ music.singer || '—' }}</p>
      </div>
    </div>

    <div class="track-progress" v-if="music.duration">
      <div class="progress-bar" ref="progressRef" @click="handleProgressClick">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"/>
        <div class="progress-thumb" :style="{ left: progressPercent + '%' }"/>
      </div>
      <div class="progress-time">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(music.duration) }}</span>
      </div>
    </div>

    <div class="queue-toggle">
      <button class="toggle-btn" type="button" @click="showQueue">
        <svg-icon name="queue" size="1.2rem"/>
        <span>展开播放队列</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGlobalStore } from '@/store/global';
// ── audio player state ──────────────────────────────────────────
import { useAudioPlayer } from '@/composables/useAudioPlayer';

const globalStore = useGlobalStore();
const fallbackCover = '/assets/img/playlistCover.png';
const progressRef = ref<HTMLElement | null>(null);

const useFallbackCover = (event: Event) => {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(fallbackCover)) return;
  image.src = fallbackCover;
};

const showQueue = () => {
  globalStore.global.showQueue = true;
};

const formatTime = (seconds: number): string => {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const handleProgressClick = (e: MouseEvent) => {
  if (!progressRef.value || !music.duration) return;
  const rect = progressRef.value.getBoundingClientRect();
  const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  const targetTime = ratio * music.duration;
  changeCurrentTime((targetTime / music.duration) * 100);
};

const {
  music,
  currentTime,
  changeCurrentTime,
} = useAudioPlayer();

const progressPercent = computed(() => {
  if (!music.duration) return 0;
  return Math.min((currentTime.value / music.duration) * 100, 100);
});
</script>

<style scoped lang="scss">
.now-playing-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-height: 0;
}

.panel-header {
  .panel-title {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 800;
    margin: 0;
  }
}

.current-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .85rem;
  text-align: center;
}

.track-cover {
  width: 10rem;
  height: 10rem;
  border-radius: var(--radius-card);
  object-fit: cover;
  box-shadow: 0 .75rem 1.8rem rgba(32, 53, 77, .18);
}

.track-info {
  min-width: 0;
  width: 100%;
}

.track-name {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-singer {
  color: var(--text-secondary);
  font-size: .85rem;
  margin: .25rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-progress {
  display: flex;
  flex-direction: column;
  gap: .35rem;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 5px;
  background: rgba(55, 125, 255, .12);
  border-radius: 4px;
  cursor: pointer;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  border-radius: 4px;
  transition: width .1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: var(--brand-primary);
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 6px rgba(55, 125, 255, .35);
  opacity: 0;
  transition: opacity .18s ease;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: .78rem;
}

.queue-toggle {
  margin-top: auto;

  .toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem 1rem;
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-control);
    color: var(--text-secondary);
    font-size: .85rem;
    background: transparent;
    cursor: pointer;
    transition: all .18s ease;

    &:hover {
      color: var(--brand-primary);
      border-color: var(--brand-primary);
      background: rgba(55, 125, 255, .06);
    }
  }
}
</style>
