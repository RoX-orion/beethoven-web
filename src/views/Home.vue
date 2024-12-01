<template>
  <Header/>
  <div class="flex-row left-right">
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
import { useRouteStore } from '@/store/global';
import { onMounted } from 'vue';

const props = defineProps({
  type: String,
  id: String,
});
const routeStore = useRouteStore();
onMounted(() => {
  routeStore.id = props.id;
  routeStore.type = props.type;
});
</script>

<style lang="scss" scoped>
.left-right {
  justify-content: space-between;
  height: 80vh;
  margin: 0 1rem;
}
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
