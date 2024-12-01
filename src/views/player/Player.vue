<template>
  <div class="player-wrapper flex-row">
    <div class="flex-row pointer">
      <img class="cover" :src="music?.cover" alt="cover"/>
      <div class="music-info">
        <span>{{ music?.name }}</span>
        <span class="info-font">{{ music?.singer }}</span>
      </div>
    </div>
    <PlayerControls
      :duration="music?.duration"
      class="player-controls"
      @update="updateState"/>
    <Panel @update="updateState"/>
    <audio class="player" ref="audioPlayer" controls></audio>
  </div>
</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
import PlayerControls from '@/views/player/PlayerControls.vue';
import { onMounted, ref } from 'vue';
import type { MusicItemType } from '@/types/global';
import eventBus from '@/util/eventBus';
import { getMusicInfo } from '@/api/music';
import { useRouteStore } from '@/store/global';

const audioPlayer = ref();
let music: MusicItemType;

const updateState = (eventName: string, state: any) => {
  if (eventName === 'play' && state) {
    audioPlayer.value.play();
  } else if (eventName === 'play' && !state) {
    audioPlayer.value.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value.volume = state;
  }
};

const playMusic = (musicInfo: MusicItemType) => {
  if (music && musicInfo.id === music.id) {
    return;
  }
  music = musicInfo;
  let mediaSource = new MediaSource();
  audioPlayer.value.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', async () => {
    const sourceBuffer = mediaSource.addSourceBuffer(music.mime);
    const audioChunks: string[] = [
      music.link,
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
      // 等待 sourceBuffer 处理完之前的片段后再加载下一个片段
      await new Promise((resolve) => {
        sourceBuffer.addEventListener('updateend', resolve, { once: true });
      });
    }
    mediaSource.endOfStream();
  });
}
eventBus.on('playMusic', playMusic);
let routeStore = useRouteStore();
onMounted(() => {
  if (routeStore.type === 'music' && routeStore.id) {
    getMusicInfo(routeStore.id).then(response => {
      if (response.data) {
        music = response.data;
      }
    });
  }
})
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

  .player-controls {
    max-width: 50vw;
  }

  .player {
    display: none;
  }
}
</style>
