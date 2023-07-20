<script setup lang="ts">
import { ref } from 'vue';
import SButtonVue from './atoms/SButton.vue';
import SLogo from './content/SLogo.vue';
import dayjs from '@/utilities/dayjs';

const currentDate = ref(dayjs().format('MMMM DD, YYYY'));
</script>

<template>
  <div class="s-splash flex col align-c justify-c">
    <div class="s-s-content flex col gap-20 align-c justify-c">
      <SLogo />
      <h1 class="roboto-slab bold margin-0">Stigid</h1>
      <p class="roboto-slab light text-center margin-0 s-s-body">
        A daily numbers puzzle from someone who liked the old one.
      </p>
      <SButtonVue class="s-s-play" @click="$emit('play')">Play</SButtonVue>
      <p class="roboto-slab bold">{{ currentDate }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.s-splash {
  background-color: var(--color-green);
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  color: var(--color-black);

  .s-s-play {
    min-width: 150px;
  }

  .s-s-content {
    max-width: 300px;
  }

  .s-s-body {
    font-size: 20px;
  }
}
</style>
