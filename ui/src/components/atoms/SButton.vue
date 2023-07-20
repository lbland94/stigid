<script setup lang="ts">
defineProps({
  light: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button class="s-button" :class="{ light, outline }">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.s-button {
  color: var(--color-white);
  background: var(--color-black);
  border-radius: 1000px;
  padding: 10px 20px;
  transition: all 0.1s ease-in-out;
  text-align: center;
  font-size: 16px;
  font-family: $font-sans;
  cursor: pointer;

  &:hover {
    scale: 1.03;
  }

  &:active {
    scale: 0.95;
  }

  &:disabled {
    background-color: var(--color-disabled);
  }

  &.outline {
    border: 1px solid var(--color-white);
  }

  &.light {
    background: var(--color-white);
    color: var(--color-black);

    &:disabled {
      background-color: var(--color-disabled--lighten-20);
    }
    &.outline {
      border: 1px solid var(--color-black);
    }
  }
}

// @include media-larger(xs) {
//   .s-button {
//     font-size: 24px;
//   }
// }
</style>
