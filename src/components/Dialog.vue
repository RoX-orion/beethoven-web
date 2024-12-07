<template>
  <div class="dialog-wrapper" v-if="visible" @click.self="visible = false">
    <div class="dialog" :style="{width: props.width}">
      <div class="flex-row content-space-between">
        <div style="font-weight: bold; font-size: 1.2rem; margin: auto 0">{{ props.title }}</div>

        <IconButton
          icon-name="close"
          icon-color="rgba(0, 0, 0, .5)"
          size="1.2rem" @click="visible = false"/>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import type { DialogType } from '@/types/global';

const props = defineProps<DialogType>();

let visible = defineModel({
  required: true,
});
</script>

<style scoped lang="scss">
.dialog-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1024;
  background-color: rgba(0, 0, 0, .5);
}

.dialog {
  z-index: 1024;
  margin: auto;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem;
  //width: 50vw;
  background: rgba(227, 238, 255, 1);
  border-radius: .5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
