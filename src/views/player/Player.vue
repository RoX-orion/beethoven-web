<template>
  <div class="player">
    <div class="progress-mobile">
      <div style="width: 100%; position: relative; margin: auto">
        <Progress :data="progressData" />
<!--        <div class="seek-line pointer" :style="{left: calculateProgress + '%'}"></div>-->
      </div>
      <div class="flex-row content-space-between" style="width: 100%">
        <div>{{ durationFormater(Math.floor(currentTime)) }}</div>
        <div v-if="music.duration">{{ durationFormater(music.duration) }}</div>
      </div>
    </div>

    <div class="player-wrapper flex-row content-space-between">
      <div class="flex-row pointer">
        <img class="cover" :src="getCover" alt="cover">
        <div class="music-info">
          <span class="music-name">{{ music.name }}</span>
          <span class="grey">{{ music.singer }}</span>
        </div>
      </div>

      <div class="flex-col controls-wrapper">
        <div class="button-group flex-row">
          <IconButton icon-name="prev"/>
          <IconButton v-if="audioPlayer?.paused" icon-name="pause" @click="playOrPause"/>
          <IconButton v-else icon-name="play" @click="playOrPause"/>
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
                    @click="changeMute"/>
          <svg-icon class="sound-button pointer" v-else name="volume-on" size="1.5rem" @click="changeMute"/>
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
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { MusicItemType, ProgressType } from '@/types/global';
import eventBus from '@/util/eventBus';
import { getMusicInfo } from '@/api/music';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '@/store/global';
import { durationFormater } from '@/util/time';
import IconButton from '@/components/IconButton.vue';
import Progress from '@/components/Progress.vue';
import { SHARDING_SIZE } from '@/config';
import { getData } from '@/util/localStorage';
import { throttle } from '@/util/schedulers';
import SvgIcon from '@/components/SvgIcon.vue';
import { storeToRefs } from 'pinia';
import { initGlobal } from '@/lib/init';
import Player from "xgplayer/es/player";
import { Events } from 'xgplayer'

const audioPlayer = ref<any>();
const music: MusicItemType = reactive({
  id: null,
  duration: 0,
  mime: '',
  link: '',
});
let firstPlay = true;
let shardingSize: number;
let shardingCount: number;
let seeking = false;
const globalStore = useGlobalStore();
const currentPercentage = ref(0);

onMounted(() => {
  audioPlayer.value = new Player({
    id: 'audioPlayer',
    mediaType: 'audio',
    url: '',
    height: '100%',
    width: '100%',
    volume: 0.5
  });

  let route = useRoute();
  const { id, type } = route.params;
  if (type === 'music' && id) {
    getMusicInfoFun(id as string);
  }
  audioPlayer.value.on(Events.TIME_UPDATE, onTimeUpdate);
  // audioPlayer.value.on(Events.SEEKING, () => {
  //   seeking = true;
  // });
  // audioPlayer.value.on(Events.SEEKED, () => {
  //   seeking = false;
  // });
  // audioPlayer.value!.addEventListener('timeupdate', onTimeUpdate);
  // audioPlayer.value!.addEventListener('waiting', () => {
  //   console.log('waiting');
  // });
});

const getMusicInfoFun = (musicId: string) => {
  shardingSize = parseInt(getData(SHARDING_SIZE) as string);
  audioPlayer.value!.volume = globalStore.global.player.volume / 100;

  getMusicInfo(musicId as string).then(async response => {
    if (response.data) {
      shardingCount = Math.ceil(response.data.size / shardingSize);
      await playMusic(response.data);
      firstPlay = false;
    }
  });
}

watch(() => globalStore.global.media.musicId, (musicId) => {
  getMusicInfoFun(musicId);
});

const changeCurrentTime = (e: any) => {
  seeking = false;
  handleEvent('changeCurrentTime', e);
}

const updateTime = (e: any) => {
  seeking = true;
  handleEvent('updateTime', e);
}

const handleEvent = (eventName: string, state: any) => {
  if (eventName === 'play') {
    audioPlayer.value!.currentTime = currentTime.value;
    audioPlayer.value!.play();
  } else if (eventName === 'pause') {
    audioPlayer.value!.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value!.volume = state;
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
  if (!musicInfo || (!firstPlay && music && musicInfo.id === music.id)) {
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
  if (audioPlayer.value?.paused) {
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

// const updatingCurrentTime = ref(false);
// audioPlayer.value!.addEventListener('mousedown', (e) => {
//   updatingCurrentTime.value = true;
//   handleEvent('changeCurrentTime', e);
//   e.preventDefault();
// });
//
// document.addEventListener('mousemove', (e) => {
//   if (updatingCurrentTime.value) {
//     handleEvent('changeCurrentTime', e);
//   }
// });
//
// document.addEventListener('mouseup', () => {
//   updatingCurrentTime.value = false;
// });

const volumeProgressData: ProgressType = reactive({
  width: '10rem',
  height: '5px',
  radius: '0.556rem',
  percentage: 10,
});

let volume = ref(10);
const { global } = storeToRefs(globalStore);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  setMobileVolume();
  if (!global) {
    initGlobal();
  } else {
    volume.value = global.value.player.volume;
  }
});

const changeMute = () => {
  if (volume.value === 0) {
    volume.value = global.value.player.volume;
  } else {
    global.value.player.volume = volume.value;
    volume.value = 0;
  }
}

const saveVolume = () => {
  // volume
}

const changeVolume = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  volume.value = Math.floor(offset / total * 100);
  global.value.player.volume = volume.value;
  volumeProgressData.percentage = volume.value;
}

const screenWidth = ref(0);
window.addEventListener('resize', function () {
  screenWidth.value = window.innerWidth;
  setMobileVolume();
});

const setMobileVolume = () => {
  if (screenWidth.value <= 800) {
    volume.value = 100;
    handleEvent('changeVolume', 1);
  }
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
}
.player-wrapper {
  justify-content: space-between;
  padding: 1rem;

  .cover {
    width: 4.25rem;
    height: 100%;
    border-radius: .25rem;
  }

  .music-info {
    padding: 0 10px;
    margin: auto;

    span {
      display: block;
      line-height: 1.5rem;
    }
  }

  .player {
    display: none;
  }
}

.controls-wrapper {
  width: 40vw;
  margin: auto;
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

.progress-mobile {
  margin: 0 .5rem;
}

@media (max-width: 800px) {
  .player-wrapper {
    padding: .5rem;

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
}

@media (min-width: 801px) {
  .progress-mobile {
    display: none;
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
</style>
