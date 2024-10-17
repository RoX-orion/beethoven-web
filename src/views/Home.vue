<template>
  <Header/>
  <div class="flex-row">
    <Left/>
    <Right/>
  </div>

  <Player class="player" />
</template>

<script setup lang="ts">
import Header from './header/Header.vue';
import Left from './left/Left.vue';
import Right from './right/Right.vue'
import Player from './player/Player.vue';
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
