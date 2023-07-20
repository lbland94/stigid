/**
 * Gets a random integer between the passed arguments
 */
export function randomIntBetween(min: number, max: number) {
  const rand = Math.random() * (max - min);
  return Math.floor(rand) + min;
}

/**
 * Picks n random numbers from a list of weighted options
 */
export function weightedRandomNoReplacement(
  groups: Array<{
    max: number;
    options: number[];
    weights: number[];
    weight: number;
  }>,
  count: number
) {
  const maxes = groups.reduce((acc, g) => [...acc, g.max], []);
  const totalOpts = groups.reduce((acc, g) => [...acc, ...g.options], []);
  const totalWeights = groups.reduce(
    (acc, g) => [...acc, ...g.weights.map((w) => w * g.weight)],
    []
  );
  const accWeights = accumulateWeights(totalWeights);
  const sample: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < count; i++) {
    const random = Math.random() * accWeights[accWeights.length - 1];
    const index = findArrayIndex(accWeights, random);

    sample.push(totalOpts[index]);
    indices.push(index);

    // Remove item from options
    const origWeight = totalWeights[index];
    for (let j = index; j < accWeights.length; j++) {
      accWeights[j] -= origWeight;
    }

    // If reaching max for group, remove group from options
    let start = 0;
    const groupIndex = groups.findIndex((g) => {
      if (g.options.length + start > index) return true;
      start += g.options.length;
      return false;
    });
    const end = groups[groupIndex].options.length + start;
    maxes[groupIndex] -= 1;
    const startWeight = start === 0 ? 0 : accWeights[start - 1];
    const removeWeight = accWeights[end] - startWeight;
    if (maxes[groupIndex] === 0) {
      for (let j = start; j < end; j++) {
        accWeights[j] = startWeight;
      }
      for (let j = end; j < accWeights.length; j++) {
        accWeights[j] -= removeWeight;
      }
    }
  }
  return sample.sort((a, b) => a - b);
}

/**
 * Generates a random integer between min and max with primes less likely
 */
export function randomIntPrimesUnlikely(
  min: number,
  max: number,
  unlikeliness: number = 30
) {
  const trials = couponCollector(min - max);
  let candidate = randomIntBetween(min, max);
  let i = 0;
  while (probablyPrime(candidate, unlikeliness) && i++ < trials) {
    candidate = randomIntBetween(min, max);
  }
  return candidate;
}

function couponCollector(n: number) {
  return n * Math.log(n);
}

function decompose(n: number) {
  let exponentOfTwo = 0;
  let val = n;
  while (val % 2 === 0) {
    val = val / 2;
    exponentOfTwo += 1;
  }
  return [exponentOfTwo, val];
}
function isWitness(
  possibleWitness: number,
  p: number,
  exponent: number,
  remainder: number
) {
  let pw = Math.pow(possibleWitness, remainder) % p;
  if (pw === 1 || pw === p - 1) {
    return false;
  }

  for (let i = 0; i < exponent; i++) {
    pw = Math.pow(pw, 2) % p;
    if (pw === p - 1) {
      return false;
    }
  }
  return true;
}
function probablyPrime(p: number, accuracy = 100): boolean {
  if (p === 2 || p === 3) return true;
  if (p < 2) return false;

  const [exponent, remainder] = decompose(p - 1);
  for (let i = 0; i < accuracy; i++) {
    const possibleWitness = randomIntBetween(2, p - 2);
    if (isWitness(possibleWitness, p, exponent, remainder)) {
      return false;
    }
  }
  return true;
}

function accumulateWeights(weights: number[]) {
  return weights.reduce((acc, num, i) => {
    if (i === 0) return [num];
    return [...acc, +num + acc[i - 1]];
  }, []);
}

function findArrayIndex(arr: number[], target: number) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (arr[m] < target) {
      l = m + 1;
    } else if (arr[m] >= target) {
      r = m - 1;
    }
  }
  return l;
}
