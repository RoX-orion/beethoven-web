<template>
  <Transition name="slide">
    <div v-if="mobilePlayer" class="mobile-player">
      <img class="mobile-cover" :src="getCover || fallbackCover" alt="" @error="useFallbackCover"/>

      <div class="mobile-player-panel">
        <div class="flex-row content-space-between" style="padding: 1rem 0">
          <div>
            <p style="font-size: 1.5rem">{{ music.name }}</p>
            <p class="grey">{{ music.singer }}</p>
          </div>
          <svg-icon class="pointer" style="margin: auto 0" name="favorite"/>
        </div>
        <div style="width: 100%; position: relative; margin: auto">
          <Progress :data="progressData" @changeCurrentTime="changeCurrentTime" @update="updateTime"/>
        </div>
        <div class="flex-row content-space-between" style="width: 100%; margin-top: .25rem">
          <div>{{ durationFormater(Math.floor(currentTime)) }}</div>
          <div v-if="music.duration">{{ durationFormater(music.duration) }}</div>
        </div>

        <div class="">
          <div class="flex-row mobile-button-group content-space-between">
            <svg-icon class="pointer" name="loop" :title="playModeTitle" @click.stop="cyclePlayMode"/>
            <svg-icon class="pointer" name="prev" @click.stop="playPrev"/>
            <button
              :class="['play-button', { 'is-loading': loading }]"
              type="button"
              @click.stop="playOrPause"
              :disabled="loading"
              aria-label="播放或暂停"
              :aria-busy="loading">
              <svg-icon v-if="paused" name="pause" size="2rem"/>
              <svg-icon v-else name="play" size="2rem"/>
            </button>
            <svg-icon class="pointer" name="next" @click.stop="playNext"/>
            <svg-icon class="pointer" name="menu" @click.stop="toggleQueuePanel"/>
          </div>
          <div class="flex-row content-space-between">
            <svg-icon style="margin: .5rem 0" class="pointer" name="devices" @click="devicesVisible = true"/>
            <svg-icon style="margin: .5rem 0" class="pointer" name="down" @click="mobilePlayer = false"/>
          </div>
        </div>
      </div>
      <a-drawer title="设备" placement="bottom" :open="devicesVisible" @close="devicesVisible = false">
        <div class="flex-row mobile-sound-wrapper">
          <svg-icon class="pointer" style="margin: .5rem" v-if="volume === 0" name="volume-off" size="1.5rem" @click.stop="changeMute"/>
          <svg-icon class="pointer" style="margin: .5rem" v-else name="volume-on" size="1.5rem" @click.stop="changeMute"/>
          <a-slider style="width: 90%" v-model:value="volume"/>
        </div>
      </a-drawer>
    </div>
  </Transition>

  <div class="player" @click="openMobilePlayer">
    <div class="progress-mobile">
      <div style="width: 100%; position: relative; margin: auto">
        <Progress :data="progressData" @changeCurrentTime="changeCurrentTime" @update="updateTime"/>
<!--        <div class="seek-line pointer" :style="{left: calculateProgress + '%'}"></div>-->
      </div>
      <div class="flex-row content-space-between" style="width: 100%">
        <div>{{ durationFormater(Math.floor(currentTime)) }}</div>
        <div v-if="music.duration">{{ durationFormater(music.duration) }}</div>
      </div>
    </div>

    <div class="player-wrapper flex-row ">
      <div class="flex-row pointer base-info">
        <img class="cover" :src="getCover || fallbackCover" alt="cover" @error="useFallbackCover">
        <div class="music-info">
          <span class="music-name">{{ music.name }}</span>
          <span class="grey">{{ music.singer }}</span>
        </div>
      </div>
      <div class="flex-col controls-wrapper">
        <div class="button-group flex-row">
          <IconButton class="prev" icon-name="prev" @click.stop="playPrev"/>
          <div style="margin: auto">
            <button
              :class="['play-button', { 'is-loading': loading }]"
              type="button"
              @click.stop="playOrPause"
              :disabled="loading"
              aria-label="播放或暂停"
              :aria-busy="loading">
              <svg-icon v-if="paused" name="pause" size="2rem"/>
              <svg-icon v-else name="play" size="2rem"/>
            </button>
          </div>
          <IconButton class="next" icon-name="next" @click.stop="playNext"/>

        </div>
        <div class="progress">
          <!--          <div class="time">{{ durationFormater(Math.floor(currentTime)) }}</div>-->
          <div style="width: 100%; position: relative; margin: auto">
            <Progress :data="progressData" @changeCurrentTime="changeCurrentTime" @update="updateTime"/>
          </div>
          <div class="flex-row content-space-between">
            <div class="time">{{ durationFormater(Math.floor(currentTime)) }}</div>
            <div class="time" v-if="music.duration">{{ durationFormater(music.duration) }}</div>
          </div>
          <!--          <div class="time" v-if="music.duration">{{ durationFormater(music.duration) }}</div>-->
        </div>
      </div>
      <div class="flex-row panel-wrapper">
        <div class="flex-row">
          <svg-icon class="button pointer" name="video" @click.stop="openVideoPlayer"/>
          <svg-icon class="button pointer" name="loop" size="1.5rem" :title="playModeTitle"
                    @click.stop="cyclePlayMode"/>
          <svg-icon class="button pointer" name="queue" size="1.5rem" @click.stop="toggleQueuePanel"/>
        </div>
        <div class="flex-row sound-wrapper">
          <svg-icon class="pointer" v-if="volume === 0" name="volume-off" size="1.5rem"
                    @click.stop="changeMute"/>
          <svg-icon class="pointer" v-else name="volume-on" size="1.5rem" @click.stop="changeMute"/>
          <a-slider class="progress" style="width: 100px" v-model:value="volume"/>
          <!--      <div class="progress" style="position: relative;">-->
          <!--        <div style="display: block; margin: auto">-->
          <!--          <Progress v-model="volume" :data="progressData" @mousedown="changeVolume"/>-->
          <!--        </div>-->
          <!--        <div class="seek-line pointer" :style="{left: volume + '%'}" @mousedown="saveVolume"></div>-->
          <!--      </div>-->
        </div>
      </div>
      <!--      <Panel @update="handleEvent"/>-->
      <div class="media-player"></div>
