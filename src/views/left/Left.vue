<template>
  <div class="left-wrapper">
    <PlayList v-for="() in 5"/>
  </div>
</template>

<script setup lang="ts">
import PlayList from './PlayList.vue';

</script>

<style lang="scss" scoped>
.left-wrapper {
  width: var(--left-width);
  margin: 0 1rem;
  padding: var(--base-padding);
  border-radius: .25rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
