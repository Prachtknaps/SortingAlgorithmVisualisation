import React, { useState, useRef } from "react";
import { generateUniqueRandomArray } from "./utils/array";
import { selectionSort, bubbleSort } from "./utils/algorithms";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [algorithms] = useState(["Selection Sort", "Bubblesort"]);
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
      case "Bubblesort":
        steps = bubbleSort(elements);
        break;
      default:
        setIsSorting(false);
        return;
    }

    for (let i = 0; i < steps.length; i++) {
      if (cancelSort.current) break;

      const { array: currentArray, highlight, swapped } = steps[i];

      setElements(currentArray);
      setHighlightedIndices(highlight);

      setDisplayedSteps((prev) => {
        const last = prev[prev.length - 1];
        const isSame =
          last && last.array.length === currentArray.length && last.array.every((val, idx) => val === currentArray[idx]);

        if (!isSame || highlight) {
          return [...prev, { array: currentArray, highlight, swapped }];
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
            min={10}
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
          display: "flex",
          alignItems: "flex-end",
          height: "200px",
          gap: "1px",
          border: "1px solid #ccc",
          marginTop: "2rem",
        }}
      >
        {elements.map((el, i) => {
          const isHighlighted = highlightedIndices && (i === highlightedIndices.i || i === highlightedIndices.j);
          return (
            <span
              key={i}
              style={{
                width: `${100 / elements.length}%`,
                backgroundColor: isHighlighted ? "red" : "blue",
                height: `${(el / biggestElement) * 100}%`,
                display: "inline-block",
              }}
            ></span>
          );
        })}
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
          {displayedSteps.map(({ array, highlight, swapped }, index) => (
            <li key={index}>
              {array
                .map((num, i) => {
                  const isCompared = highlight && (i === highlight.i || i === highlight.j);

                  if (isCompared) {
                    return (
                      <strong key={i} style={{ color: swapped ? "red" : "inherit" }}>
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
