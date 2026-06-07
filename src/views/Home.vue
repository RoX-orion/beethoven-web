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
  min-height: 100dvh;
  padding: .85rem 1rem 7rem;
}

.left-right {
  gap: 1rem;
  justify-content: space-between;
  height: calc(100dvh - 14rem);
  width: min(100%, 98rem);
  margin: .85rem auto 0;
}

@media (max-width: 800px) {
  .home-page {
    padding: .55rem .55rem 6.75rem;
  }

  .left-right {
    height: calc(100dvh - 13rem);
    margin-top: .65rem;
  }
}
</style>
