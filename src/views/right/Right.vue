<template>
  <div class="right-wrapper custom-scroll">
    <TagGroup/>
    <PlayListGroup/>
  </div>
</template>

<script setup lang="ts">
import TagGroup from './TagGroup.vue';
import PlayListGroup from './PlayListGroup.vue';
</script>

<style scoped lang="scss">
.right-wrapper {
  width: 100%;
  border-radius: .25rem;
  overflow: hidden;
  overflow-y: scroll;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