<!--      <audio class="player" ref="audioPlayer" controls></audio>-->
    </div>
  </div>
  <!--<aside v-if="queueVisible && !globalStore.global.mobile" class="desktop-queue-panel">-->
  <!--  <QueuePanel show-close @close="queueVisible = false"/>-->
  <!--</aside>-->
  <a-drawer
    v-if="globalStore.global.mobile"
    title="正在播放"
    placement="bottom"
    :open="localQueueVisible"
    @close="localQueueVisible = false">
    <QueuePanel show-close @close="localQueueVisible = false"/>
  </a-drawer>

</template>

<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ComponentType } from '@/types/global';
import { useGlobalStore } from '@/store/global';
import { durationFormater } from '@/util/time';
import IconButton from '@/components/IconButton.vue';
import Progress from '@/components/Progress.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { componentState } from '@/store/componentState';
import { useAudioPlayer } from '@/composables/useAudioPlayer';
import QueuePanel from '@/views/player/QueuePanel.vue';

const {
  paused,
  loading,
  currentTime,
  volume,
  music,
  progressData,
  cover,
  playOrPause,
  changeCurrentTime,
  updateTime,
  changeMute,
  handleSeek,
  playNext,
  playPrev,
  playModeTitle,
  cyclePlayMode,
  init,
} = useAudioPlayer();

const globalStore = useGlobalStore();

const getCover = cover;
const fallbackCover = '/assets/img/playlistCover.png';

const mobilePlayer = ref(false);
const openMobilePlayer = (event: MouseEvent) => {
  if (globalStore.global.mobile) {
    event.preventDefault();
    mobilePlayer.value = true;
  }
};

const openVideoPlayer = () => {
  globalStore.global.videoId = music.videoId != null ? String(music.videoId) : undefined;
  if (music.videoId)
    componentState.currentMiddleComponent = ComponentType.VIDEO_PLAYER;
};

onMounted(async () => {
  await init();
});

onUnmounted(() => {
});

const devicesVisible = ref(false);
const queueVisible = computed(() => globalStore.global.mobile ? localQueueVisible.value : globalStore.global.showQueue);
const localQueueVisible = ref(false);

const toggleQueuePanel = () => {
  if (globalStore.global.mobile) {
    localQueueVisible.value = !localQueueVisible.value;
  } else {
    globalStore.global.showQueue = !globalStore.global.showQueue;
  }
};

const useFallbackCover = (event: Event) => {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(fallbackCover)) return;
  image.src = fallbackCover;
};
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: .95rem 1rem 1rem;
  background: transparent;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
}

.play-button {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  padding: .35rem;
  border: 0;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  appearance: none;

  &:hover {
    background: var(--svg-button-shadow);
  }

  svg {
    position: relative;
    z-index: 1;
  }

  &.is-loading {
    background: transparent;
  }

  &.is-loading::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(120, 170, 255, .16), var(--brand-primary), rgba(120, 170, 255, .16));
    animation: play-ring-spin .9s linear infinite;
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  }

  &:active,
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &:disabled {
    cursor: default;
  }
}

