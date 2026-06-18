<template>
  <Transition name="slide">
    <div v-if="mobilePlayer" class="mobile-player">
      <img class="mobile-cover" :src="getCover" alt=""/>

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
            <svg-icon class="pointer" name="loop"/>
            <svg-icon class="pointer" name="prev"/>
            <button
              :class="['play-button', { 'is-loading': loading }]"
              type="button"
              @click.stop="playOrPause"
              :disabled="loading"
              :aria-busy="loading">
              <svg-icon v-if="paused" name="pause" size="2rem"/>
              <svg-icon v-else name="play" size="2rem"/>
            </button>
            <svg-icon class="pointer" name="next"/>
            <svg-icon class="pointer" name="menu"/>
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
        <img class="cover" :src="getCover" alt="cover">
        <div class="music-info">
          <span class="music-name">{{ music.name }}</span>
          <span class="grey">{{ music.singer }}</span>
        </div>
      </div>
      <div class="flex-col controls-wrapper">
        <div class="button-group flex-row">
          <IconButton class="prev" icon-name="prev"/>
          <div style="margin: auto">
            <button
              :class="['play-button', { 'is-loading': loading }]"
              type="button"
              @click.stop="playOrPause"
              :disabled="loading"
              :aria-busy="loading">
              <svg-icon v-if="paused" name="pause" size="2rem"/>
              <svg-icon v-else name="play" size="2rem"/>
            </button>
          </div>
          <IconButton class="next" icon-name="next"/>
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
          <svg-icon class="button pointer" name="loop" size="1.5rem"/>
          <svg-icon class="button pointer" name="queue" size="1.5rem"/>
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
      <div class="media-player" id="audioPlayer"></div>
<!--      <audio class="player" ref="audioPlayer" controls></audio>-->
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { MusicItemType, ProgressType, SettingType } from '@/types/global';
import { ComponentType } from '@/types/global';
import { useRoute } from 'vue-router';
import { getMusicInfoFromLocal, useAccountStore, useGlobalStore } from '@/store/global';
import { durationFormater } from '@/util/time';
import IconButton from '@/components/IconButton.vue';
import Progress from '@/components/Progress.vue';
import { PLAYER_SETTING, TOKEN, VOLUME_MUSIC } from '@/config';
import { getData, setData } from '@/util/localStorage';
import { throttle } from '@/util/schedulers';
import SvgIcon from '@/components/SvgIcon.vue';
import { getSetting, updateSetting } from "@/api/setting";
import Player, { Events } from "xgplayer";
import { componentState } from '@/store/componentState';
import { getMusicInfo } from "@/api/music";

const audioPlayer = ref<any>();
const music: MusicItemType = reactive({
  link: '',
  duration: 0,
  mime: '',
});
let shardingSize: number;
let shardingCount: number;
let seeking = false;
const globalStore = useGlobalStore();
const currentPercentage = ref(0);
const paused = ref(true);
const loading = ref(false);

const getMediaElement = (): HTMLMediaElement | undefined => {
  return audioPlayer.value?.media ?? audioPlayer.value?.video;
};

const setMetadataPreload = () => {
  const media = getMediaElement();
  if (media) {
    media.preload = 'metadata';
  }
};

const mobilePlayer = ref(false);
const openMobilePlayer = (event: MouseEvent) => {
  if (globalStore.global.mobile) {
    event.preventDefault();
    mobilePlayer.value = true;
  }
};

const handleSeek = async (forward: number) => {
  let targetTime = forward === -1 ? currentTime.value - 15 : currentTime.value + 15;
  if (forward === -1) {
    targetTime = targetTime < 0 ? 0 : targetTime;
  } else {
    targetTime = targetTime > music.duration ? music.duration : targetTime;
  }
  await seekToTime(targetTime);
  await onTimeUpdate();
}

const handleKeyEvent = (e: KeyboardEvent) => {
  switch (e.key) {
    case ' ':
    case 'Enter':
      e.preventDefault();
      playOrPause();
      break;
    case 'Left':
    case 'ArrowLeft':
      handleSeek(-1);
      break;
    case 'Right':
    case 'ArrowRight':
      handleSeek(1);
      break;
  }
}

