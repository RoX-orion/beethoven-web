<template>
  <div class="player">
    <div class="progress-mobile">
      <div style="width: 100%; position: relative; margin: auto">
        <Progress :data="progressData" @mousedown="changeCurrentTime"/>
        <div class="seek-line pointer" :style="{left: calculateProgress + '%'}"></div>
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
          <span>{{ music.name }}</span>
          <span class="info-font">{{ music.singer }}</span>
        </div>
      </div>

      <div class="flex-col controls-wrapper">
        <div class="button-group flex-row">
          <IconButton icon-name="prev"/>
          <IconButton v-if="audioPlayer?.paused" icon-name="pause" @click="playOrPause"/>
          <IconButton v-else icon-name="play" @click="playOrPause"/>
          <IconButton icon-name="next"/>
        </div>
        <div class="flex-row progress">
          <div class="time">{{ durationFormater(Math.floor(currentTime)) }}</div>
          <div style="width: 100%; position: relative; margin: auto">
            <Progress :data="progressData" @mousedown="changeCurrentTime"/>
            <div class="seek-line pointer" :style="{left: calculateProgress + '%'}"></div>
          </div>
          <div class="time" v-if="music.duration">{{ durationFormater(music.duration) }}</div>
        </div>
      </div>

      <Panel @update="handleEvent"/>
      <audio class="player" ref="audioPlayer" controls></audio>
    </div>
  </div>

</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
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

const audioPlayer = ref<HTMLAudioElement>();
const music: MusicItemType = reactive({
  id: null,
  duration: 0,
  mime: '',
  link: '',
});
let firstPlay = true;
let shardingSize: number;
let shardingCount: number;
const globalStore = useGlobalStore();

onMounted(() => {
  let route = useRoute();
  const { id, type } = route.params;
  if (type === 'music' && id) {
    getMusicInfoFun(id as string);
  }
  audioPlayer.value!.addEventListener('timeupdate', onTimeUpdate);
  audioPlayer.value!.addEventListener('waiting', () => {
    console.log('waiting');
  });
});

const getMusicInfoFun = (musicId: string) => {
  shardingSize = parseInt(getData(SHARDING_SIZE) as string);
  audioPlayer.value!.volume = globalStore.global.player.volume / 100;

  getMusicInfo(musicId as string).then(async response => {
    if (response.data) {
      shardingCount = Math.ceil(response.data.size / shardingSize);
      console.log('count', shardingCount);
      await playMusic(response.data);
      firstPlay = false;
    }
  });
}

watch(() => globalStore.global.media.musicId, (musicId) => {
  console.log('change', musicId);

  getMusicInfoFun(musicId);
});

const handleEvent = (eventName: string, ...state: any) => {
  if (eventName === 'play') {
    audioPlayer.value!.currentTime = currentTime.value;
    audioPlayer.value!.play();
  } else if (eventName === 'pause') {
    audioPlayer.value!.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value!.volume = state;
  } else if (eventName === 'changeCurrentTime') {
    audioPlayer.value!.currentTime = state;
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
  // mediaSource = new MediaSource();
  // audioPlayer.value!.src = URL.createObjectURL(mediaSource);
  // mediaSource.addEventListener('sourceopen', async () => {
  //   await fetchMusic(musicInfo?.link!, 0, shardingSize);
  // });
}
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
  currentTime.value = audioPlayer.value!.currentTime;
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
    handleEvent('play');
  } else {
    handleEvent('pause');
  }
}

const progressData: ProgressType = reactive({
  width: '100%',
  height: '5px',
  radius: '0.156rem',
  percentage: 0,
});

let current = 0;
const calculateProgress = computed(() => {
  current = Math.min(currentTime.value / music.duration * 100, 100);
  progressData.percentage = current;
  return current;
});

const changeCurrentTime = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  handleEvent('changeCurrentTime', offset / total * music.duration);
}
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
    line-height: 2rem;
    padding: 0 .5rem;
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
}

@media (min-width: 801px) {
  .progress-mobile {
    display: none;
  }
}
</style>
