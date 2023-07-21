<template>
  <span class="material-symbols-rounded s-icon" :class="{ fill, bold }">{{ name }}<slot /></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    fill: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.s-icon {
  --fill: 0;
  --weight: 400;
  --gradient: 0;
  --opsz: 48;
  max-width: 1em;
  overflow: hidden;
  font-size: inherit;
  display: block;
  font-variation-settings: 'FILL' var(--fill), 'wght' var(--weight), 'GRAD' var(--gradient), 'opsz' var(--opsz);

  &.fill {
    --fill: 1;
  }

  &.bold {
    --weight: 700;
  }
}
</style>
