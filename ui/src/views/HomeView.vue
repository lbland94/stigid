<script setup lang="ts">
import SPuzzleTabsVue from '@/components/SPuzzleTabs.vue';
import SRankProgress from '@/components/SRankProgress.vue';
</script>

<template>
  <main>
    <SRankProgress />
    <SPuzzleTabsVue />
  </main>
</template>

<style lang="scss">
main {
  width: 100%;
}
</style>
