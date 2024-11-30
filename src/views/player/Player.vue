<template>
<!--  <img src="" alt="cover">-->
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
<!--  <audio autoplay>-->
<!--    <source src="http://sl3btfsle.hb-bkt.clouddn.com/rain.mp3">-->
<!--  </audio>-->
</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
import PlayerControls from '@/views/player/PlayerControls.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import type { ControlButton, MusicItemType } from '@/types/global';
import eventBus from '@/util/eventBus';

// Step 1: 创建 MediaSource 并将其绑定到 audio 元素
const audioPlayer = ref();
const music = ref<MusicItemType>();
const mediaSource = new MediaSource();
const controlButton: ControlButton = reactive({});
const updateState = (eventName: string, state: any) => {
  if (eventName === 'play' && state) {
    audioPlayer.value.play();
  } else if (eventName === 'play' && !state) {
    audioPlayer.value.pause();
  } else if (eventName === 'changeVolume') {
    audioPlayer.value.volume = state;
  }
};
watch(music, (newValue) => {
  fetchMusic(newValue as MusicItemType);
}, {
  deep: true,
});

const fetchMusic = (music: MusicItemType) => {
  console.log(music);
  audioPlayer.value.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', async () => {
    console.log(music.mime);
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
onMounted( async () => {
  // const response = await fetch('http://127.0.0.1:1313/test/file', {
  //   method: 'post',
  //   headers: {
  //     'Range': `bytes=${0}-${1024 * 512}`
  //   }
  // });
  // console.log('buffer', response.arrayBuffer().then(response => {
  //   console.log(response);
  // }));
});

const play = () => {
  audioPlayer.value.play();
}

const playMusic = (musicInfo: MusicItemType) => {
  music.value = musicInfo;
}
eventBus.on('playMusic', playMusic);

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
