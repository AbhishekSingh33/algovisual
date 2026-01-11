'use client';

import React, { useState, useEffect } from 'react';
import VisualizerControls from './VisualizerControls';

/**
 * @typedef {Object} TreeNode
 * @property {number} id
 * @property {number} val
 * @property {TreeNode | null} left
 * @property {TreeNode | null} right
 * @property {number} x
 * @property {number} y
 * @property {'idle' | 'visiting' | 'visited'} status
 */

/**
 * @type {React.FC<{algorithmId: string}>}
 */
const TreeVisualizer = ({ algorithmId }) => {
  const [nodes, setNodes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);

  const generateTree = () => {
    const root = { id: 0, val: 50, left: null, right: null, x: 400, y: 50, status: 'idle' };
    const allNodes = [root];
    
    const insert = (node, val, level, offset) => {
      if (level > 3) return;
      const newNode = { 
        id: allNodes.length, 
        val, 
        left: null, 
        right: null, 
        x: node.x + offset, 
        y: node.y + 80, 
        status: 'idle' 
      };
      allNodes.push(newNode);
      if (offset < 0) node.left = newNode; else node.right = newNode;
      insert(newNode, val - 10, level + 1, -120 / (level + 1));
      insert(newNode, val + 10, level + 1, 120 / (level + 1));
    };

    insert(root, 30, 1, -150);
    insert(root, 70, 1, 150);
    setNodes([...allNodes]);
  };

  useEffect(() => { generateTree(); }, [algorithmId]);

  const sleep = () => new Promise(r => setTimeout(r, 1001 - speed * 10));

  const runTraversal = async () => {
    setIsRunning(true);
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
    
    const visit = async (node, type) => {
      if (!node) return;

      if (type === 'pre') {
        node.status = 'visiting'; setNodes(prev => prev.map(n => n.id === node.id ? { ...node } : n)); await sleep();
      }

      await visit(node.left, type);

      if (type === 'in') {
        node.status = 'visiting'; setNodes(prev => prev.map(n => n.id === node.id ? { ...node } : n)); await sleep();
      }

      await visit(node.right, type);

      if (type === 'post') {
        node.status = 'visiting'; setNodes(prev => prev.map(n => n.id === node.id ? { ...node } : n)); await sleep();
      }

      node.status = 'visited';
      setNodes(prev => prev.map(n => n.id === node.id ? { ...node } : n));
      await sleep();
    };

    const type = algorithmId.includes('preorder') ? 'pre' : algorithmId.includes('postorder') ? 'post' : 'in';
    await visit(nodes[0], type);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <VisualizerControls onPlay={runTraversal} onReset={() => { generateTree(); setIsRunning(false); }} isRunning={isRunning} speed={speed} setSpeed={setSpeed} />
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 h-[450px] relative overflow-hidden flex items-center justify-center">
        <svg width="800" height="400" className="drop-shadow-2xl overflow-visible">
          {nodes.map(node => (
            <React.Fragment key={`line-${node.id}`}>
              {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#334155" strokeWidth="2" />}
              {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#334155" strokeWidth="2" />}
            </React.Fragment>
          ))}
          {nodes.map(node => (
            <g key={`node-${node.id}`} transform={`translate(${node.x},${node.y})`}>
              <circle r="18" fill={node.status === 'visiting' ? '#818cf8' : node.status === 'visited' ? '#10b981' : '#1e293b'} stroke="#475569" strokeWidth="2" className="transition-all duration-300" />
              <text dy=".3em" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{node.val}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        Visualizing {algorithmId.replace('-', ' ').toUpperCase()} // Green indicates completion
      </p>
    </div>
  );
};

export default TreeVisualizer;
