<template>
  <div class="mini-player-root">
    <Transition name="bar-slide">
      <div v-if="expanded" class="mini-player-bar">
        <div class="mini-player-bar-inner">
          <div class="mini-info" @click="expanded = false">
            <img class="mini-cover" :src="cover" alt=""/>
            <div class="mini-text">
              <span class="mini-name">{{ music.name || '未在播放' }}</span>
              <span class="mini-singer">{{ music.singer || '—' }}</span>
            </div>
          </div>

          <div class="mini-controls">
            <button class="mini-icon-btn" type="button" aria-label="上一首" @click.stop="playPrev">
              <svg-icon name="prev" size="1.1rem"/>
            </button>
            <button
              :class="['mini-play-btn', { 'is-loading': loading }]"
              type="button"
              @click.stop="playOrPause"
              :disabled="loading || !music.id"
              aria-label="播放或暂停"
              :aria-busy="loading">
              <svg-icon v-if="paused" name="pause" size="1.25rem"/>
              <svg-icon v-else name="play" size="1.25rem"/>
            </button>
            <button class="mini-icon-btn" type="button" aria-label="下一首" @click.stop="playNext">
              <svg-icon name="next" size="1.1rem"/>
            </button>
          </div>

          <div class="mini-progress" @click.stop>
            <div class="mini-progress-track">
              <Progress :data="progressData" @changeCurrentTime="changeCurrentTime" @update="updateTime"/>
            </div>
            <div class="mini-times">
              <span>{{ durationFormater(Math.floor(currentTime)) }}</span>
              <span v-if="music.duration">{{ durationFormater(music.duration) }}</span>
            </div>
          </div>

          <div class="mini-volume" @click.stop>
            <svg-icon
              class="pointer"
              :name="volume === 0 ? 'volume-off' : 'volume-on'"
              size="1.25rem"
              @click.stop="changeMute"/>
            <a-slider class="volume-slider" v-model:value="volume"/>
          </div>

          <svg-icon
            class="collapse-btn pointer"
            name="down"
            size="1.25rem"
            @click.stop="expanded = false"/>
        </div>
      </div>
    </Transition>

    <Transition name="bubble-pop">
      <div v-if="music.id && !expanded" class="mini-bubble"
           :class="{ playing: !paused }"
           @click.stop="expanded = true">
        <div class="bubble-disc" :class="{ spinning: !paused && !loading }">
          <img v-if="cover" class="bubble-cover" :src="cover" alt=""/>
          <svg-icon v-else class="bubble-note" name="music" size="1.5rem"/>
        </div>
        <div class="bubble-control">
          <div v-if="loading" class="bubble-spinner"/>
          <svg-icon v-else-if="paused" name="pause" size=".9rem" color="#fff"/>
          <svg-icon v-else name="play" size=".9rem" color="#fff"/>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAudioPlayer } from '@/composables/useAudioPlayer';
import { durationFormater } from '@/util/time';
import Progress from '@/components/Progress.vue';
import SvgIcon from '@/components/SvgIcon.vue';

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
  playPrev,
  playNext,
} = useAudioPlayer();

const expanded = ref(false);

</script>

<style lang="scss" scoped>
.mini-player-root {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 20;
}

/* ── collapsed bubble ── */
.mini-bubble {
  width: 3.5rem;
  height: 3.5rem;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  background: var(--surface-color-strong);
  border: 1.5px solid var(--surface-border);
  box-shadow: 0 .75rem 2rem rgba(32, 53, 77, .12), 0 .25rem .5rem rgba(32, 53, 77, .08);
  backdrop-filter: blur(1.25rem);
  transition: transform .22s cubic-bezier(.34, 1.56, .64, 1), box-shadow .22s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 1rem 2.5rem rgba(32, 53, 77, .2), 0 .35rem .7rem rgba(32, 53, 77, .12);
  }

  &:active {
    transform: scale(.96);
  }
}

.bubble-disc {
  position: absolute;
  inset: .35rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-active), var(--surface-color-muted));

  &.spinning {
    animation: disc-spin 8s linear infinite;
  }
}

