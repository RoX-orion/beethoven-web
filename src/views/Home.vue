<template>
  <Header/>
  <div class="flex-row left-right">
    <Left v-if="getData(TOKEN)"/>
    <Middle/>
  </div>
  <Player/>
</template>

<script setup lang="ts">
import Header from './header/Header.vue';
import Left from './left/Left.vue';
import Middle from '@/views/middle/Middle.vue'
import Player from './player/Player.vue';
import { useGlobalStore, useRouteStore } from '@/store/global';
import { onMounted } from 'vue';
import { getData } from "@/util/localStorage";
import { TOKEN } from "@/config";

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
.left-right {
  justify-content: space-between;
  height: calc(100vh - 11rem);
  //margin: 0 1rem;
}

@media (max-width: 800px) {
  .left-right {
    height: calc(100dvh - 12rem);
  }
}
</style>
