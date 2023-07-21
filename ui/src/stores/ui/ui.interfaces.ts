import type { Component } from 'vue';

export interface OverlayConfig {
  id: string;
  type: 'drawer' | 'modal' | 'fullscreen' | 'toast';
  component?: string | Component;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentAttr?: Record<string, any>;
  componentListeners?: Record<string, () => void>;
  componentClasses?: Record<string, boolean> | string;
  containerClasses?: Record<string, boolean> | string;
  closeButton?: boolean;
  zIndex?: number;
  ignoreBgClick?: boolean;
}

export interface DrawerConfig extends OverlayConfig {
  type: 'drawer';
  edge?: 'right' | 'left' | 'bottom' | DrawerMqEdge;
}

export interface DrawerMqEdge {
  md: string;
  sm?: string;
  xs?: string;
}

export interface ModalConfig extends OverlayConfig {
  type: 'modal';
  title?: string;
  body?: string;
  mainButton?: string;
  secondaryButton?: string;
  modalListeners?: Record<string, () => void>;
}

export interface FullscreenOverlayConfig extends OverlayConfig {
  type: 'fullscreen';
}

export interface ToastConfig {
  id?: string;
  type: 'toast';
  timeout?: number;
  contents: string;
}

export interface UiState {
  overlays: Array<OverlayConfig | ToastConfig>;
}
