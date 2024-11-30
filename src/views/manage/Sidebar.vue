<template>
  <div class="sidebar-wrapper">
    <Menu
      v-for="menu in manageRoutes[0]?.children"
      :key="menu.path"
      :menu="menu" @click="changeRoute"/>
  </div>
  <RouterView/>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import { manageRoutes } from '@/router';

const changeRoute = () => {

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
}
</style>
