<template>
  <div class="sidebar-wrapper">
    <div class="logo-wrapper flex-row">
      <router-link to="/">
        <img src="../../../assets/brand.png" alt="brand">
      </router-link>
      <span style="color: white; margin: auto; display: inline-block">Beethoven Music Web</span>
    </div>
    <Menu
      v-for="menu in manageRoutes[0]?.children"
      :key="menu.path"
      :menu="menu" @click="changeRoute(menu)"/>
  </div>
  <RouterView/>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import router, { manageRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';

const changeRoute = (menu: RouteRecordRaw) => {
  router.push({ path: menu.path });
}
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 17rem;
  background-color: #372D3C;

  .logo-wrapper {
    background-color: #181818;

    img {
      width: 3rem;
      height: 3rem;
      margin: .5rem 1rem;
    }
  }
}
</style>
