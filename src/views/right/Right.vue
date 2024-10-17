<template>
  <div class="right-container">
    <PlayListInfo/>
  </div>
</template>

<script setup lang="ts">
import PlayListInfo from './PlayListInfo.vue';
</script>

<style scoped>
.right-container {
  width: 100%;
  margin: 0 1rem;
  padding: var(--base-padding);
  border-radius: .25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
  height: calc(100vh - 10rem);
}
</style>
