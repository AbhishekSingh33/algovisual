'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import VisualizerControls from './VisualizerControls';

const ARRAY_SIZE = 40;

/**
 * @type {React.FC<{algorithmId: string}>}
 */
const SortingVisualizer = ({ algorithmId }) => {
  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const stopSignal = useRef(false);

  const resetArray = useCallback(() => {
    stopSignal.current = true;
    let newArray = Array.from({ length: ARRAY_SIZE }, () => ({
      value: Math.floor(Math.random() * 300) + 50,
      status: 'idle'
    }));
    
    if (algorithmId === 'binary-search') {
      newArray.sort((a, b) => a.value - b.value);
    }

    setArray(newArray);
    setIsRunning(false);
  }, [algorithmId]);

  useEffect(() => { resetArray(); }, [resetArray, algorithmId]);

  const sleep = () => new Promise(r => setTimeout(r, 101 - speed));

  const bubbleSort = async () => {
    stopSignal.current = false;
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (stopSignal.current) return;
        arr[j].status = 'comparing'; arr[j+1].status = 'comparing';
        setArray([...arr]); await sleep();
        if (arr[j].value > arr[j + 1].value) {
          arr[j].status = 'swapping'; arr[j+1].status = 'swapping';
          setArray([...arr]); await sleep();
          [arr[j].value, arr[j+1].value] = [arr[j+1].value, arr[j].value];
        }
        arr[j].status = 'idle'; arr[j+1].status = 'idle';
      }
      arr[arr.length - i - 1].status = 'sorted';
      setArray([...arr]);
    }
    arr[0].status = 'sorted';
    setArray([...arr]);
    setIsRunning(false);
  };

  const insertionSort = async () => {
    stopSignal.current = false;
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i].value;
      let j = i - 1;
      arr[i].status = 'comparing';
      setArray([...arr]); await sleep();
      
      while (j >= 0 && arr[j].value > key) {
        if (stopSignal.current) return;
        arr[j + 1].status = 'swapping';
        arr[j + 1].value = arr[j].value;
        j = j - 1;
        setArray([...arr]); await sleep();
        arr[j+2] ? arr[j+2].status = 'idle' : null;
      }
      arr[j + 1].value = key;
      arr[j + 1].status = 'sorted';
      setArray([...arr]);
    }
    arr.forEach(b => b.status = 'sorted');
    setArray([...arr]);
    setIsRunning(false);
  };

  const heapSort = async () => {
    stopSignal.current = false;
    const arr = [...array];
    const n = arr.length;

    const heapify = async (n, i) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      if (l < n) {
        arr[l].status = 'comparing'; arr[largest].status = 'comparing';
        setArray([...arr]); await sleep();
        if (arr[l].value > arr[largest].value) largest = l;
        arr[l].status = 'idle'; arr[i].status = 'idle';
      }

      if (r < n) {
        arr[r].status = 'comparing'; arr[largest].status = 'comparing';
        setArray([...arr]); await sleep();
        if (arr[r].value > arr[largest].value) largest = r;
        arr[r].status = 'idle';
      }

      if (largest !== i) {
        [arr[i].value, arr[largest].value] = [arr[largest].value, arr[i].value];
        arr[i].status = 'swapping'; arr[largest].status = 'swapping';
        setArray([...arr]); await sleep();
        arr[i].status = 'idle'; arr[largest].status = 'idle';
        await heapify(n, largest);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (stopSignal.current) return;
      await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      if (stopSignal.current) return;
      [arr[0].value, arr[i].value] = [arr[i].value, arr[0].value];
      arr[i].status = 'sorted';
      setArray([...arr]); await sleep();
      await heapify(i, 0);
    }
    arr[0].status = 'sorted';
    setArray([...arr]);
    setIsRunning(false);
  };

  const mergeSort = async () => {
    stopSignal.current = false;
    const arr = [...array];
    
    const merge = async (l, m, r) => {
      let left = arr.slice(l, m + 1).map(x => ({...x}));
      let right = arr.slice(m + 1, r + 1).map(x => ({...x}));
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        if (stopSignal.current) return;
        arr[k].status = 'comparing'; setArray([...arr]); await sleep();
        if (left[i].value <= right[j].value) { arr[k].value = left[i].value; i++; }
        else { arr[k].value = right[j].value; j++; }
        arr[k].status = 'swapping'; setArray([...arr]); await sleep();
        arr[k].status = 'idle'; k++;
      }
      while (i < left.length) { arr[k].value = left[i].value; i++; arr[k].status = 'swapping'; setArray([...arr]); await sleep(); arr[k].status = 'idle'; k++; }
      while (j < right.length) { arr[k].value = right[j].value; j++; arr[k].status = 'swapping'; setArray([...arr]); await sleep(); arr[k].status = 'idle'; k++; }
    };

    const sort = async (l, r) => {
      if (l >= r) return;
      let m = Math.floor((l + r) / 2);
      await sort(l, m);
      await sort(m + 1, r);
      await merge(l, m, r);
      for(let x=l; x<=r; x++) { arr[x].status = 'sorted'; }
      setArray([...arr]);
    };

    await sort(0, arr.length - 1);
    setIsRunning(false);
  };

  const runQuickSort = async () => {
    stopSignal.current = false;
    const arr = [...array];
    const partition = async (low, high) => {
      let pivot = arr[high].value;
      arr[high].status = 'pivot';
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (stopSignal.current) return -1;
        arr[j].status = 'comparing'; setArray([...arr]); await sleep();
        if (arr[j].value < pivot) {
          i++; [arr[i].value, arr[j].value] = [arr[j].value, arr[i].value];
          arr[i].status = 'swapping'; setArray([...arr]); await sleep();
        }
        arr[j].status = 'idle';
      }
      [arr[i + 1].value, arr[high].value] = [arr[high].value, arr[i + 1].value];
      arr[i + 1].status = 'sorted'; setArray([...arr]);
      return i + 1;
    };
    const sort = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        if (pi === -1) return;
        await sort(low, pi - 1); await sort(pi + 1, high);
      } else if (low === high) { arr[low].status = 'sorted'; setArray([...arr]); }
    };
    await sort(0, arr.length - 1);
    setIsRunning(false);
  };

  const runBinarySearch = async () => {
    stopSignal.current = false;
    const arr = [...array];
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    let l = 0, r = arr.length - 1;
    while(l <= r && !stopSignal.current) {
      let m = Math.floor((l+r)/2);
      arr[m].status = 'comparing'; setArray([...arr]); await sleep();
      if(arr[m].value === target) { arr[m].status = 'sorted'; setArray([...arr]); break; }
      if(arr[m].value < target) { for(let i=l; i<=m; i++) arr[i].status = 'idle'; l = m + 1; } 
      else { for(let i=m; i<=r; i++) arr[i].status = 'idle'; r = m - 1; }
      setArray([...arr]); await sleep();
    }
    setIsRunning(false);
  };

  const linearSearch = async () => {
    stopSignal.current = false;
    const arr = [...array];
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    for (let i = 0; i < arr.length; i++) {
      if (stopSignal.current) return;
      arr[i].status = 'comparing';
      setArray([...arr]); await sleep();
      if (arr[i].value === target) {
        arr[i].status = 'sorted';
        setArray([...arr]);
        break;
      }
      arr[i].status = 'idle';
    }
    setIsRunning(false);
  };

  const startAlgo = () => {
    setIsRunning(true);
    if (algorithmId === 'bubble-sort') bubbleSort();
    else if (algorithmId === 'quick-sort') runQuickSort();
    else if (algorithmId === 'heap-sort') heapSort();
    else if (algorithmId === 'merge-sort') mergeSort();
    else if (algorithmId === 'insertion-sort') insertionSort();
    else if (algorithmId === 'binary-search') runBinarySearch();
    else if (algorithmId === 'linear-search') linearSearch();
    else bubbleSort(); 
  };

  return (
    <div className="space-y-8">
      <VisualizerControls onPlay={startAlgo} onReset={resetArray} onShuffle={resetArray} isRunning={isRunning} speed={speed} setSpeed={setSpeed} />
      <div className="bg-slate-950 p-6 lg:p-10 rounded-[2.5rem] border border-slate-800 h-[350px] lg:h-[450px] flex items-end justify-center gap-1 lg:gap-1.5 overflow-hidden shadow-2xl relative">
        {array.map((bar, idx) => (
          <div key={idx} className={`w-full rounded-t-lg transition-all duration-200 ${
            bar.status === 'idle' ? 'bg-slate-800' :
            bar.status === 'comparing' ? 'bg-indigo-400 scale-x-110 shadow-lg' :
            bar.status === 'swapping' ? 'bg-rose-500 scale-x-125 z-10' :
            bar.status === 'pivot' ? 'bg-yellow-500 scale-y-110' :
            'bg-emerald-500 shadow-xl'
          }`} style={{ height: `${(bar.value / 350) * 100}%` }} />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