const openVideoPlayer = () => {
  globalStore.global.videoId = music.videoId != null ? String(music.videoId) : undefined;
  if (music.videoId)
    componentState.currentMiddleComponent = ComponentType.VIDEO_PLAYER;
}
const route = useRoute();
const accountStore = useAccountStore();
onMounted(async () => {
  audioPlayer.value = new Player({
    id: 'audioPlayer',
    mediaType: 'audio',
    url: '',
    videoAttributes: {
      preload: 'metadata'
    },
    height: '100%',
    width: '100%',
    volume: 0.5
  });
  setMetadataPreload();

  audioPlayer.value.on(Events.TIME_UPDATE, onTimeUpdate);
  audioPlayer.value.on(Events.PLAY, () => paused.value = false);
  audioPlayer.value.on(Events.PAUSE, () => paused.value = true);
  audioPlayer.value.on(Events.LOAD_START, () => loading.value = true);
  audioPlayer.value.on(Events.WAITING, () => loading.value = true);
  audioPlayer.value.on(Events.SEEKING, () => loading.value = true);
  audioPlayer.value.on(Events.LOADED_METADATA, () => {
    if (paused.value) {
      loading.value = false;
    }
  });
  audioPlayer.value.on(Events.CANPLAY, () => loading.value = false);
  audioPlayer.value.on(Events.PLAYING, () => loading.value = false);
  audioPlayer.value.on(Events.SEEKED, () => loading.value = false);
  audioPlayer.value.on(Events.ERROR, () => loading.value = false);

  const { id, type } = route.params;

  await getSetting().then(response => {
    if (response.data) {
      setting.value = response.data;
      const music = getData('music');
      setData(PLAYER_SETTING, JSON.stringify(response.data));
      globalStore.global.player = response.data;
      if (type === 'music' && id) {
        globalStore.global.media.musicId = response.data.musicId;
      } else if (response.data.musicId) {
        currentTime.value = response.data.currentTime;
        globalStore.global.media.musicId = response.data.musicId;
        globalStore.global.media.currentTime = response.data.currentTime;
        changeCurrentTime(null);
      } else if (music) {
        setMusic(JSON.parse(music));
      }
    }
  });
  if (globalStore.global.mobile) {
    setMobileVolume();
  } else {
    const localVolume = getData(VOLUME_MUSIC);
    volume.value = localVolume ? Number.parseInt(localVolume) : 20;
    await handleEvent('changeVolume', volume.value / 100);
  }

  document.addEventListener('keydown', handleKeyEvent, false);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyEvent, false);
});

watch(() => globalStore.global.media.musicId, async musicId => {
  const music = getMusicInfoFromLocal();
  if ((!music || music.id !== musicId) && musicId) {
    await getMusicInfo(musicId as string).then(async response => {
      if (response.data) {
        await setMusic(response.data);
      }
    });
  } else if (music) {
    await setMusic(music);
  }
  if (globalStore.global.canPlay) {
    currentTime.value = 0;
    await handleEvent('play', null);
  }
});

const changeCurrentTime = async (e: any) => {
  seeking = false;
  const percentage = Number(e);
  if (!Number.isFinite(percentage) || !music.duration) {
    return;
  }
  currentPercentage.value = Math.min(Math.max(percentage, 0), 100);
  await seekToTime(currentPercentage.value / 100 * music.duration);
}

const seekToTime = async (targetTime: number) => {
  if (!Number.isFinite(targetTime)) {
    return;
  }
  currentTime.value = Math.min(Math.max(targetTime, 0), music.duration);
  currentPercentage.value = music.duration ? currentTime.value / music.duration * 100 : 0;
  await handleEvent('changeCurrentTime', currentPercentage.value);
};

const updateTime = (e: any) => {
  seeking = true;
  handleEvent('updateTime', e);
}

const handleEvent = async (eventName: string, state: any) => {
  setting.value.currentTime = Math.floor(currentTime.value);
  if (eventName === 'play') {
    paused.value = false;
    audioPlayer.value!.currentTime = currentTime.value;
    await audioPlayer.value!.play();
    await updateSettingFun();
  } else if (eventName === 'pause') {
    paused.value = true;
    audioPlayer.value!.pause();
    await updateSettingFun();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value!.volume = state;
    globalStore.global.player.volume = Math.floor(state * 100);
  } else if (eventName === 'changeCurrentTime') {
    loading.value = !paused.value;
    progressData.percentage = Number(state);
    audioPlayer.value!.currentTime = currentTime.value;
    await updateSettingFun();
  } else if (eventName === 'updateTime') {
    currentTime.value = state / 100 * music.duration;
  }
};

