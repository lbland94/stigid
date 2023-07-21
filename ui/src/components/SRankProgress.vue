<script setup lang="ts">
import { usePuzzleStore } from '@/stores/puzzle';
import { ranks } from '@/utilities/puzzle';
import { computed } from 'vue';
import Icon from './content/Icon.vue';

const puzzleStore = usePuzzleStore();

const stars = computed(() => {
  return puzzleStore.stars.reduce((tot, s) => tot + s, 0 as number);
});

const percentComplete = computed(() => {
  return stars.value / ranks[ranks.length - 1].stars;
});

const cmpRanks = computed(() => {
  return ranks.map((r) => ({
    ...r,
    fulfilled: stars.value >= r.stars,
    percent: r.stars / ranks[ranks.length - 1].stars,
  }));
});

const rankName = computed(() => {
  const highestRank = [...cmpRanks.value].reverse().find((r) => r.fulfilled);
  return highestRank?.name;
});
</script>

<template>
  <div class="s-rank flex row align-c gap-10">
    <div class="s-rank-name font-sans">{{ rankName }}</div>
    <div class="s-rank-progress grow-1">
      <div class="s-rp-fill" :style="{ width: `${percentComplete * 100}%` }"></div>
      <div
        v-for="(rank, i) of cmpRanks"
        class="s-rank-dot"
        :class="{ fulfilled: rank.fulfilled && (i > 0 || stars > 0) }"
        :key="`rank-${rank.stars}`"
        :style="{ left: `${rank.percent * 100}%` }"
      >
        <div class="s-rank-star-container" v-if="i > 0 && rank.fulfilled">
          <Icon class="s-rank-star" fill>star</Icon>
          {{ rank.stars }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.s-rank {
  margin: 0 15px;
  margin-bottom: 5px;

  .s-rank-progress {
    position: relative;
    height: 4px;
    background-color: var(--color-white--darken-50);
    border-radius: 1000px;
    margin: 15px 5px;
  }

  .s-rank-dot {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--color-white--darken-50);

    &.fulfilled {
      background-color: var(--color-white);
    }
  }
  .s-rank-star-container {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    color: var(--color-black);
    font-family: $font-sans;
    font-size: 10px;
    font-weight: bold;
  }
  .s-rank-star {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -49% -57%;
    color: var(--color-yellow);
    font-size: 32px;
    z-index: -1;
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      translate: -50% -50%;
      width: 40%;
      height: 44%;
      border-radius: 50%;
      box-shadow: -2px 0 10px var(--color-black);
      z-index: -1;
    }
  }
  .s-rp-fill {
    position: absolute;
    left: 0;
    height: 100%;
    top: 0;
    background-color: var(--color-white);
    border-radius: 1000px;
  }
}
</style>
