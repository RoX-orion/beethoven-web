<template>
  <svg :aria-hidden="isDecorative ? 'true' : undefined" :width="size" :height="size" :style="{ color }">
    <use :xlink:href="symbolId" fill="currentColor"/>
  </svg>
</template>

<script lang="ts" setup>
import {computed, useAttrs} from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  size: {
    type: String,
    default: '1.5rem',
  },
});

const attrs = useAttrs();
const isDecorative = computed(() => !attrs['aria-label'] && !attrs.title);

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
