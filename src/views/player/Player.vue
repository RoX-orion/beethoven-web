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
import { onMounted, reactive, ref } from 'vue';
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

  // 你可以直接操作这个 DOM 元素
  audioPlayer.value.src = URL.createObjectURL(mediaSource);

  // Step 2: 当 MediaSource 准备好时，添加 SourceBuffer
  mediaSource.addEventListener('sourceopen', async () => {
    // Step 3: 创建 SourceBuffer 并设置 MIME 类型（例如音频的类型）
    const mimeType = 'audio/mpeg'; // AAC 编码的 MP4 音频
    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);

    // 模拟从服务器获取音频块数据
    const audioChunks: any = [
      // 'http://sl3btfsle.hb-bkt.clouddn.com/music/dingxi.mp3',
      // 'http://127.0.0.1:45678/test/file',
      // ...可以有更多的音频块
    ];

    for (const chunkUrl of audioChunks) {
      // 使用 fetch 请求获取每个音频片段的数据
      const response = await fetch(chunkUrl, {
        method: 'get',

        // headers: {
        //   'Range': `bytes=${0}-${1024 * 100}`
        // }
      });
      const chunkData = await response.arrayBuffer();

      // Step 4: 向 SourceBuffer 中追加数据
      sourceBuffer.appendBuffer(chunkData);

      // 等待 sourceBuffer 处理完之前的片段后再加载下一个片段
      await new Promise((resolve) => {
        sourceBuffer.addEventListener('updateend', resolve, {once: true});
      });
    }

    // Step 5: 所有片段加载完毕后关闭 MediaSource
    mediaSource.endOfStream();
  });
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
