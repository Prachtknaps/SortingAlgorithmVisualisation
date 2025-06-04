/* ===== Selection Sort ===== */

export function selectionSort(array) {
  const arr = [...array];
  const steps = [];

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      const highlight = { i: minIndex, j };

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }

      steps.push({
        array: [...arr],
        highlight,
        swapped: false,
      });
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        array: [...arr],
        highlight: { i, j: minIndex },
        swapped: true,
      });
    }
  }

  return steps;
}

/* ===== Insertion Sort ===== */

export function insertionSort(array) {
  const arr = [...array];
  const steps = [];

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    const t = arr[i];

    while (j > 0 && arr[j - 1] > t) {
      steps.push({
        array: [...arr],
        highlight: { i: j - 1, j },
        swapped: false,
      });

      arr[j] = arr[j - 1];
      j--;

      steps.push({
        array: [...arr],
        highlight: { i: j, j: j + 1 },
        swapped: true,
      });
    }

    arr[j] = t;

    steps.push({
      array: [...arr],
      highlight: { i: j, j: i },
      swapped: j !== i,
    });
  }

  return steps;
}

/* ===== Bubblesort ===== */

export function bubbleSort(array) {
  const arr = [...array];
  const steps = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      const highlight = { i: j, j: j + 1 };
      const before = [...arr];

      const swapped = arr[j] > arr[j + 1];
      if (swapped) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }

      steps.push({
        array: before,
        highlight,
        swapped,
      });
    }
  }

  return steps;
}

/* ===== Quicksort ===== */

function medianOfThree(arr, a, b, c) {
  const values = [
    { index: a, value: arr[a] },
    { index: b, value: arr[b] },
    { index: c, value: arr[c] },
  ];
  values.sort((x, y) => x.value - y.value);
  return values[1].index;
}

function partition(arr, l, r, steps, pivotStrategy = "median") {
  let pivotIndex;

  if (pivotStrategy === "median") {
    const m = Math.floor((l + r) / 2);
    pivotIndex = medianOfThree(arr, l, m, r);
  } else if (pivotStrategy === "random") {
    pivotIndex = l + Math.floor(Math.random() * (r - l + 1));
  } else {
    pivotIndex = r;
  }

  [arr[pivotIndex], arr[r]] = [arr[r], arr[pivotIndex]];
  steps.push({
    array: [...arr],
    highlight: { i: pivotIndex, j: r },
    swapped: true,
    pivot: r,
  });

  const pivot = arr[r];
  let i = l;

  for (let j = l; j < r; j++) {
    steps.push({
      array: [...arr],
      highlight: { i: j, j: r },
      swapped: false,
      pivot: r,
    });

    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({
        array: [...arr],
        highlight: { i, j },
        swapped: true,
        pivot: r,
      });
      i++;
    }
  }

  [arr[i], arr[r]] = [arr[r], arr[i]];
  steps.push({
    array: [...arr],
    highlight: { i, j: r },
    swapped: true,
    pivot: i,
  });

  return i;
}

function quicksortRecursive(arr, l, r, steps, strategy) {
  if (l < r) {
    const p = partition(arr, l, r, steps, strategy);
    quicksortRecursive(arr, l, p - 1, steps, strategy);
    quicksortRecursive(arr, p + 1, r, steps, strategy);
  }
}

export function quicksortMedian(array) {
  const arr = [...array];
  const steps = [];
  quicksortRecursive(arr, 0, arr.length - 1, steps, "median");
  return steps;
}

export function quicksortRandom(array) {
  const arr = [...array];
  const steps = [];
  quicksortRecursive(arr, 0, arr.length - 1, steps, "random");
  return steps;
}

/* ===== Merge Sort ===== */

function mergeWithSteps(arr, l, m, r, steps) {
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);

  let i = 0,
    j = 0,
    k = l;

  while (i < left.length && j < right.length) {
    steps.push({ array: [...arr], highlight: { i: k }, swapped: false });

    if (left[i] <= right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }
    k++;
    steps.push({ array: [...arr], highlight: { i: k - 1 }, swapped: true });
  }

  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}

export function mergeSortRecursive(array) {
  const arr = [...array];
  const steps = [];

  function sort(l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      sort(l, m);
      sort(m + 1, r);
      mergeWithSteps(arr, l, m, r, steps);
    }
  }

  sort(0, arr.length - 1);
  return steps;
}

export function mergeSortStraight(array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;
  let size = 1;

  while (size < n) {
    let l = 0;
    while (l < n - size) {
      const m = l + size - 1;
      const r = Math.min(l + 2 * size - 1, n - 1);
      mergeWithSteps(arr, l, m, r, steps);
      l = r + 1;
    }
    size *= 2;
  }

  return steps;
}

export function mergeSortNatural(array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;

  while (true) {
    let l = 0;
    let changed = false;

    while (l < n - 1) {
      let m = l;
      while (m < n - 1 && arr[m] <= arr[m + 1]) m++;

      if (m === n - 1) break;

      let r = m + 1;
      while (r < n - 1 && arr[r] <= arr[r + 1]) r++;

      mergeWithSteps(arr, l, m, r, steps);
      l = r + 1;
      changed = true;
    }

    if (!changed) break;
  }

  return steps;
}

/* ===== Heap Sort ===== */

export function heapSort(array) {
  const arr = [...array];
  const steps = [];

  const heapify = (n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      steps.push({ array: [...arr], highlight: { i, j: largest }, swapped: true });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(n, largest);
    } else {
      steps.push({ array: [...arr], highlight: { i, j: largest }, swapped: false });
    }
  };

  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    steps.push({ array: [...arr], highlight: { i: 0, j: i }, swapped: true });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }

  return steps;
}
