<script setup lang="ts">
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  light: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button class="s-circle-select" :class="{ selected, small, light }" @click.prevent="$emit('select')">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.s-circle-select {
  width: var(--number-size);
  height: var(--number-size);
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;
  border: 3px dashed var(--color-white);
  background-color: transparent;
  color: var(--color-white);
  cursor: pointer;
  font-size: 30px;
  font-family: $font-sans;
  font-weight: bold;

  @include mouse-only() {
    &:hover {
      scale: 1.03;
    }
  }

  &:active {
    scale: 0.95;
  }

  &:disabled {
    background-color: var(--color-disabled);
  }

  &.selected {
    background-color: var(--color-green--darken-10);
    color: var(--color-black);
    border: none;
  }

  &.light {
    background-color: var(--color-white);
    color: var(--color-black);
    border: none;

    &.selected {
      background-color: var(--color-green--darken-10);
    }
  }

  &.small {
    --number-size: 55px;
    font-size: 35px;
    font-weight: normal;
  }
}
</style>
