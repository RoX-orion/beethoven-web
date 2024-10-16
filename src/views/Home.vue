<template>
  <Header/>
  <Player class="player" />
</template>

<script setup lang="ts">
import Header from "./Header.vue";
import Player from './Player/Player.vue';
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
