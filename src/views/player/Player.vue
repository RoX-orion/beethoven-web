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
import { useRoute } from 'vue-router';

const audioPlayer = ref();
const music = ref<MusicItemType>({});
let firstPlay = true;

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
      // 等待 sourceBuffer 处理完之前的片段后再加载下一个片段
      await new Promise((resolve) => {
        sourceBuffer.addEventListener('updateend', resolve, { once: true });
      });
    }
    mediaSource.endOfStream();
  });
}
eventBus.on('playMusic', playMusic);
onMounted(() => {
  let route = useRoute();
  const { id, type } = route.params;
  if (type === 'music' && id) {
    getMusicInfo(id).then(async response => {
      if (response.data) {
        playMusic(response.data);
        firstPlay = false;
      }
    });
  }
});
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
