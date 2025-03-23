<template>
  <Transition name="slide">
    <div v-if="mobilePlayer" class="mobile-player">
      <IconButton style="float: right; margin: 1rem" icon-name="down" @click="closeMobilePlayer"/>
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

        <div class="flex-row">
          <div class="flex-row mobile-button-group content-space-between">
            <svg-icon class="pointer" name="loop"/>
            <svg-icon class="pointer" name="prev"/>
            <svg-icon class="pointer" v-if="paused" name="pause" size="2rem" @click.stop="playOrPause"/>
            <svg-icon class="pointer" v-else name="play" size="2rem" @click.stop="playOrPause"/>
            <svg-icon class="pointer" name="next"/>
            <svg-icon class="pointer" name="menu"/>
          </div>

        </div>
      </div>
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
          <IconButton icon-name="prev                                       "/>
          <IconButton v-if="paused" icon-name="pause" @click.stop="playOrPause"/>
          <IconButton v-else icon-name="play" @click.stop="playOrPause"/>
          <IconButton icon-name="next"/>
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
          <svg-icon class="button pointer" name="loop" size="1.5rem"/>
          <svg-icon class="button pointer" name="queue" size="1.5rem"/>
        </div>
        <div class="flex-row sound-wrapper">
          <svg-icon class="sound-button pointer" v-if="volume === 0" name="volume-off" size="1.5rem"
                    @click.stop="changeMute"/>
          <svg-icon class="sound-button pointer" v-else name="volume-on" size="1.5rem" @click.stop="changeMute"/>
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
      <div class="player" id="audioPlayer"></div>
<!--      <audio class="player" ref="audioPlayer" controls></audio>-->
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { MusicItemType, ProgressType } from '@/types/global';
import eventBus from '@/util/eventBus';
import { getMusicInfo } from '@/api/music';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '@/store/global';
import { durationFormater } from '@/util/time';
import IconButton from '@/components/IconButton.vue';
import Progress from '@/components/Progress.vue';
import {PLAYER_SETTING, SHARDING_SIZE} from '@/config';
import {getData, setData} from '@/util/localStorage';
import { throttle } from '@/util/schedulers';
import SvgIcon from '@/components/SvgIcon.vue';
import Player from "xgplayer/es/player";
import { Events } from 'xgplayer'
import {getSetting} from "@/api/setting";

const audioPlayer = ref<any>();
const music: MusicItemType = reactive({
  id: null,
  duration: 0,
  mime: '',
  link: '',
});
let shardingSize: number;
let shardingCount: number;
let seeking = false;
const globalStore = useGlobalStore();
const currentPercentage = ref(0);
const paused = ref(true);

const mobilePlayer = ref(false);
const openMobilePlayer = (event: MouseEvent) => {
  if (globalStore.global.windowWidth <= 800) {
    event.preventDefault();
    mobilePlayer.value = true;
  }
};

const closeMobilePlayer = () => {
  mobilePlayer.value = false;
}

const handleSeek = async (forward: number) => {
  currentTime.value = forward === -1 ? currentTime.value - 15 : currentTime.value + 15;
  if (forward === -1) {
    currentTime.value = currentTime.value < 0 ? 0 : currentTime.value;
  } else {
    currentTime.value = currentTime.value > music.duration ? music.duration : currentTime.value;
  }
  await changeCurrentTime(currentTime.value);
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

onMounted(async () => {
  audioPlayer.value = new Player({
    id: 'audioPlayer',
    mediaType: 'audio',
    url: '',
    height: '100%',
    width: '100%',
    volume: 0.5
  });
  screenWidth.value = window.innerWidth;

  getSetting().then(response => {
    if (response.data) {
      setData(PLAYER_SETTING, response.data);
      globalStore.global.player = response.data;
      globalStore.global.media.musicId = response.data.musicId;
      globalStore.global.media.currentTime = response.data.currentTime;
    }
  });
  if (screenWidth.value <= 800) {
    setMobileVolume();
  }

  let route = useRoute();
  const { id, type } = route.params;
  if (type === 'music' && id) {
    getMusicInfoFun(id as string, true);
  } else if (globalStore.global.media.musicId) {
    getMusicInfoFun(globalStore.global.media.musicId as string, true);
    currentTime.value = globalStore.global.media.currentTime;
  }
  audioPlayer.value.on(Events.TIME_UPDATE, onTimeUpdate);
  audioPlayer.value.on(Events.PLAY, () => paused.value = false);
  audioPlayer.value.on(Events.PAUSE, () => paused.value = true);

  document.addEventListener('keydown', handleKeyEvent, false);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyEvent, false);
});

