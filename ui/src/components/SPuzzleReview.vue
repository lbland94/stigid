<script setup lang="ts">
import { usePuzzleStore } from '@/stores/puzzle';
import { computed, nextTick } from 'vue';
import SButton from './atoms/SButton.vue';
import type { StigidDaily } from '@/api/modules/puzzle/puzzle.interfaces';
import IconVue from './content/Icon.vue';
import copy from 'copy-text-to-clipboard';

const puzzleStore = usePuzzleStore();

const props = defineProps({
  selectedPuzzle: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['next', 'close']);

const solutionBars = computed(() => {
  const maxSolutionHeight = puzzle.value.solutions.reduce((max, s) => {
    const v = Math.log2(s + 1);
    if (v > max) return v;
    return max;
  }, 0);
  return puzzle.value.solutions.map((s, i) => ({
    count: s,
    active: i === solution.value.steps.length - 1,
    height: Math.log2(s + 1) / maxSolutionHeight,
  }));
});

const puzzle = computed(() => {
  return (puzzleStore.puzzle as StigidDaily).puzzles[props.selectedPuzzle];
});

const isLast = computed(() => {
  return (puzzleStore.puzzle as StigidDaily).puzzles.length - 1 === props.selectedPuzzle;
});

const allComplete = computed(() => {
  return puzzleStore.stars.every((s) => s > 0);
});

const stars = computed(() => {
  return puzzleStore.stars[props.selectedPuzzle];
});

const solution = computed(() => {
  return puzzleStore.solutions[props.selectedPuzzle];
});

const nearest = computed(() => {
  const nums = puzzleStore.numbers[props.selectedPuzzle];
  const target = puzzle.value.target;
  const closest = nums
    .filter((n) => !n.hidden)
    .map((n) => ({ distance: Math.abs(n.number - target), number: n.number }))
    .sort((a, b) => a.distance - b.distance);
  return closest[0].number;
});

const solutionSteps = computed(() => {
  return puzzleStore.solutionSteps[props.selectedPuzzle] || [];
});

async function next() {
  emit('next');
  emit('close');
}

function share() {
  copy(puzzleStore.shareText);
}
</script>

<template>
  <div class="s-puzzle-review flex col align-c justify-c gap-20">
    <div class="s-pr-stars">
      <span class="s-pr-star material-symbols-outlined" v-for="s in stars" :key="`star-${s}`">star</span>
    </div>
    <div class="s-pr-steps flex col gap-04 align-c">
      <p class="s-pr-step margin-0 font-sans" v-for="(step, i) of solutionSteps" :key="`step-${i}`">
        {{ step.a }} {{ step.display }} {{ step.b }} = {{ step.result }}
      </p>
    </div>
    <div class="s-pr-target flex col gap-04" v-if="nearest !== puzzle.target">
      <p class="s-pr-step margin-0 font-sans">Target: {{ puzzle.target }}</p>
      <p class="s-pr-step margin-0 font-sans">Nearest: {{ nearest }}</p>
    </div>
    <div class="flex col gap-10 s-pr-graph-container" v-else>
      <p class="font-sans s-pr-graph-title margin-0 text-center">Steps Taken</p>
      <div class="s-pr-graph flex row gap-10 justify-space-b">
        <div class="flex col h-100 align-c gap-05" v-for="(bar, i) of solutionBars" :key="`graph-bar-${i}`">
          <p class="font-sans margin-0 text-center">{{ i + 1 }}</p>
          <div class="s-pr-graph-bar grow-1 flex row align-e w-100" :class="{ active: bar.active }">
            <div
              class="s-pr-graph-bar-fill grow-1"
              :class="{ active: bar.active }"
              :style="{ height: `${bar.height * 100}%` }"
            ></div>
          </div>
          <p class="font-sans margin-0 text-center">{{ bar.count }}</p>
        </div>
      </div>
      <div class="flex row justify-c gap-05 align-c font-sans">
        Your Solution: <span class="s-pr-graph-legend-box"></span>
      </div>
    </div>
    <div class="flex col gap-10">
      <SButton light @click.prevent="next" class="s-pr-button" v-if="!isLast">Next Puzzle</SButton>
      <SButton
        light
        class="s-pr-button flex row nowrap align-c justify-c gap-05"
        :class="{ 'bg-yellow': !isLast }"
        v-if="allComplete"
        @click.prevent="share"
      >
        Share
        <IconVue>share</IconVue>
      </SButton>
      <SButton outline @click.prevent="$emit('close')">Back</SButton>
    </div>
  </div>
</template>

<style lang="scss">
.s-puzzle-review {
  .s-pr-step {
    font-size: 18px;
  }

  .s-pr-star {
    font-size: 30px;
  }

  .s-pr-graph-title {
    font-size: 24px;
  }

  .s-pr-graph-container {
    background-color: var(--color-bg-dark);
    padding: 10px 30px;
    border-radius: 4px;
  }

  .s-pr-graph {
    height: 130px;
    max-width: 100%;
  }

  .s-pr-graph-bar {
    width: 20px;
    background-color: var(--color-black--lighten-30);
    height: 100%;
    border-top-left-radius: 1000px;
    border-top-right-radius: 1000px;
    overflow: hidden;
    &.active {
      border: 2px solid var(--color-green--darken-20);
      background-color: var(--color-green--darken-40);
      border-bottom: none;
    }
  }

  .s-pr-graph-legend-box {
    border: 2px solid var(--color-green--darken-20);
    background-color: var(--color-green--darken-40);
    border-radius: 2px;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 50%;
      width: 100%;
      bottom: 0;
      left: 0;
      background-color: var(--color-white);
    }
  }

  .s-pr-graph-bar-fill {
    background-color: var(--color-white);
    &.active {
      background-color: var(--color-white);
    }
  }
}

.s-puzzle-review--overlay {
  width: 70%;
  padding: 20px;
  max-width: 400px;
  border-radius: 8px;
}
</style>
