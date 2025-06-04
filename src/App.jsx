import React, { useState, useRef } from "react";
import { generateUniqueRandomArray, shuffleArray } from "./utils/array";
import {
  selectionSort,
  insertionSort,
  bubbleSort,
  quicksortMedian,
  quicksortRandom,
  mergeSortRecursive,
  mergeSortStraight,
  mergeSortNatural,
  heapSort,
} from "./utils/algorithms";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [algorithms] = useState([
    "Selection Sort",
    "Insertion Sort",
    "Bubblesort",
    "Quicksort (3-Median-Strategy)",
    "Quicksort (Random)",
    "Merge Sort (2-Way)",
    "Merge Sort (Straight-2-Way)",
    "Merge Sort (Natural)",
    "Heap Sort",
  ]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Selection Sort");
  const [elements, setElements] = useState([]);
  const [biggestElement, setBiggestElement] = useState(0);
  const [elementCountInput, setElementCountInput] = useState(25);
  const [manualInput, setManualInput] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);
  const [speed, setSpeed] = useState(25);
  const [isSorting, setIsSorting] = useState(false);
  const [displayedSteps, setDisplayedSteps] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState(null);

  const cancelSort = useRef(false);

  const parseManualList = () => {
    return manualInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
  };

  const generateList = () => {
    let list = [];

    if (useManualInput) {
      list = parseManualList();
    } else {
      const count = parseInt(elementCountInput) || 25;
      list = generateUniqueRandomArray(count);
    }

    if (list.length < 2) {
      alert("Please enter at least two valid numbers.");
      return;
    }

    const max = Math.max(...list);
    setElements(list);
    setBiggestElement(max);
    setDisplayedSteps([]);
    setHighlightedIndices(null);
    cancelSort.current = false;
  };

  const handleShuffle = () => {
    if (elements.length < 2 || isSorting) return;

    const shuffled = shuffleArray([...elements]);
    setElements(shuffled);
    setDisplayedSteps([]);
    setHighlightedIndices(null);
    cancelSort.current = false;
  };

  const handleSort = async () => {
    if (isSorting || elements.length < 2) return;
    setIsSorting(true);
    cancelSort.current = false;
    setDisplayedSteps([]);
    setHighlightedIndices(null);

    let steps = [];

    switch (selectedAlgorithm) {
      case "Selection Sort":
        steps = selectionSort(elements);
        break;
      case "Insertion Sort":
        steps = insertionSort(elements);
        break;
      case "Bubblesort":
        steps = bubbleSort(elements);
        break;
      case "Quicksort (3-Median-Strategy)":
        steps = quicksortMedian(elements);
        break;
      case "Quicksort (Random)":
        steps = quicksortRandom(elements);
        break;
      case "Merge Sort (2-Way)":
        steps = mergeSortRecursive(elements);
        break;
      case "Merge Sort (Straight-2-Way)":
        steps = mergeSortStraight(elements);
        break;
      case "Merge Sort (Natural)":
        steps = mergeSortNatural(elements);
        break;
      case "Heap Sort":
        steps = heapSort(elements);
        break;
      default:
        setIsSorting(false);
        return;
    }

    for (let i = 0; i < steps.length; i++) {
      if (cancelSort.current) break;

      const { array: currentArray, highlight, swapped, pivot } = steps[i];

      setElements(currentArray);
      setHighlightedIndices(highlight);

      setDisplayedSteps((prev) => {
        const last = prev[prev.length - 1];
        const isSame =
          last && last.array.length === currentArray.length && last.array.every((val, idx) => val === currentArray[idx]);

        if (!isSame || highlight) {
          return [...prev, { array: currentArray, highlight, swapped, pivot }];
        }
        return prev;
      });

      await sleep(speed);
    }

    setIsSorting(false);
    setHighlightedIndices(null);
  };

  const handleCancel = () => {
    cancelSort.current = true;
  };

  const currentStep = displayedSteps[displayedSteps.length - 1];
  const currentPivot = currentStep?.pivot;

  return (
    <main style={{ padding: "1rem" }}>
      <div className="controls">
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={useManualInput}
              onChange={() => setUseManualInput((prev) => !prev)}
              disabled={isSorting}
            />{" "}
            Enter list manually
          </label>
        </div>

        {!useManualInput ? (
          <div style={{ marginBottom: "1rem" }}>
            <label>How many elements do you want?</label>
            <input
              type="number"
              value={elementCountInput}
              onChange={(e) => setElementCountInput(e.target.value)}
              disabled={isSorting}
              min={2}
              max={200}
            />
          </div>
        ) : (
          <div style={{ marginBottom: "1rem" }}>
            <label>Enter comma-separated numbers:</label>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              disabled={isSorting}
              rows={3}
              style={{ width: "100%" }}
              placeholder="e.g. 5,3,12,8"
            />
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label>Speed (ms per step):</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={isSorting}
            min={2}
            max={2000}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Choose algorithm:</label>
          <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)} disabled={isSorting}>
            {algorithms.map((algo, index) => (
              <option key={index} value={algo}>
                {algo}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button onClick={generateList} disabled={isSorting}>
            Load List
          </button>
          <button onClick={handleShuffle} disabled={isSorting || elements.length < 2} style={{ marginLeft: "0.5rem" }}>
            Shuffle
          </button>

          <button onClick={handleSort} disabled={isSorting || elements.length < 2} style={{ marginLeft: "0.5rem" }}>
            {isSorting ? "Sorting..." : "Sort"}
          </button>
          <button onClick={handleCancel} disabled={!isSorting} style={{ marginLeft: "0.5rem" }}>
            Cancel
          </button>
        </div>
      </div>

      <div
        className="canvas"
        style={{
          width: "100%",
          maxWidth: "32rem",
          height: "32rem",
          padding: "1.5rem 1.0rem 1.0rem",
          backgroundColor: "#eee",
          border: "1px solid #ccc",
        }}
      >
        <div
          className="element-container"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {elements.map((el, i) => {
            const isHighlighted = highlightedIndices && (i === highlightedIndices.i || i === highlightedIndices.j);

            let backgroundColor = "black";
            if (isHighlighted) backgroundColor = "red";
            else if (currentPivot === i) backgroundColor = "green";

            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor,
                  left: `${(i / (elements.length - 1)) * 100}%`,
                  bottom: `${(el / biggestElement) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={el}
              ></span>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Sort Steps (Live)</h3>
        <ul
          style={{
            paddingLeft: "1rem",
            lineHeight: "1.5",
            fontFamily: "monospace",
          }}
        >
          {displayedSteps.map(({ array, highlight, swapped, pivot }, index) => (
            <li key={index}>
              {array
                .map((num, i) => {
                  const isCompared = highlight && (i === highlight.i || i === highlight.j);
                  const isPivot = pivot === i;

                  if (isCompared) {
                    return (
                      <strong key={i} style={{ color: swapped ? "red" : "inherit" }}>
                        {num}
                      </strong>
                    );
                  }

                  if (isPivot) {
                    return (
                      <strong key={i} style={{ color: "orange" }}>
                        {num}
                      </strong>
                    );
                  }

                  return <span key={i}>{num}</span>;
                })
                .reduce((prev, curr) => [prev, ", ", curr])}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default App;
