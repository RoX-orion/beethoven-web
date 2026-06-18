<template>
  <div class="tag-wrapper flex-row">
    <button v-for="tag in TagList" :key="tag.key" class="tag pointer" type="button">
      <span class="tag-text">{{tag.label}}</span>
    </button>
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
  padding: 1rem 1rem 0;
  gap: .55rem;

  .tag {
    min-width: 4.2rem;
    height: 2.25rem;
    padding: 0 .85rem;
    border: 1px solid var(--surface-border);
    border-radius: 999px;
    color: var(--text-secondary);
    background: rgba(255, 255, 255, .58);
    position: relative;
    cursor: pointer;
    transition: border-color .18s ease, background-color .18s ease, color .18s ease, transform .18s ease;

    &:first-child {
      color: var(--brand-primary);
      border-color: rgba(47, 143, 118, .24);
      background: var(--surface-active);
    }

    &:hover {
      color: var(--text-primary);
      background: var(--surface-hover);
      transform: translateY(-1px);
    }

    .tag-text {
      font-weight: 800;
    }
  }
}
</style>
