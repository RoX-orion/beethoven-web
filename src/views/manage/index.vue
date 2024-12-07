<template>
  <Sidebar/>
  <div class="right-container">
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
  overflow: hidden;
}
</style>
