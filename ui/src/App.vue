<script setup lang="ts">
import { RouterView } from 'vue-router';
import Overlays from '@/components/structure/Overlays.vue';
import { useUiStore } from '@/stores/ui';
import { markRaw, onMounted } from 'vue';
import SSplash from './components/SSplash.vue';
import SLogo from './components/content/SLogo.vue';
const uiStore = useUiStore();
onMounted(() => {
  uiStore.openOverlay({
    type: 'fullscreen',
    id: 'splash',
    component: markRaw(SSplash),
    componentListeners: {
      play: () => {
        uiStore.closeOverlay('splash');
      },
    },
    containerClasses: { 'opacity-1': true },
  });
});
</script>

<template>
  <header class="header flex row nowrap justify-c align-c gap-10">
    <p class="roboto-slab header-text">Stigid</p>
    <SLogo class="header-logo" />
  </header>
  <div class="content grow-1">
    <RouterView />
  </div>

  <Overlays />
</template>

<style lang="scss">
@import '@/scss/root.scss';
.header {
  height: 60px;
  padding: 5px 10px;
  box-sizing: border-box;
}

.header-logo {
  --logo-size: 40px;
  color: var(--color-black);
}

.header-text {
  font-size: 30px;
  margin: 0;
}

.content {
  overflow-y: auto;
}
</style>