const getMusicInfoFun = (musicId: string, isInit = false) => {
  shardingSize = parseInt(getData(SHARDING_SIZE) as string);
  // audioPlayer.value!.volume = globalStore.global.player.volume / 100;

  getMusicInfo(musicId as string).then(async response => {
    if (response.data) {
      shardingCount = Math.ceil(response.data.size / shardingSize);
      await playMusic(response.data);
      if (!isInit) {
        currentTime.value = 0;
        await handleEvent('play', null);
      }
    }
  });
}

watch(() => globalStore.global.media.musicId, (musicId) => {
  getMusicInfoFun(musicId);
});

const changeCurrentTime = async (e: any) => {
  seeking = false;
  await handleEvent('changeCurrentTime', e);
}

const updateTime = (e: any) => {
  seeking = true;
  handleEvent('updateTime', e);
}

const handleEvent = async (eventName: string, state: any) => {
  if (eventName === 'play') {
    paused.value = false;
    audioPlayer.value!.currentTime = currentTime.value;
    await audioPlayer.value!.play();
  } else if (eventName === 'pause') {
    paused.value = true;
    audioPlayer.value!.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value!.volume = state;
    globalStore.global.player.volume = Math.floor(state * 100);
  } else if (eventName === 'changeCurrentTime') {
    // const offset = state.offsetX;
    // const total = state.target.getBoundingClientRect().width;
    // currentPercentage.value = Math.min(offset / total * 100, 100);
    // progressData.percentage = currentPercentage.value;
    // currentTime.value = state / 100 * music.duration;
    audioPlayer.value!.currentTime = currentTime.value;
  } else if (eventName === 'updateTime') {
    currentTime.value = state / 100 * music.duration;
  }
};

let mediaSource: MediaSource;
let sourceBuffer: SourceBuffer;
let currentShard = 0;
const playMusic = async (musicInfo: MusicItemType) => {
  if (!musicInfo || (music && musicInfo.id === music.id)) {
    return;
  }
  Object.assign(music, musicInfo);
  audioPlayer.value!.src = music.link;
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

eventBus.on('playMusic', playMusic);

const getCover = computed(() => {
  return music?.cover ? music.cover : globalStore.global.defaultMusicCover;
});

const playOrPause = () => {
  if (music.id === null) {
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

const screenWidth = ref(0);

const setMobileVolume = () => {
  volume.value = 100;
  handleEvent('changeVolume', 1);
}

watch(volume, (newVolume) => {
  handleEvent('changeVolume', newVolume / 100);
});
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1rem 0 1rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, .04);
}
.player-wrapper {
  justify-content: space-between;

  .base-info {
    .cover {
      width: 4.25rem;
      height: 4.25rem;
      aspect-ratio: 1 / 1;
      border-radius: .25rem;
    }

    .music-info {
      padding: 0 10px;

      span {
        display: block;
        line-height: 1.5rem;
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

  .player {
    display: none;
  }
}

.button-group {
  width: 20vw;
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
    color: rgba(56, 56, 56, 1);
  }
}

@media (max-width: 800px) {
  .player-wrapper {
    padding: .5rem 0;

    .cover {
      width: 4rem;
      height: 4rem;
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

  .controls-wrapper {
    width: 30%;
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
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: var(--background-color-light);
  z-index: 1;

  .mobile-cover {
    width: 80%;
    aspect-ratio: 1 / 1;
    border-radius: 1rem;
    position: absolute;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .mobile-player-panel {
    padding: .5rem 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .mobile-button-group {
    width: 100%;
    margin: 1rem auto;
    align-items: center;
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
