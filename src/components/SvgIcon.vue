<template>
  <svg aria-hidden="true" style="display: block" :width="size" :height="size">
    <use :xlink:href="symbolId" :fill="color"/>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

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
  },
  size: {
    type: String,
    default: '1.5rem',
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
