<template>
<!--  <img src="" alt="cover">-->
  <div class="player-wrapper flex-row">
    <div class="flex-row pointer">
      <img class="cover" src="http://sl3btfsle.hb-bkt.clouddn.com/cover/cover.png" alt="cover" />
      <div class="music-info">
        <span>天空之城</span>
        <span class="singer">李志</span>
      </div>
    </div>
    <PlayerControls class="player-controls"/>
    <Panel/>
  </div>
<!--  <audio autoplay>-->
<!--    <source src="http://sl3btfsle.hb-bkt.clouddn.com/rain.mp3">-->
<!--  </audio>-->
</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
import PlayerControls from '@/views/player/PlayerControls.vue';
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

    .singer {
      font-size: var(--info-font-size);
      color: gray;
    }
  }

  .player-controls {
    max-width: 50vw;
  }
}
</style>
