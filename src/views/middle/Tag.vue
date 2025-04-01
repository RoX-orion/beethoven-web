<template>
  <div class="tag-wrapper flex-row">
    <div v-for="tag in TagList" class="tag pointer" @click="">
      <span class="tag-text">{{tag.label}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const TagList = [
  {key: 'music', label: '歌曲'},
  {key: 'video', label: '视频'},
  {key: 'playlist', label: '歌单'},
]
</script>

<style scoped lang="scss">
.tag-wrapper {
  padding: 0 var(--base-padding);
  gap: 1rem;

  .tag {
    width: 4rem;
    height: 2.3rem;
    border-radius: .5rem;
    background: white;
    position: relative;

    .tag-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
