<template>
  <div
    class="image-preview-wrapper"
    :class="{ 'is-loading': !imageReady }"
    @click="showPreview"
  >
    <div v-if="!imageReady" class="image-preview-skeleton"/>
    <img
      v-if="src"
      class="image-preview-img"
      :class="{ 'is-ready': imageReady }"
      :src="src"
      alt=""
      @load="handleLoad"
      @error="handleError"
    />
  </div>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="image-preview-mask" @click="visible = false">
        <img class="image-preview-full" :src="src" alt="" @click.stop/>
        <span class="image-preview-close" @click="visible = false">&times;</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ src: string }>();

const visible = ref(false);
const imageReady = ref(false);

watch(() => props.src, () => {
  imageReady.value = false;
  visible.value = false;
});

const handleLoad = () => {
  imageReady.value = true;
};

const handleError = () => {
  imageReady.value = true;
};

const showPreview = () => {
  if (imageReady.value) {
    visible.value = true;
  }
};
</script>

<style scoped lang="scss">
.image-preview-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;

  &.is-loading {
    cursor: default;
  }
}

.image-preview-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: .5rem;
  opacity: 0;
  transition: opacity .2s ease;

  &.is-ready {
    opacity: 1;
  }
}

.image-preview-skeleton {
  width: 100%;
  height: 100%;
  border-radius: .5rem;
  background: linear-gradient(
    90deg,
    rgba(222, 231, 239, .72) 25%,
    rgba(245, 248, 251, .92) 37%,
    rgba(222, 231, 239, .72) 63%
  );
  background-size: 400% 100%;
  animation: image-preview-skeleton 1.35s ease-in-out infinite;
}

.image-preview-skeleton + .image-preview-img {
  position: absolute;
  inset: 0;
}

@keyframes image-preview-skeleton {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>

<style lang="scss">
.image-preview-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .65);
  backdrop-filter: blur(6px);
}

.image-preview-full {
  max-width: 85vw;
  max-height: 85vh;
  border-radius: .5rem;
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, .35);
  object-fit: contain;
}

.image-preview-close {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  line-height: 1;
  opacity: .7;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
