<template>
  <div class="menu-item pointer" :class="{ active: isActive }">
    <div class="icon-badge">
      <span>{{ iconText }}</span>
    </div>
    <div class="copy">
      <p class="title">{{ menu.meta?.title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';

const props = defineProps<{
  menu: RouteRecordRaw
}>();

const route = useRoute();

const isActive = computed(() => route.path === `/manage/${props.menu.path}`);

const iconMap: Record<string, string> = {
  dashboard: '概',
  music: '乐',
  storage: '库',
  setting: '设',
};

const subtitleMap: Record<string, string> = {
  dashboard: '全局状态与快捷入口',
  music: '歌曲 / 视频 / 专辑维护',
  storage: '资源统计与内容概况',
  setting: '默认封面与上传配置',
};

const metaIcon = computed(() => String(props.menu.meta?.icon ?? 'dashboard'));
const iconText = computed(() => iconMap[metaIcon.value] ?? '管');
const subtitle = computed(() => subtitleMap[metaIcon.value] ?? '后台功能入口');
</script>

<style scoped lang="scss">
.menu-item {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .8rem .9rem;
  border-radius: .95rem;
  transition: background-color .18s ease, transform .18s ease;

  .icon-badge {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: .8rem;
    background: rgba(255, 255, 255, .12);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
  }

  .title {
    color: white;
    font-weight: 700;
  }

  .subtitle {
    margin-top: .15rem;
    color: rgba(255, 255, 255, .6);
    font-size: .76rem;
  }

  &:hover {
    background-color: rgba(255, 255, 255, .08);
    transform: translateX(2px);
  }
}

.menu-item.active {
  background: linear-gradient(135deg, rgba(111, 168, 255, .24), rgba(80, 130, 255, .18));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08);
}
</style>
