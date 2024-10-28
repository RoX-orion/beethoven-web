<template>
  <button class="button-wrapper">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.button-wrapper {
  outline: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 0;
  border-radius: 0.75rem;
  //background-color: transparent;
  background-color: #409eff;
  background-size: cover;
  padding: 0.625rem;
  color: blue;
  line-height: 1.2;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: background-color 0.15s, color 0.15s;
  text-decoration: none !important;
  text-transform: uppercase;
}
</style>
