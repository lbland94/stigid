import { defineStore } from 'pinia';
import type {
  DrawerConfig,
  FullscreenOverlayConfig,
  ModalConfig,
  OverlayConfig,
  UiState,
} from './ui.interfaces';

export const useUiStore = defineStore('ui', {
  state: () => ({
    overlays: [],
  } as UiState),
  actions: {
    openOverlay(overlay: DrawerConfig | ModalConfig | FullscreenOverlayConfig) {
      const index = this.overlays.findIndex((o) => o.id === overlay.id);
      if (index > -1) {
        this.overlays.splice(index, 1, overlay);
      } else {
        this.overlays.push(overlay);
      }
    },
    closeOverlay(overlay: OverlayConfig['id'] | OverlayConfig) {
      const id = typeof overlay === 'string' ? overlay : overlay.id;
      const index = this.overlays.findIndex((o) => o.id === id);
      if (index > -1) {
        this.overlays.splice(index, 1);
      }
    },
  },
});
