<template>
  <div class="flex-row">
    <img :src="music.cover" alt="cover">
    <div class="flex-row">
      <div>
        <p>{{music.name}}</p>
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { MusicItemType } from '@/types/global';

const props = defineProps<{
  music: MusicItemType
}>();
console.log(props);
</script>

<style scoped lang="scss">

</style>
