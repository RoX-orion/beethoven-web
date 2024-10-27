<template>
  <div class="left-wrapper custom-scroll">
    <div class="flex-row left-header">
      <div style="font-size: 1.2rem; padding: .5rem; margin: auto 0">
        歌单
      </div>
      <IconButton icon-name="add" icon-color="rgba(0, 0, 0, .5)"/>
    </div>
    <PlayList v-for="() in 15"/>
  </div>

  <Dialog v-if="addPlaylistDialogVisible" width="30rem">
    <p>7777777777777777</p>
  </Dialog>
</template>

<script setup lang="ts">
import PlayList from './PlayList.vue';
import Dialog from '@/components/Dialog.vue';
import { ref } from 'vue';
import IconButton from '@/components/IconButton.vue';

let addPlaylistDialogVisible = ref(false);

</script>

<style lang="scss" scoped>
.left-wrapper {
  width: var(--left-width);
  margin: 0 1rem;
  padding: var(--base-padding);
  border-radius: .25rem;
  overflow: hidden;
  overflow-y: scroll;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);

  .left-header {
    justify-content: space-between;
    align-items: center;
    line-height: 1.2;
  }
}
</style>
