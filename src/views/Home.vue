<template>
  <div class="home-page">
    <Header/>
    <main class="flex-row left-right-right">
      <Left v-if="getData(TOKEN)"/>
      <Middle/>
      <div v-if="!globalStore.global.mobile" class="right-wrapper">
        <QueuePanel
          v-if="globalStore.global.showQueue"
          show-close
          @close="globalStore.global.showQueue = false"
        />
        <NowPlayingPanel v-else/>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './header/Header.vue';
import Left from './left/Left.vue';
import Middle from '@/views/middle/Middle.vue'
import { useGlobalStore } from '@/store/global';
import { onMounted } from 'vue';
import { getData } from "@/util/localStorage";
import { TOKEN } from "@/config";
import QueuePanel from '@/views/player/QueuePanel.vue';
import NowPlayingPanel from '@/views/player/NowPlayingPanel.vue';

const props = defineProps({
  type: String,
  id: String,
});

onMounted(() => {
  console.log('token', getData(TOKEN));
});

const globalStore = useGlobalStore();
</script>

<style lang="scss" scoped>
.home-page {
  --player-safe-space: 8.25rem;
  --content-player-gap: 1.25rem;

  min-height: 100dvh;
  padding: .9rem 1rem calc(var(--player-safe-space) + var(--content-player-gap));
}

.left-right-right {
  gap: .75rem;
  justify-content: flex-start;
  flex: 1;
  height: calc(100dvh - 4.5rem - .9rem - var(--player-safe-space) - var(--content-player-gap));
  min-height: 0;
  width: 100%;
  margin: .9rem auto 0;
}

.left-wrapper {
  flex-shrink: 0;
  width: var(--left-width);
}

.middle-wrapper {
  flex: 1;
  min-width: 0;
}

.right-wrapper {
  flex-shrink: 0;
  width: var(--right-width);
  padding: var(--base-padding);
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  background: var(--surface-color);
  box-shadow: var(--surface-shadow);
  backdrop-filter: blur(1.25rem);
  overflow: hidden;
  overflow-y: auto;
}

@media (max-width: 800px) {
  .home-page {
    --player-safe-space: 7.4rem;
    --content-player-gap: 1rem;

    padding: .55rem .55rem calc(var(--player-safe-space) + var(--content-player-gap));
  }

  .left-right-right {
    height: calc(100dvh - 3.9rem - .65rem - var(--player-safe-space) - var(--content-player-gap));
    margin-top: .65rem;
    gap: 0;
  }

  .right-wrapper {
    display: none;
  }
}
</style>