<template>
  <div class="menu-item pointer">
    <p class="title">{{ menu.meta?.title }}</p>
  </div>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';

defineProps<{
  menu: RouteRecordRaw
}>();
</script>

<style scoped lang="scss">
.menu-item {
  padding: 1rem;

  .title {
    color: white;
  }

  &:hover {
    background-color: #181818;
  }
}
</style>
