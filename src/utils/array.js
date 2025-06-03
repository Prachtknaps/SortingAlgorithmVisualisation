export function generateUniqueRandomArray(length, maxMultiplier = 4) {
  const maxRange = length * maxMultiplier;
  const numberSet = new Set();

  while (numberSet.size < length) {
    const num = Math.floor(Math.random() * maxRange) + 1;
    numberSet.add(num);
  }

  return Array.from(numberSet);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
