<template>
  <div class="overlays">
    <TransitionGroup>
      <FullscreenOverlay
        v-for="fullscreen in fullscreens"
        :key="fullscreen.id"
        :data="fullscreen"
        @close="closeOverlay"
      />
    </TransitionGroup>
    <TransitionGroup>
      <ModalOverlay
        v-for="modal in modals"
        :key="modal.id"
        :data="modal"
        @close="closeOverlay"
        v-on="modal.modalListeners || {}"
      />
    </TransitionGroup>
    <TransitionGroup name="drawer-slide" :duration="200">
      <DrawerOverlay v-for="drawer in drawers" :key="drawer.id" :data="drawer" @close="closeOverlay" />
    </TransitionGroup>
    <div class="toasts-container">
      <TransitionGroup name="fade-up">
        <ToastOverlay v-for="toast in toasts" :key="toast.id" :data="toast" @close="closeOverlay" />
      </TransitionGroup>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import FullscreenOverlay from './FullscreenOverlay.vue';
import ModalOverlay from './Modal.vue';
import DrawerOverlay from './Drawer.vue';
import ToastOverlay from './Toast.vue';
import type { DrawerConfig, FullscreenOverlayConfig, ModalConfig, ToastConfig } from '@/stores/ui/ui.interfaces';
import { useUiStore } from '@/stores/ui';

export default defineComponent({
  name: 'SOverlays',
  components: {
    FullscreenOverlay,
    ModalOverlay,
    DrawerOverlay,
    ToastOverlay,
  },
  setup() {
    const uiState = useUiStore();

    const fullscreens = computed(() => {
      return uiState.overlays.filter((o) => o.type === 'fullscreen') as FullscreenOverlayConfig[];
    });

    const modals = computed(() => {
      return uiState.overlays.filter((o) => o.type === 'modal') as ModalConfig[];
    });

    const drawers = computed(() => {
      return uiState.overlays.filter((o) => o.type === 'drawer') as DrawerConfig[];
    });

    const toasts = computed(() => {
      return uiState.overlays.filter((o) => o.type === 'toast') as ToastConfig[];
    });

    function closeOverlay(id: string) {
      uiState.closeOverlay(id);
    }

    return {
      fullscreens,
      modals,
      drawers,
      toasts,
      closeOverlay,
    };
  },
});
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
}
.fade-up-leave-to {
  translate: 0 -100%;
}
.overlays {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;

  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
  }
}
</style>
