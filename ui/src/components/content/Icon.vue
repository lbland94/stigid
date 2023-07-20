<template>
  <span class="material-symbols-outlined s-icon">{{ name }}<slot /></span>
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
  },
});
</script>

<style lang="scss">
.s-icon {
  max-width: 1em;
  overflow: hidden;
  font-size: inherit;
  display: block;
}
</style>
