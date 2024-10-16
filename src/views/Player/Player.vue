<template>
<!--  <img src="" alt="cover">-->
  <div class="player-container flex-row">
    <div class="flex-row">
      <img class="cover" src="http://sl3btfsle.hb-bkt.clouddn.com/cover/cover.png" alt="cover" />
      <div class="music-info">
        <span>天空之城</span>
        <span class="singer">李志</span>
      </div>
    </div>
    <div class="flex-col">
      <div>
<!--        <svg-icon name=""/>-->
<!--        <button>-->

<!--        </button>-->
      </div>
    </div>
    <Panel/>
  </div>
<!--  <audio autoplay>-->
<!--    <source src="http://sl3btfsle.hb-bkt.clouddn.com/rain.mp3">-->
<!--  </audio>-->
</template>

<script setup lang="ts">
import Panel from "./Panel.vue";
</script>

<style lang="scss" scoped>
.player-container {
  justify-content: space-between;
  padding: .5rem 1rem;

  .music-info {
    padding: 10px;

    span {
      display: block;
      line-height: 1.5rem;
    }

    .singer {
      font-size: 14px;
      color: gray;
    }
  }
}

.cover {
  width: 4rem;
  height: 4rem;
  border-radius: 4px;
}
</style>
