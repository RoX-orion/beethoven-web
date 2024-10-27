<template>
  <div class="input-text">
    <input
      class="input"
      :placeholder="props.placeholder"
      @input="updateText"
      />
<!--    <label>11111</label>-->
  </div>
</template>

<script setup lang="ts">
import type { InputTextType } from '@/types/global'

const props: InputTextType = defineProps();
// props.text = '12121212';
const emits = defineEmits(['change']);
// emits('change', props.text)
const updateText = (event: any) => {
  emits('change', event.target.value);
}
</script>

<style scoped lang="scss">
.input {
  outline: none;
  height: 2rem;
}
</style>
