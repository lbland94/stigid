<script setup lang="ts">
import { usePuzzleStore } from '@/stores/puzzle';
import CircleSelect from './atoms/CircleSelect.vue';
import { computed, ref } from 'vue';
import type { StigidDaily } from '@/api/modules/puzzle/puzzle.interfaces';
import SButton from './atoms/SButton.vue';
import { operations, operatorDisplay } from '@/utilities/puzzle';

const circlePositions = [
  { left: '0', top: '0' },
  { left: 'calc(50% - var(--number-radius))', top: '0' },
  { left: 'calc(100% - var(--number-size))', top: '0' },
  { left: '0', top: 'calc(100% - var(--number-size))' },
  { left: 'calc(50% - var(--number-radius))', top: 'calc(100% - var(--number-size))' },
  { left: 'calc(100% - var(--number-size))', top: 'calc(100% - var(--number-size))' },
];

const props = defineProps({
  puzzleIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['solved', 'next']);

const puzzleStore = usePuzzleStore();

const puzzle = computed(() => {
  return (puzzleStore.puzzle as StigidDaily)?.puzzles?.[props.puzzleIndex] || {};
});

const stars = computed(() => {
  return puzzleStore.stars[props.puzzleIndex];
});

const isLast = computed(() => {
  return (puzzleStore.puzzle as StigidDaily).puzzles?.length - 1 === props.puzzleIndex;
});

const numbers = computed(() => {
  return (
    puzzleStore.numbers?.[props.puzzleIndex]
      ?.map((n, i) => ({
        ...n,
        selected: selected.value[i],
        extraClasses: extraClasses.value[i],
        extraStyles: extraStyles.value[i],
      }))
      ?.filter((n) => !n.hidden) || []
  );
});

const awaiting = ref(false);

const ops = computed(() => {
  return Object.values(operations).map((op, i) => ({
    ...op,
    display: operatorDisplay[op.symbol as keyof typeof operatorDisplay],
    selected: selectedOperator.value === op.symbol,
  }));
});
const selected = ref([false, false, false, false, false, false]);
const extraClasses = ref(['', '', '', '', '', '']);
const extraStyles = ref([{}, {}, {}, {}, {}, {}]);
const selectedOperator = ref<'*' | '/' | '+' | '-'>();

function select(index: number) {
  if (awaiting.value) return;
  const otherSelected = selected.value.findIndex((v) => {
    return v;
  });
  if (otherSelected === index) {
    selected.value[index] = false;
    return;
  }
  if (selectedOperator.value && otherSelected !== -1) {
    const num1 = numbers.value.find((n) => n.index === otherSelected)!.number;
    const num2 = numbers.value.find((n) => n.index === index)!.number;
    const op = operations[selectedOperator.value];
    if (op?.check(num1, num2)) {
      awaiting.value = true;
      extraStyles.value[otherSelected] = { ...circlePositions[index], zIndex: 0 };
      extraStyles.value[index] = { zIndex: 1 };
      setTimeout(() => {
        puzzleStore.addStep(props.puzzleIndex, { a: num1, b: num2, operationSymbol: op.symbol });
        selected.value = selected.value.map(() => false);
        selectedOperator.value = undefined;
        awaiting.value = false;
        if (op.apply(num1, num2) === puzzle.value.target) {
          emit('solved');
        }
        extraStyles.value[index] = {};
        extraStyles.value[otherSelected] = {};
        extraClasses.value[index] = 'grow';
        setTimeout(() => {
          extraClasses.value[index] = '';
        }, 10);
      }, 250);
    } else {
      awaiting.value = true;
      extraClasses.value[otherSelected] = 'horizontal-shake';
      extraClasses.value[index] = 'horizontal-shake';
      setTimeout(() => {
        selected.value[index] = false;
        selectedOperator.value = undefined;
        awaiting.value = false;
        extraClasses.value[otherSelected] = '';
        extraClasses.value[index] = '';
      }, 500);
    }
    selected.value[index] = true;
    return;
  } else if (otherSelected !== -1) {
    selected.value[otherSelected] = false;
  }
  selected.value[index] = true;
}

function selectOperator(symbol?: string) {
  if (selectedOperator.value === symbol) {
    selectedOperator.value = undefined;
  } else if (selected.value.some((v) => v)) {
    selectedOperator.value = symbol as any;
  }
}

function undo() {
  puzzleStore.undo(props.puzzleIndex);
  selected.value = selected.value.map(() => false);
  selectedOperator.value = undefined;
}

function submit() {
  if (stars.value === 3 && !isLast.value) {
    emit('next');
  } else if (stars.value > 0) {
    emit('solved');
  }
}
</script>

<template>
  <div class="s-puzzle flex col gap-20 justify-c align-c">
    <div class="s-p-target font-sans bold">
      {{ puzzle.target }}
    </div>
    <div class="s-p-numbers">
      <CircleSelect
        v-for="n of numbers"
        class="s-number"
        :class="{ [`s-number-${n.index}`]: true, [n.extraClasses]: true }"
        :style="{ ...n.extraStyles }"
        :key="`number-${n.index}-${n.number}`"
        :selected="n.selected"
        @select="select(n.index)"
      >
        {{ n.number }}
      </CircleSelect>
    </div>
    <div class="s-p-operators flex row gap-05">
      <CircleSelect class="s-operator" small light selected @click.prevent="undo">
        <span class="material-symbols-outlined"> undo </span>
      </CircleSelect>
      <CircleSelect
        class="s-operator"
        small
        light
        v-for="op of ops"
        :key="`operation-${op.symbol}`"
        @click.prevent="selectOperator(op.symbol)"
        :selected="op.selected"
      >
        {{ op.display }}
      </CircleSelect>
    </div>
    <div class="flex col gap-10">
      <SButton light :disabled="stars === 0" class="flex row nowrap align-c gap-10" @click.prevent="submit">
        {{ stars === 3 && !isLast ? 'Next' : 'Submit' }}

        <div class="flex row nowrap justify-c align-c" v-if="stars > 0">
          <span class="s-pt-t-star material-symbols-outlined color-black" v-for="j in stars" :key="`star-${j}`">
            star
          </span>
        </div>
      </SButton>
      <SButton outline v-if="stars === 3 && !isLast" @click.prevent="$emit('solved')"> Review </SButton>
    </div>
  </div>
</template>

<style lang="scss">
.s-puzzle {
  .s-p-target {
    font-size: 50px;
  }
  .s-p-numbers {
    position: relative;
    width: calc(3 * var(--number-size) + 2 * var(--number-padding));
    height: calc(2 * var(--number-size) + var(--number-padding));
  }
  .s-number {
    position: absolute;
    transition: left 250ms ease-in-out, top 250ms ease-in-out, transform 100ms ease-out;
    &.grow {
      transform: scale(1.1);
    }
  }
  .s-number-0,
  .s-number-3 {
    left: 0;
  }
  .s-number-1,
  .s-number-4 {
    left: calc(50% - var(--number-radius));
  }
  .s-number-2,
  .s-number-5 {
    left: calc(100% - var(--number-size));
  }
  .s-number-0,
  .s-number-1,
  .s-number-2 {
    top: 0;
  }
  .s-number-3,
  .s-number-4,
  .s-number-5 {
    top: calc(100% - var(--number-size));
  }
}
</style>
