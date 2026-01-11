'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GRID_ROWS, GRID_COLS } from '../constants';
import VisualizerControls from './VisualizerControls';

/**
 * @type {React.FC<{algorithmId: string}>}
 */
const GridVisualizer = ({ algorithmId }) => {
  const [grid, setGrid] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const stopSignal = useRef(false);

  const getInitialGrid = () => {
    const nodes = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row, col,
          isStart: row === 7 && col === 5,
          isFinish: row === 7 && col === 25,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        });
      }
      nodes.push(currentRow);
    }
    return nodes;
  };

  useEffect(() => {
    setGrid(getInitialGrid());
    stopSignal.current = true;
  }, [algorithmId]);

  const toggleWall = (row, col) => {
    if (isRunning) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish) return;
    newGrid[row][col] = { ...node, isWall: !node.isWall };
    setGrid(newGrid);
  };

  const sleep = () => new Promise(r => setTimeout(r, 101 - speed));

  const runBFS = async () => {
    stopSignal.current = false;
    const q = [grid[7][5]];
    grid[7][5].isVisited = true;
    grid[7][5].distance = 0;
    
    while (q.length) {
      if (stopSignal.current) break;
      const curr = q.shift();
      if (curr.isFinish) { await animatePath(curr); break; }

      const neighbors = getNeighbors(curr);
      for (const n of neighbors) {
        if (!n.isVisited && !n.isWall) {
          n.isVisited = true;
          n.previousNode = curr;
          q.push(n);
          setGrid([...grid]);
          await sleep();
        }
      }
    }
    setIsRunning(false);
  };

  const runDFS = async () => {
    stopSignal.current = false;
    const stack = [grid[7][5]];
    
    while(stack.length && !stopSignal.current) {
      const curr = stack.pop();
      if(curr.isVisited) continue;
      curr.isVisited = true;
      setGrid([...grid]); 
      await sleep();
      if(curr.isFinish) { await animatePath(curr); break; }
      
      const neighbors = getNeighbors(curr);
      for(const n of neighbors) {
        if(!n.isVisited && !n.isWall) {
          n.previousNode = curr;
          stack.push(n);
        }
      }
    }
    setIsRunning(false);
  };

  const runDijkstra = async () => {
    stopSignal.current = false;
    const unvisited = grid.flat();
    grid[7][5].distance = 0;
    
    while(unvisited.length && !stopSignal.current) {
      unvisited.sort((a,b) => a.distance - b.distance);
      const closest = unvisited.shift();
      if(closest.isWall) continue;
      if(closest.distance === Infinity) break;
      closest.isVisited = true;
      setGrid([...grid]); 
      await sleep();
      if(closest.isFinish) { await animatePath(closest); break; }
      
      const neighbors = getNeighbors(closest);
      for(const n of neighbors) {
        const alt = closest.distance + 1;
        if(alt < n.distance) {
          n.distance = alt;
          n.previousNode = closest;
        }
      }
    }
    setIsRunning(false);
  };

  const animatePath = async (finishNode) => {
    let curr = finishNode;
    while(curr && !stopSignal.current) {
      curr.isPath = true;
      setGrid([...grid]);
      await sleep();
      curr = curr.previousNode;
    }
  };

  const getNeighbors = (node) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const startAlgo = () => {
    setIsRunning(true);
    if (algorithmId === 'bfs') runBFS();
    else if (algorithmId === 'dfs') runDFS();
    else if (algorithmId === 'dijkstra') runDijkstra();
    else runBFS();
  };

  return (
    <div className="space-y-6">
      <VisualizerControls onPlay={startAlgo} onReset={() => { stopSignal.current = true; setGrid(getInitialGrid()); setIsRunning(false); }} isRunning={isRunning} speed={speed} setSpeed={setSpeed} />
      <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-2xl overflow-auto flex justify-center">
        <div className="grid gap-0.5 bg-slate-800 p-0.5 border border-slate-700" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0.75rem, 1.25rem))` }}>
          {grid.map((row, rIdx) => row.map((node, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              onMouseDown={() => toggleWall(rIdx, cIdx)}
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ${
                node.isStart ? 'bg-indigo-500 rounded-full scale-75' :
                node.isFinish ? 'bg-rose-500 rounded-full scale-75' :
                node.isPath ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' :
                node.isWall ? 'bg-slate-600' :
                node.isVisited ? 'bg-cyan-500/30' : 'bg-slate-900'
              } hover:bg-slate-800 cursor-pointer`}
            />
          )))}
        </div>
      </div>
      <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        Click grid to place Walls // Yellow indicates the shortest path found
      </p>
    </div>
  );
};

export default GridVisualizer;