let mediaSource: MediaSource;
let sourceBuffer: SourceBuffer;
let currentShard = 0;
const setMusic = async (musicInfo: MusicItemType) => {
  if (!musicInfo || (music && musicInfo.id === music.id)) {
    return;
  }
  const nextCurrentTime = setting.value.musicId === musicInfo.id
    ? Math.min(currentTime.value, musicInfo.duration)
    : 0;
  Object.assign(music, musicInfo);
  loading.value = true;
  currentTime.value = nextCurrentTime;
  progressData.percentage = music.duration ? currentTime.value / music.duration * 100 : 0;
  audioPlayer.value!.src = music.link;
  setMetadataPreload();
  audioPlayer.value!.currentTime = currentTime.value;
  setting.value.musicId = musicInfo.id;
  await updateSettingFun();
  // audioPlayer.value!.url = music.link;

  // mediaSource = new MediaSource();
  // audioPlayer.value!.src = URL.createObjectURL(mediaSource);
  // mediaSource.addEventListener('sourceopen', async () => {
  //   await fetchMusic(musicInfo?.link!, 0, shardingSize);
  // });
};
// const fetchMusic = async (fileName: string, start: number, end: number) => {
//   if (start === 0) {
//     if (sourceBuffer) {
//       mediaSource.removeSourceBuffer(sourceBuffer);
//     }
//     sourceBuffer = mediaSource.addSourceBuffer(music.mime);
//   }
//   await fetch(`http://localhost:45678/music/fetchMusic?fileName=${fileName}`, {
//     method: 'get',
//     headers: {
//       'Range': `bytes=${start}-${end}`,
//     },
//   }).then(response => response.arrayBuffer())
//     .then(buffer => {
//       sourceBuffer.appendBuffer(buffer);
//       currentShard++;
//     });
// }

let currentTime = ref<number>(0);
const updateCurrentTime = throttle((currentTime) => {
  globalStore.global.media.currentTime = currentTime;
}, 15 * 1000, false);

const onTimeUpdate = async () => {
  // const buffered = audioPlayer.value!.buffered;
  if (!seeking) {
    currentTime.value = audioPlayer.value!.currentTime;
    progressData.percentage = Math.min(currentTime.value / music.duration * 100, 100);
  }
  updateCurrentTime(audioPlayer.value!.currentTime);
  // const bufferedEnd = buffered.length ? buffered.end(buffered.length - 1) : 0;
  // if (bufferedEnd - currentTime.value <= 30 && currentShard + 1 < shardingCount) {
  //   fetchMusic(music.link, currentShard * shardingSize, (currentShard + 1) * shardingSize);
  // }
};

const getCover = computed(() => {
  return music?.cover ? music.cover : globalStore.global.defaultMusicCover;
});

const playOrPause = () => {
  if (!music.id || loading.value) {
    return;
  }
  updateCurrentTime(audioPlayer.value!.currentTime);
  if (paused.value) {
    handleEvent('play', undefined);
  } else {
    handleEvent('pause', undefined);
  }
}

const progressData: ProgressType = reactive({
  width: '100%',
  height: '5px',
  radius: '0.156rem',
  percentage: 0,
});

const volumeProgressData: ProgressType = reactive({
  width: '10rem',
  height: '5px',
  radius: '0.556rem',
  percentage: 10,
});

let volume = ref(10);

const changeMute = () => {
  if (volume.value === 0) {
    volume.value = globalStore.global.player.volume;
  } else {
    globalStore.global.player.volume = volume.value;
    volume.value = 0;
  }
}

const setMobileVolume = () => {
  volume.value = 100;
  handleEvent('changeVolume', 1);
}

watch(volume, (newVolume) => {
  setData(VOLUME_MUSIC, String(newVolume));
  handleEvent('changeVolume', newVolume / 100);
});

const setting = ref<SettingType>(
  {
    userId: '',
    musicId: '',
    currentTime: 0,
    isMute: false,
    volume: 0,
    playMode: 'random',
  },
);
const updateSettingFun = async () => {
  if (getData(TOKEN)) {
    await updateSetting(setting.value);
  }
}

const devicesVisible = ref(false);

</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 1rem 1rem;
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
    background: conic-gradient(from 0deg, rgba(51, 144, 236, .16), rgba(51, 144, 236, 1), rgba(51, 144, 236, .16));
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
  width: min(100%, 98rem);
  min-height: 5.5rem;
  margin: 0 auto;
  padding: .75rem 1rem;
  justify-content: space-between;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
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
  }

  .panel-wrapper {
    width: 30%;
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
    padding: 0 .55rem .55rem;
  }

  .progress-mobile {
    width: min(100%, 98rem);
    margin: 0 auto .35rem;
    padding: 0 .75rem;
    color: var(--text-secondary);
    font-size: .75rem;
    pointer-events: auto;
  }

  .player-wrapper {
    min-height: 4.75rem;
    padding: .55rem .75rem;

    .cover {
      width: 4rem;
      height: 4rem;
    }

    .controls-wrapper {
      width: 30%;
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
    width: 80%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: var(--radius-panel);
    position: absolute;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 1.25rem 3rem rgba(32, 53, 77, .2);
  }

  .mobile-player-panel {
    padding: .75rem 1rem 1.25rem;
    position: fixed;
    bottom: 0;
    width: 100%;
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
