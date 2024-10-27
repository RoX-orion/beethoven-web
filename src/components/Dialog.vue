<template>
  <div class="dialog-wrapper" :style="{width: width}">
    <div class="flex-row content-space-between">
      <p style="font-weight: bold; font-size: 1.2rem">新建歌单</p>

      <IconButton
        icon-name="close"
        icon-color="rgba(0, 0, 0, .5)"
        size="1.2rem"/>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';

const dialog = defineProps({
  width: {
    type: String,
  },
});
</script>

<style scoped lang="scss">
.dialog-wrapper {
  z-index: 5;
  margin: auto;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem;
  //width: 50vw;
  //background-color: white;
  background: rgba(227, 238, 255, 1);
  border-radius: .5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