.pointer,
.player-wrapper,
.progress-mobile,
.mobile-player {
  -webkit-tap-highlight-color: transparent;
}

.pointer:focus,
.player-wrapper:focus,
.progress-mobile:focus {
  outline: none;
}

@keyframes play-ring-spin {
  to {
    transform: rotate(360deg);
  }
}

.player-wrapper {
  width: 100%;
  min-height: 5.85rem;
  margin: 0 auto;
  padding: .8rem 1.1rem;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  background: var(--surface-color-strong);
  box-shadow: var(--surface-shadow-strong);
  backdrop-filter: blur(1.25rem);
  pointer-events: auto;

  .base-info {
    align-items: center;
    min-width: 0;

    .cover {
      width: 4.25rem;
      height: 4.25rem;
      aspect-ratio: 1 / 1;
      border-radius: var(--radius-card);
      object-fit: cover;
      box-shadow: 0 .55rem 1.2rem rgba(32, 53, 77, .16);
    }

    .music-info {
      padding: 0 10px;
      min-width: 0;

      span {
        display: block;
        line-height: 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .music-name {
        color: var(--text-primary);
        font-weight: 800;
      }
    }
  }

  .controls-wrapper {
    margin: auto;
    width: 40%;
    min-width: 16rem;
  }

  .panel-wrapper {
    width: 30%;
    min-width: 13rem;
    justify-content: flex-end;
  }

  .media-player {
    display: none;
  }
}

.button-group {
  width: min(20vw, 16rem);
  justify-content: space-between;
  margin: auto;

  .button {
    cursor: pointer;
    display: inline-block;
  }
}

.progress {
  position: relative;

  .time {
    line-height: 1rem;
    padding: .5rem 0;
    font-size: .85rem;
    color: var(--text-secondary);
  }
}

@media (max-width: 800px) {
  .player {
    padding: .75rem .55rem .55rem;
  }

  .progress-mobile {
    width: 100%;
    margin: .75rem auto .25rem;
    padding: .2rem .85rem .05rem;
    color: var(--text-secondary);
    font-size: .75rem;
    pointer-events: auto;
  }

  .player-wrapper {
    min-height: 5rem;
    padding: .6rem .8rem;
    border-radius: 1rem;

    .cover {
      width: 4rem;
      height: 4rem;
    }

    .controls-wrapper {
      width: 30%;
      min-width: 3.5rem;
      .button-group {
        width: 100%;
        justify-content: end;
        .prev, .next {
          display: none;
        }
      }
    }
  }

  .progress {
    display: none;
  }

  .panel-wrapper {
    display: none;
  }

  .base-info {
    width: 70%;
  }
}

@media (min-width: 801px) {
  .progress-mobile {
    display: none;
  }

  .base-info {
    width: 30%;
  }
}

.panel-wrapper {
  margin: auto 0;

  div {
    .button {
      margin: auto .5rem;
    }
  }

  .sound-wrapper {
    align-items: center;
    position: relative;
  }
}

.mobile-player {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 12%, rgba(64, 158, 255, .24), transparent 20rem),
  var(--background-color-light);
  z-index: 20;

  .mobile-cover {
    width: min(72vw, 22rem);
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: var(--radius-panel);
    position: absolute;
    top: clamp(2.5rem, 8vh, 4rem);
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 1.25rem 3rem rgba(32, 53, 77, .2);
  }

  .mobile-player-panel {
    padding: .75rem 1rem 1.25rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-height: 48dvh;
    overflow-y: auto;
    border-radius: var(--radius-panel) var(--radius-panel) 0 0;
    background: var(--surface-color-strong);
    box-shadow: 0 -1rem 2.5rem rgba(32, 53, 77, .12);
    backdrop-filter: blur(1.25rem);
  }

  .mobile-button-group {
    width: 100%;
    margin: 1rem auto;
    align-items: center;
  }

  .mobile-sound-wrapper {
    position: absolute;
    bottom: 1rem;
  }
}

.desktop-queue-panel {
  position: fixed;
  top: 6rem;
  right: 1rem;
  bottom: 7.25rem;
  z-index: 12;
  width: min(24rem, calc(100vw - 2rem));
  padding: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
  background: var(--surface-color-strong);
  box-shadow: var(--surface-shadow-strong);
  backdrop-filter: blur(1.25rem);
  pointer-events: auto;
  overflow: hidden;
}

.slide-enter-active {
  opacity: 1;
  animation: slide-up 0.25s ease forwards;
}

.slide-leave-active {
  animation: slide-down 0.25s ease forwards;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 1;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 1;
  }
}
</style>

