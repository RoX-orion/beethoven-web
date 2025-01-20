<template>
  <Header/>
  <div class="flex-row left-right">
    <Left/>
    <Right/>
  </div>

  <Player/>
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
  height: calc(100vh - 11rem);
  margin: 0 1rem;
}

@media (max-width: 800px) {
  .left-right {
    height: calc(100dvh - 12rem);
  }
}
</style>