@keyframes disc-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bubble-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bubble-note {
  color: var(--brand-primary);
  opacity: .6;
}

.bubble-control {
  position: absolute;
  bottom: -.15rem;
  right: -.15rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: var(--brand-primary);
  box-shadow: 0 .2rem .5rem rgba(55, 125, 255, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.bubble-spinner {
  width: .7rem;
  height: .7rem;
  border: 2px solid rgba(255, 255, 255, .3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: bubble-spin .6s linear infinite;
}

@keyframes bubble-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── expanded bar ── */
.mini-player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 19;
  padding: .85rem 1rem 1rem;
}

.mini-player-bar-inner {
  width: min(100%, 72rem);
  margin: 0 auto;
  padding: .75rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  background: var(--surface-color-strong);
  box-shadow: var(--surface-shadow-strong);
  backdrop-filter: blur(1.25rem);
}

.mini-info {
  display: flex;
  align-items: center;
  gap: .7rem;
  min-width: 0;
  flex-shrink: 0;
  cursor: pointer;

  .mini-cover {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: .45rem;
    object-fit: cover;
    box-shadow: 0 .35rem .8rem rgba(32, 53, 77, .14);
  }

  .mini-text {
    min-width: 0;
    display: none;

    @media (min-width: 520px) {
      display: block;
    }

    span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 10rem;
      line-height: 1.35;
    }

    .mini-name {
      font-size: .85rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .mini-singer {
      font-size: .75rem;
      color: var(--text-secondary);
    }
  }
}

.mini-controls {
  display: flex;
  align-items: center;
  gap: .2rem;
  flex-shrink: 0;
}

.mini-icon-btn {
  width: 2rem;
  height: 2rem;
  padding: .3rem;
  border: 0;
  border-radius: 50%;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: var(--text-primary);
    background: var(--surface-active);
  }
}

.mini-play-btn {
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  padding: .3rem;
  border: 0;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: var(--svg-button-shadow);
  }

  &.is-loading::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(120, 170, 255, .16), var(--brand-primary), rgba(120, 170, 255, .16));
    animation: play-ring-spin .9s linear infinite;
    mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px));
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px));
  }

  &:disabled {
    cursor: default;
  }
}

@keyframes play-ring-spin {
  to {
    transform: rotate(360deg);
  }
}

.mini-progress {
  flex: 1;
  min-width: 5rem;

  .mini-progress-track {
    position: relative;
    width: 100%;
  }

  .mini-times {
    display: flex;
    justify-content: space-between;
    font-size: .7rem;
    color: var(--text-tertiary);
    margin-top: .15rem;
  }
}

.mini-volume {
  display: none;
  align-items: center;
  gap: .4rem;
  flex-shrink: 0;

  @media (min-width: 640px) {
    display: flex;
  }

  .volume-slider {
    width: 5rem;
  }
}

.collapse-btn {
  flex-shrink: 0;
  color: var(--text-secondary);
  padding: .3rem;
  border-radius: .4rem;

  &:hover {
    background: var(--surface-active);
    color: var(--text-primary);
  }
}

/* ── transitions ── */
.bar-slide-enter-active {
  animation: bar-slide-up .28s cubic-bezier(.22, .61, .36, 1);
}

.bar-slide-leave-active {
  animation: bar-slide-down .22s cubic-bezier(.55, 0, 1, .45);
}

@keyframes bar-slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bar-slide-down {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.bubble-pop-enter-active {
  animation: bubble-in .22s cubic-bezier(.34, 1.56, .64, 1);
}

.bubble-pop-leave-active {
  animation: bubble-out .15s ease forwards;
}

@keyframes bubble-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bubble-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* mobile adjustments */
@media (max-width: 800px) {
  .mini-player-root {
    bottom: 1rem;
    right: 1rem;
  }

  .mini-bubble {
    width: 3.2rem;
    height: 3.2rem;
  }

  .mini-player-bar {
    padding: .7rem .55rem .55rem;
  }

  .mini-player-bar-inner {
    padding: .6rem .8rem;
    gap: .6rem;
  }

  .mini-volume {
    display: none;
  }

  .mini-progress {
    display: none;
  }
}
</style>
