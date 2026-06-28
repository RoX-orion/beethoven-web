<template>
  <div class="menu-item pointer" :class="{ active: isActive }">
    <div class="copy">
      <p class="title">{{ menu.meta?.title }}</p>
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
</script>

<style scoped lang="scss">
.menu-item {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .8rem .9rem;
  border-radius: .95rem;
  transition: background-color .18s ease, transform .18s ease;

  .title {
    color: white;
    font-weight: 700;
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