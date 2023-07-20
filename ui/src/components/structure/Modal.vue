<template>
  <div>
    <div
      class="modal--bg cursor--pointer"
      @click.prevent="!data?.ignoreBgClick ? $emit('close', data?.id) : () => {}"
    ></div>
    <div class="modal" :class="data?.containerClasses">
      <component
        v-if="data?.component"
        :is="data?.component"
        v-bind="data?.componentAttr"
        v-on="data?.componentListeners || {}"
        :class="data?.componentClasses"
        @close="$emit('close', data?.id)"
      />
      <div v-else class="modal--default">
        <h3 v-if="data?.title" class="modal--title">{{ data?.title }}</h3>
        <p v-if="data?.body" class="modal--body">{{ data?.body }}</p>
        <div class="modal--button-container">
          <SButton class="modal--button" v-if="data?.mainButton" @click.prevent="primary">
            {{ data?.mainButton }}
          </SButton>
          <SButton class="modal--button" v-if="data?.secondaryButton" @click.prevent="secondary" light>
            {{ data?.secondaryButton }}
          </SButton>
        </div>
      </div>

      <button
        class="close-button clear-btn cursor--pointer"
        v-if="data?.closeButton"
        @click.prevent="$emit('close', data?.id)"
      >
        <SIcon name="close" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import type { ModalConfig } from '@/stores/ui/ui.interfaces';
import { defineComponent, type PropType } from 'vue';
import SButton from '@/components/atoms/SButton.vue';
import SIcon from '@/components/content/Icon.vue';

export default defineComponent({
  name: 'ModalOverlay',
  components: { SButton, SIcon },
  props: {
    data: {
      type: Object as PropType<ModalConfig>,
      default: Object,
    },
  },
  setup(props, ctx) {
    function primary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('primary');
    }
    function secondary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('secondary');
    }

    return {
      primary,
      secondary,
    };
  },
});
</script>

<style lang="scss">
.modal--bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: var(--color-black);
  opacity: 0.7;
  pointer-events: all;
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-bg-dark--lighten-10);
  pointer-events: all;

  .modal--default {
    padding: 30px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 480px;
    max-height: 90vh;
  }

  .modal--title {
    margin-top: -10px;
    font-size: 24px;
  }

  .modal--body {
    font-size: 18px;
    overflow-y: auto;
  }

  .modal--button-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 5px;
  }

  @include media-smaller(xs) {
    .modal--default {
      min-width: 90vw;
    }
  }
}
</style>
