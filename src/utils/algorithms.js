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
