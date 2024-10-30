<template>
  <div class="input-text">
    <input
      class="input"
      v-model="text"
      :placeholder="props.placeholder"
      @input="updateText"/>
<!--    <label>11111</label>-->
  </div>
</template>

<script setup lang="ts">

const text = defineModel({
  type: String,
  required: true
});

const props = defineProps({
  placeholder: {
    type: String,
  },
});
// props.text = '12121212';
const emits = defineEmits(['change']);
// emits('change', props.text)
const updateText = (event: any) => {
  emits('change', event.target.value);
}
</script>

<style scoped lang="scss">
.input-text {
  position: relative;

  .input {
    width: 100%;
    outline: none;
    height: 3rem;
    padding: .25rem .5rem;
    border: solid .1rem rgba(0, 0, 0, .1);
    border-radius: .3rem;
    background-color: inherit;
  }

  &::after {
    --icon-size: .75rem;

    content: '';
    background-image: url('../assets/img/close.png');
    background-size: var(--icon-size) var(--icon-size);
    width: var(--icon-size);
    height: var(--icon-size);
    position: absolute;
    top: 50%;
    right: 5%;
    cursor: pointer;
    transform: translateY(-50%);
  }
}
</style>
