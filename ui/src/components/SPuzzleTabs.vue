<script setup lang="ts">
import type { StigidDaily } from '@/api/modules/puzzle/puzzle.interfaces';
import SPuzzle from './SPuzzle.vue';
import { usePuzzleStore } from '@/stores/puzzle';
import { computed, markRaw, nextTick, onMounted, ref } from 'vue';
import { useUiStore } from '@/stores/ui';
import SPuzzleReview from './SPuzzleReview.vue';
import Icon from './content/Icon.vue';

const uiStore = useUiStore();

const puzzleStore = usePuzzleStore();
onMounted(() => {
  puzzleStore.fetchPuzzle();
});

const puzzles = computed(() => (puzzleStore.puzzle as StigidDaily).puzzles || []);
const stars = computed(() => {
  return puzzleStore.stars;
});
let firstIncompleteIndex = stars.value.findIndex((s) => s < 3);
const selectedPuzzle = ref(
  puzzles.value.length ? (firstIncompleteIndex !== -1 ? firstIncompleteIndex : stars.value.length - 1) : 0
);

const solutionSteps = computed(() => {
  return (puzzleStore.solutionSteps[selectedPuzzle.value] || []).filter(
    (s, i) => solutionExpanded.value || i === puzzleStore.solutionSteps[selectedPuzzle.value].length - 1
  );
});
const solutionExpanded = ref(false);

function showNextOverlay() {
  uiStore.openOverlay({
    type: 'modal',
    id: 'puzzle.review',
    component: markRaw(SPuzzleReview),
    componentListeners: {
      next: overlayNext,
    },
    containerClasses: {
      's-puzzle-review--overlay': true,
    },
    componentAttr: {
      selectedPuzzle: selectedPuzzle.value,
    },
  });
}

async function overlayNext() {
  nextPuzzle();
  if (stars.value[selectedPuzzle.value] === 3 && selectedPuzzle.value < puzzles.value.length) {
    await nextTick();
    showNextOverlay();
  }
}

function nextPuzzle() {
  if (selectedPuzzle.value + 1 < puzzles.value.length) {
    selectedPuzzle.value += 1;
  }
}
</script>

<template>
  <div class="s-puzzle-t">
    <div class="s-pt-tabs flex row align-c w-100">
      <button
        class="s-pt-tab grow-1"
        :class="{ selected: i === selectedPuzzle }"
        v-for="(p, i) in puzzles"
        :key="`puzzle-tab-${i}`"
        @click.prevent="selectedPuzzle = i"
      >
        {{ p.target }}
        <div class="s-pt-t-stars flex row nowrap justify-c">
          <Icon class="s-pt-t-star" :fill="stars[i] >= j" v-for="j in 3" :key="`star-${j}`"> star </Icon>
        </div>
      </button>
    </div>
    <div class="s-pt-sol-container">
      <div
        class="s-pt-solution flex row justify-space-b"
        :class="{ expanded: solutionExpanded }"
        @click.prevent="solutionExpanded = !solutionExpanded"
      >
        <div class="s-pt-solution-steps flex col gap-10 align-s grow-1">
          <p class="color-disabled font-sans margin-0" v-if="!solutionSteps.length">Your progress...</p>
          <p class="s-pt-solution-step font-sans margin-0" v-for="(step, i) in solutionSteps" :key="`step-${i}`">
            {{ step.a }}{{ step.display }}{{ step.b }} = {{ step.result }}
          </p>
        </div>
        <Icon class="s-pt-sol-arrow" v-if="!solutionExpanded">expand_more</Icon>
      </div>
    </div>
    <SPuzzle :puzzle-index="selectedPuzzle" @solved="showNextOverlay" @next="nextPuzzle" class="s-pt-puzzle" />
  </div>
</template>

<style lang="scss">
.s-puzzle-t {
  width: 100%;

  .s-pt-t-star {
    display: block;
    font-size: 15px;
    position: relative;
  }

  .s-pt-sol-arrow {
    font-size: 24px;
  }

  .s-pt-solution-step {
    border-bottom: 1px solid var(--color-white);
    font-size: 18px;
    min-width: 180px;
    padding-left: 10px;
  }

  .s-pt-sol-container {
    position: relative;
    height: 50px;
    width: 100%;
    margin-bottom: 20px;
  }

  .s-pt-solution {
    position: absolute;
    height: 45px;
    padding: 10px 20px;
    box-sizing: border-box;
    border: 2px solid var(--color-white);
    border-radius: 6px;
    width: calc(100% - 20px);
    margin: 0 10px;
    background-color: var(--color-bg-dark);
    z-index: 2;
    transition: height 200ms ease-in-out;
    overflow: hidden;
    cursor: pointer;

    &.expanded {
      height: 600px;
      max-height: calc(100vh - 50px - 40px - 20px - 52px);
    }
  }

  .s-pt-tabs {
    margin-bottom: 20px;
  }
  .s-pt-tab {
    background-color: var(--color-bg-dark--lighten-20);
    font-size: 24px;
    cursor: pointer;
    font-family: $font-sans;
    padding: 6px 0;
    border-top: 1px solid var(--color-white);
    border-bottom: 1px solid var(--color-white);
    &:not(:first-child) {
      border-left: 0.5px solid var(--color-white);
    }
    &:not(:last-child) {
      border-right: 0.5px solid var(--color-white);
    }

    &.selected {
      border-color: var(--color-bg-dark--lighten-30);
      border-left-color: var(--color-white);
      background-color: transparent;
      border-bottom: none;
      & + .s-pt-tab {
        border-left-width: 1px;
      }
    }
  }

  .s-pt-puzzle {
    padding-bottom: 40px;
  }
}
</style>
