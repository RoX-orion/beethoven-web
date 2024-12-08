<template>
  <div class="player-wrapper flex-row">
    <div class="flex-row pointer">
      <img class="cover" :src="getCover" alt="cover"/>
      <div class="music-info">
        <span>{{ music.name }}</span>
        <span class="info-font">{{ music.singer }}</span>
      </div>
    </div>

    <div class="flex-col controls-wrapper">
      <div class="button-group flex-row">
        <IconButton icon-name="prev"/>
        <IconButton v-if="play" icon-name="play" @click="playOrPause"/>
        <IconButton v-else icon-name="pause" @click="playOrPause"/>
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
</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
import { computed, onMounted, reactive, ref } from 'vue';
import type { MusicItemType, ProgressType } from '@/types/global';
import eventBus from '@/util/eventBus';
import { getMusicInfo } from '@/api/music';
import { useRoute } from 'vue-router';
import { useSettingStore } from '@/store/global';
import { durationFormater } from '@/util/time';
import IconButton from '@/components/IconButton.vue';
import Progress from '@/components/Progress.vue';

const audioPlayer = ref();
const music = ref<MusicItemType>({});
let firstPlay = true;

const handleEvent = (eventName: string, state: any) => {
  if (eventName === 'play' && state) {
    audioPlayer.value.currentTime = currentTime.value;
    audioPlayer.value.play();
  } else if (eventName === 'play' && !state) {
    audioPlayer.value.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value.volume = state;
  } else if (eventName === 'changeCurrentTime') {
    console.log('state', state);
    audioPlayer.value.currentTime = state;
  }
};

const playMusic = (musicInfo: MusicItemType) => {
  if (!musicInfo || (!firstPlay && music && musicInfo.id === music.value.id)) {
    return;
  }
  Object.assign(music.value, musicInfo);
  let mediaSource = new MediaSource();
  audioPlayer.value.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', async () => {
    const sourceBuffer = mediaSource.addSourceBuffer(music.value.mime);
    const audioChunks: string[] = [
      music.value.link,
    ];

    for (const chunkUrl of audioChunks) {
      const response = await fetch(chunkUrl, {
        method: 'get',
        // headers: {
        //   'Range': `bytes=${0}-${1024 * 100}`
        // }
      });
      const chunkData = await response.arrayBuffer();
      sourceBuffer.appendBuffer(chunkData);
      await new Promise((resolve) => {
        sourceBuffer.addEventListener('updateend', resolve, { once: true });
      });
    }
    mediaSource.endOfStream();
  });
}
eventBus.on('playMusic', playMusic);

let currentTime = ref<number>(0);
const onTimeUpdate = () => {
  currentTime.value = audioPlayer.value.currentTime;
};

const settingStore = useSettingStore();
const getCover = computed(() => {
  return music.value.cover ? music.value.cover : settingStore.setting.player.defaultMusicCover;
});
onMounted(() => {
  audioPlayer.value.volume = settingStore.setting.player.volume / 100;
  let route = useRoute();
  const { id, type } = route.params;
  if (type === 'music' && id) {
    getMusicInfo(id as string).then(async response => {
      if (response.data) {
        playMusic(response.data);
        firstPlay = false;
      }
    });
  }
  audioPlayer.value.addEventListener('timeupdate', onTimeUpdate);
});

const play = ref(false);
const playOrPause = () => {
  play.value = !play.value;
  handleEvent('play', play.value);
}

const progressData: ProgressType = reactive({
  width: '100%',
  height: '5px',
  radius: '0.156rem',
  percentage: 0,
});

const calculateProgress = computed(() => {
  let current = currentTime.value / music.value.duration * 100;
  progressData.percentage = current;
  return current;
});

const changeCurrentTime = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  handleEvent('changeCurrentTime', offset / total * music.value.duration);
}
</script>

<style lang="scss" scoped>
.player-wrapper {
  justify-content: space-between;
  padding: .75rem 1rem;

  .cover {
    width: 4rem;
    height: 4rem;
    border-radius: 4px;
  }

  .music-info {
    padding: 0 10px;

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
</style>
