<template>
  <div class="tag">
    <span class="tag-text">全部</span>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
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
    font-size: 15px;
  }
}
</style>
