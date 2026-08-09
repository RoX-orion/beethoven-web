<template>
  <div class="queue-panel">
    <div class="queue-toolbar">
      <div>
        <p class="queue-title">正在播放</p>
        <p class="queue-subtitle">{{ playQueueStore.queue.items.length }} 首歌曲</p>
      </div>
      <div class="queue-actions">
        <button v-if="playQueueStore.queue.items.length > 0" class="queue-clear" type="button"
                @click="playQueueStore.clear">
          清空
        </button>
        <button v-if="showClose" class="queue-close" type="button" aria-label="关闭播放队列" @click="emit('close')">
          <svg-icon name="close" size="1rem"/>
        </button>
      </div>
    </div>

    <div v-if="playQueueStore.queue.items.length === 0" class="empty-state">
      播放队列为空
    </div>
    <div v-else class="queue-list">
      <div
          v-for="entry in orderedItems"
          :key="entry.item.queueItemId"
          :class="['queue-row', { active: entry.index === playQueueStore.queue.currentIndex }]"
          @click="playItem(entry.index)">
        <img class="queue-cover" :src="getCover(entry.item.music.cover)" alt="" @error="useFallbackCover"/>
        <div class="queue-info">
          <p>{{ entry.item.music.name }}</p>
          <span>{{ entry.item.music.singer }}</span>
        </div>
        <button class="queue-remove" type="button" @click.stop="playQueueStore.remove(entry.item.queueItemId)">
          移除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGlobalStore} from '@/store/global';
import {usePlayQueueStore} from '@/store/playQueue';
import {computed} from 'vue';

defineProps<{
  showClose?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const globalStore = useGlobalStore();
const playQueueStore = usePlayQueueStore();
const fallbackCover = '/assets/img/playlistCover.png';

/** 将队列按播放顺序排列：当前播放的排在最上面，接着是后续歌曲，最后是已播放的 */
const orderedItems = computed(() => {
  const items = playQueueStore.queue.items;
  const currentIndex = playQueueStore.queue.currentIndex;
  if (items.length === 0 || currentIndex < 0) {
    return items.map((item, idx) => ({item, index: idx}));
  }
  // 从 currentIndex 开始，先展示当前及后续歌曲，再展示已播放的
  const result: { item: (typeof items)[0]; index: number }[] = [];
  for (let i = currentIndex; i < items.length; i++) {
    result.push({item: items[i], index: i});
  }
  for (let i = 0; i < currentIndex; i++) {
    result.push({item: items[i], index: i});
  }
  return result;
});

const playItem = (index: number) => {
  globalStore.global.canPlay = true;
  playQueueStore.playAt(index);
};

const getCover = (cover?: string) => {
  return cover || globalStore.global.defaultMusicCover || fallbackCover;
};

const useFallbackCover = (event: Event) => {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(fallbackCover)) return;
  image.src = fallbackCover;
};
</script>

<style scoped lang="scss">
.queue-panel {
  display: flex;
  flex-direction: column;
  gap: .85rem;
  height: 100%;
  min-height: 0;
}

.queue-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.queue-actions {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
}

.queue-title {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 800;
}

.queue-subtitle {
  color: var(--text-secondary);
  font-size: .8rem;
}

.queue-list {
  display: grid;
  gap: .35rem;
  max-height: 100%;
  min-height: 0;
  overflow-y: auto;
}

.queue-row {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: center;
  gap: .65rem;
  padding: .45rem .35rem;
  border-radius: .55rem;
  cursor: pointer;

  &:hover,
  &.active {
    background: rgba(55, 125, 255, .1);
  }
}

.queue-cover {
  width: 3rem;
  height: 3rem;
  border-radius: .45rem;
  object-fit: cover;
}

.queue-info {
  min-width: 0;

  p,
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    color: var(--text-primary);
    font-weight: 700;
  }

  span {
    color: var(--text-secondary);
    font-size: .8rem;
  }
}

.queue-remove,
.queue-clear,
.queue-close {
  padding: .25rem .45rem;
  border: 0;
  border-radius: .35rem;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;

  &:hover {
    color: var(--brand-primary);
    background: rgba(55, 125, 255, .1);
  }
}

.queue-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.empty-state {
  padding: 1.25rem 0;
  color: var(--text-secondary);
  text-align: center;
}
</style>
