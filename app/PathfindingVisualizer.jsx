'use client';

import React, { useState, useEffect } from 'react';
import { GRID_ROWS, GRID_COLS } from '../constants';
import VisualizerControls from './VisualizerControls';

/**
 * @type {React.FC<{algorithmId: string}>}
 */
const PathfindingVisualizer = ({ algorithmId }) => {
  const [grid, setGrid] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [startNode, setStartNode] = useState({ row: 10, col: 5 });
  const [finishNode, setFinishNode] = useState({ row: 10, col: 35 });

  const getInitialGrid = () => {
    const nodes = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === startNode.row && col === startNode.col,
          isFinish: row === finishNode.row && col === finishNode.col,
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
  }, [algorithmId]);

  const toggleWall = (row, col) => {
    if (isRunning) return;
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish) return;
    newGrid[row][col] = { ...node, isWall: !node.isWall };
    setGrid(newGrid);
  };

  const visualizeDijkstra = async () => {
    setIsRunning(true);
    const visitedNodesInOrder = [];
    const unvisitedNodes = grid.flat();
    const start = grid[startNode.row][startNode.col];
    start.distance = 0;

    const workingUnvisited = [...unvisitedNodes];

    while (workingUnvisited.length > 0) {
      workingUnvisited.sort((a, b) => a.distance - b.distance);
      const closestNode = workingUnvisited.shift();
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode.isFinish) break;

      updateUnvisitedNeighbors(closestNode, grid);
      
      setGrid([...grid]);
      await new Promise(r => setTimeout(r, 101 - speed));
    }
    setIsRunning(false);
  };

  const updateUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);

    const unvisitedNeighbors = neighbors.filter(n => !n.isVisited);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  return (
    <div className="space-y-6">
      <VisualizerControls 
        onPlay={visualizeDijkstra} 
        onReset={() => setGrid(getInitialGrid())} 
        isRunning={isRunning} 
        speed={speed} 
        setSpeed={setSpeed} 
      >
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Start</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> End</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-600 rounded-sm"></div> Wall</div>
        </div>
      </VisualizerControls>

      <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-2xl overflow-auto flex justify-center">
        <div 
          className="grid gap-px bg-slate-700 border border-slate-700"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1.5rem)` }}
        >
          {grid.map((row, rowIdx) => (
            row.map((node, nodeIdx) => (
              <div
                key={`${rowIdx}-${nodeIdx}`}
                onMouseDown={() => toggleWall(rowIdx, nodeIdx)}
                className={`w-6 h-6 transition-all duration-300 ${
                  node.isStart ? 'bg-indigo-500 scale-90 rounded-full shadow-[0_0_10px_#6366f1]' :
                  node.isFinish ? 'bg-rose-500 scale-90 rounded-full shadow-[0_0_10px_#f43f5e]' :
                  node.isWall ? 'bg-slate-600' :
                  node.isVisited ? 'bg-cyan-500/40 animate-pulse' :
                  'bg-slate-900'
                } hover:bg-slate-700 cursor-pointer`}
              />
            ))
          ))}
        </div>
      </div>
      <p className="text-center text-slate-500 text-sm">Click on the grid to place walls and guide the algorithm!</p>
    </div>
  );
};

export default PathfindingVisualizer;
