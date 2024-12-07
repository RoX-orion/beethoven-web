<template>
  <div class="sidebar-wrapper custom-scroll">
    <div class="logo-wrapper flex-row pointer" @click="gotoHome">
      <img src="../../../assets/brand.png" alt="brand">
      <span style="color: white; margin: auto; display: inline-block">Beethoven Music Web</span>
    </div>
    <Menu
      v-for="menu in manageRoutes[0]?.children"
      :key="menu.path"
      :menu="menu" @click="changeRoute(menu)"/>
  </div>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import router, { manageRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';

const changeRoute = (menu: RouteRecordRaw) => {
  router.push({ path: menu.path });
}

const gotoHome = () => {
  router.push({ path: '/' });
}
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: #372D3C;

  .logo-wrapper {
    background-color: #181818;
    font-size: 15px;
    padding: .5rem;

    img {
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
