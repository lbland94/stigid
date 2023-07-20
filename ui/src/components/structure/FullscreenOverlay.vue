<template>
  <div class="fullscreen-overlay" :class="data?.containerClasses">
    <component
      v-if="data?.component"
      :is="data?.component"
      v-bind="data?.componentAttr"
      v-on="data?.componentListeners || {}"
      @close="$emit('close', data?.id)"
    />
    <button
      class="close-button clear-btn cursor--pointer"
      v-if="data?.closeButton"
      @click.prevent="$emit('close', data?.id)"
    >
      <Icon name="close" />
    </button>
  </div>
</template>
<script lang="ts">
import type { FullscreenOverlayConfig } from '@/stores/ui/ui.interfaces';
import { defineComponent, type PropType } from 'vue';
import Icon from '@/components/content/Icon.vue';

export default defineComponent({
  name: 'FullscreenOverlay',
  props: {
    data: {
      type: Object as PropType<FullscreenOverlayConfig>,
      default: Object,
    },
  },
  components: { Icon },
});
</script>

<style lang="scss">
.fullscreen-overlay {
  width: 100%;
  height: 100%;
  pointer-events: all;
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--color-white);
}
</style>
