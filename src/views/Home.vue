<template>
  <div class="home-page">
    <Header/>
    <main class="flex-row left-right">
      <Left v-if="getData(TOKEN)"/>
      <Middle/>
    </main>
    <Player/>
  </div>
</template>

<script setup lang="ts">
import Header from './header/Header.vue';
import Left from './left/Left.vue';
import Middle from '@/views/middle/Middle.vue'
import { useGlobalStore, useRouteStore } from '@/store/global';
import { defineAsyncComponent, onMounted } from 'vue';
import { getData } from "@/util/localStorage";
import { TOKEN } from "@/config";

const Player = defineAsyncComponent(() => import('./player/Player.vue'));

const props = defineProps({
  type: String,
  id: String,
});
const routeStore = useRouteStore();
onMounted(() => {
  routeStore.id = props.id;
  routeStore.type = props.type;
});

const globalStore = useGlobalStore();
// watch(() => globalStore.global.windowWidth, windowWidth => {
//   if (windowWidth <= 800) {
//     let dom = document.getElementsByClassName("left-right");
//     console.log(dom);
//   }
// });

const setStyle = () => {

}
</script>

<style lang="scss" scoped>
.home-page {
  --player-safe-space: 8.25rem;
  --content-player-gap: 1.25rem;

  min-height: 100dvh;
  padding: .9rem 1rem calc(var(--player-safe-space) + var(--content-player-gap));
}

.left-right {
  gap: .9rem;
  justify-content: space-between;
  height: calc(100dvh - 4.5rem - .9rem - var(--player-safe-space) - var(--content-player-gap));
  min-height: 0;
  width: min(100%, 98rem);
  margin: .9rem auto 0;
}

@media (max-width: 800px) {
  .home-page {
    --player-safe-space: 7.4rem;
    --content-player-gap: 1rem;

    padding: .55rem .55rem calc(var(--player-safe-space) + var(--content-player-gap));
  }

  .left-right {
    height: calc(100dvh - 3.9rem - .65rem - var(--player-safe-space) - var(--content-player-gap));
    margin-top: .65rem;
    gap: 0;
  }
}
</style>
