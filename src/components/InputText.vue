<template>
  <div ref="inputText" class="input-text">
    <input
      class="input"
      v-model="text"
      :placeholder="props.placeholder"
      @input="updateText"/>
    <IconButton class="clear" icon-name="close" size=".85rem" @click="text = ''" icon-color="rgba(0, 0, 0, .5)"/>
  </div>
</template>
<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ref } from 'vue';

const text = defineModel<string | number | undefined>();
const inputText = ref<HTMLElement>();

const props = defineProps({
  placeholder: {
    type: String,
  },
});

const emits = defineEmits(['change']);
// emits('change', props.text)
const updateText = (event: any) => {
  emits('change', event.target.value);
};
// const focus = (event: any) => {
//   inputText.value?.classList.add('touched');
//   console.log(inputText.value?.classList);
// }
</script>

<style scoped lang="scss">
.touched {
  label {
    transform: scale(0.75) translate(-0.5rem, -2.25rem);
    //color: var(--color-error) !important;
    color: #e53935 !important;
  }
}
.input-text {
  position: relative;

  .input {
    width: 100%;
    outline: none;
    height: 3.2rem;
    padding: .25rem .5rem;
    border: solid .1rem rgba(0, 0, 0, .1);
    border-radius: .3rem;
    background-color: inherit;
  }

  .label {
    position: absolute;
    left: .75rem;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    color: var(--color-placeholders);
    transition: transform .15s ease-out, color .15s ease-out;
    pointer-events: none;
    transform-origin: left center;
    white-space: nowrap;
  }

  .clear {
    position: absolute;
    top: 50%;
    right: 1%;
    cursor: pointer;
    transform: translateY(-50%);
  }
}


</style>
