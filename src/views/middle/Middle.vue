<template>
  <div
    ref="middleWrapper"
    class="middle-wrapper custom-scroll"
    :class="{ 'is-pulling': pullDistance > 0 || refreshing }"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div class="pull-refresh-indicator" :class="{ refreshing }">
      <span class="pull-refresh-spinner"/>
      <span>{{ pullRefreshText }}</span>
    </div>
    <div class="middle-content" :style="middleContentStyle">
      <RouterView/>
      <PlayListGroup v-if="componentState.currentMiddleComponent === ComponentType.DEFAULT"/>
      <SearchResult v-else-if="componentState.currentMiddleComponent === ComponentType.SEARCH_RESULT"/>
      <PlayListInfo v-else-if="componentState.currentMiddleComponent === ComponentType.PLAYLIST"/>
      <VideoPlayer v-else-if="componentState.currentMiddleComponent === ComponentType.VIDEO_PLAYER"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, ref } from 'vue';
import PlayListGroup from './PlayListGroup.vue';
import SearchResult from './SearchResult.vue';
import { ComponentType } from '@/types/global';
import PlayListInfo from '@/views/middle/PlayListInfo.vue';
import { componentState } from '@/store/componentState';
import VideoPlayer from '@/views/player/VideoPlayer.vue';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();
const middleWrapper = ref<HTMLElement>();
const trackingPull = ref(false);
const startY = ref(0);
const pullDistance = ref(0);
const refreshing = ref(false);

const triggerDistance = 68;
const maxPullDistance = 96;
const refreshingDistance = 56;

const pullRefreshText = computed(() => {
  if (refreshing.value) {
    return '正在刷新';
  }
  return pullDistance.value >= triggerDistance ? '松开刷新' : '下拉刷新';
});

const middleContentStyle = computed<CSSProperties>(() => {
  const distance = refreshing.value ? refreshingDistance : pullDistance.value;
  return distance > 0 ? { transform: `translate3d(0, ${distance}px, 0)` } : {};
});

const canStartPull = () => {
  return globalStore.global.mobile && !refreshing.value && (middleWrapper.value?.scrollTop ?? 0) <= 0;
};

const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1 || !canStartPull()) {
    return;
  }

  trackingPull.value = true;
  startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!trackingPull.value || event.touches.length !== 1) {
    return;
  }

  const offsetY = event.touches[0].clientY - startY.value;
  if (offsetY <= 0) {
    pullDistance.value = 0;
    return;
  }

  if ((middleWrapper.value?.scrollTop ?? 0) > 0) {
    trackingPull.value = false;
    pullDistance.value = 0;
    return;
  }

  event.preventDefault();
  pullDistance.value = Math.min(maxPullDistance, offsetY * 0.48);
};

const handleTouchEnd = () => {
  if (!trackingPull.value) {
    return;
  }

  trackingPull.value = false;
  if (pullDistance.value < triggerDistance) {
    pullDistance.value = 0;
    return;
  }

  refreshing.value = true;
  pullDistance.value = 0;

  window.setTimeout(() => {
    window.location.reload();
  }, 180);
};
</script>

<style scoped lang="scss">
.middle-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
  background: var(--surface-color);
  box-shadow: var(--surface-shadow);
  backdrop-filter: blur(1.25rem);
  overscroll-behavior-y: contain;
}

.middle-content {
  min-height: 100%;
  transition: transform .18s ease;
  will-change: transform;
}

.middle-wrapper.is-pulling .middle-content {
  transition: transform .08s ease-out;
}

.pull-refresh-indicator {
  position: absolute;
  top: .75rem;
  left: 50%;
  z-index: 2;
  display: none;
  align-items: center;
  gap: .45rem;
  height: 2.1rem;
  padding: 0 .85rem;
  border: 1px solid rgba(105, 117, 134, .18);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: .82rem;
  background: rgba(255, 255, 255, .86);
  box-shadow: 0 .45rem 1rem rgba(32, 53, 77, .12);
  transform: translate(-50%, -120%);
  transition: transform .18s ease, opacity .18s ease;
  opacity: 0;
  pointer-events: none;
}

.middle-wrapper.is-pulling .pull-refresh-indicator {
  transform: translate(-50%, 0);
  opacity: 1;
}

.pull-refresh-spinner {
  width: .85rem;
  height: .85rem;
  border: 2px solid rgba(105, 117, 134, .24);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
}

.pull-refresh-indicator.refreshing .pull-refresh-spinner {
  animation: pull-refresh-spin .72s linear infinite;
}

@keyframes pull-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {
  .pull-refresh-indicator {
    display: flex;
  }
}
</style>
