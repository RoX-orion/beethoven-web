<template>
  <div :class="['spinner', buildClassName]">
    <div class="spinner-inner"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Spinner {
  color?: 'blue' | 'white' | 'black' | 'green' | 'gray' | 'yellow';
}

const spinner = withDefaults(defineProps<Spinner>(), {
  color: 'blue'
});
const buildClassName = computed(() => {
  return spinner.color;
});
</script>

<style scoped lang="scss">
.spinner {
  --spinner-size: 2rem;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--spinner-size);
  height: var(--spinner-size);
  //width: 100%;
  //height: 100%;

  &.with-background {
    &::before {
      content: '';
      position: absolute;
      left: -0.125rem;
      top: -0.125rem;
      bottom: -0.125rem;
      right: -0.125rem;
      border-radius: 50%;
    }

    &.bg-dark::before {
      background: rgba(0, 0, 0, 0.25);
    }

    &.bg-light::before {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  &.white {
    .spinner-inner {
      background-image: var(--spinner-white-data);
    }

    &.with-background {
      .spinner-inner {
        background-image: var(--spinner-white-thin-data);
      }
    }
  }

  &.blue {
    .spinner-inner {
      background-image: var(--spinner-blue-data);

      .theme-dark & {
        background-image: var(--spinner-dark-blue-data);
      }
    }
  }

  &.black {
    .spinner-inner {
      background-image: var(--spinner-black-data);
    }
  }

  &.green {
    .spinner-inner {
      background-image: var(--spinner-green-data);
    }
  }

  &.gray {
    .spinner-inner {
      background-image: var(--spinner-gray-data);
    }
  }

  &.yellow {
    .spinner-inner {
      background-image: var(--spinner-yellow-data);
    }
  }
}

.spinner-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-repeat: no-repeat;
  background-size: 100%;

  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
