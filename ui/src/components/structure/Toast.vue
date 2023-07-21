<template>
  <div class="toast">
    {{ data && data.contents }}
  </div>
</template>
<script lang="ts">
import type { ToastConfig } from '@/stores/ui/ui.interfaces';
import { defineComponent, onMounted, type PropType } from 'vue';

export default defineComponent({
  name: 'ToastOverlay',
  props: {
    data: {
      type: Object as PropType<ToastConfig>,
      default: Object,
    },
  },
  setup(props, ctx) {
    onMounted(() => {
      setTimeout(() => {
        ctx.emit('close', props.data?.id);
      }, props.data?.timeout || 1000);
    });
  },
});
</script>

<style lang="scss">
.toast {
  background-color: var(--color-white--darken-30);
  color: var(--color-black);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 18px;
  font-family: $font-sans;
  position: relative;
  display: inline-block;
  box-shadow: 0 0 4px var(--color-black);
}

.toasts-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  pointer-events: none;
  z-index: 40;
  margin-top: 20px;
}
</style>
