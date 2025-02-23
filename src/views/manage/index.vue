<template>
  <Sidebar/>
  <div class="right-container custom-scroll">
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar/Sidebar.vue';
</script>

<style scoped lang="scss">
.right-container {
  margin-left: var(--sidebar-width);
  padding: .5rem;
  height: 100dvh;
  overflow: auto !important;
}
</style>
