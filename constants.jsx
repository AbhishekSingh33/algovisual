'use client';

/**
 * @type {Array<{id: string; name: string; category: string; description: string; complexity: {time: string; space: string}}>}
 */
export const ALGORITHMS = [
  // 1. SORTING
  { id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting', description: 'O(n²), foundational algorithm.', complexity: { time: 'O(n²)', space: 'O(1)' } },
  { id: 'quick-sort', name: 'Quick Sort', category: 'sorting', description: 'O(n log n) average, widely used in practice.', complexity: { time: 'O(n log n)', space: 'O(log n)' } },
  { id: 'merge-sort', name: 'Merge Sort', category: 'sorting', description: 'O(n log n), divide-and-conquer approach.', complexity: { time: 'O(n log n)', space: 'O(n)' } },
  { id: 'insertion-sort', name: 'Insertion Sort', category: 'sorting', description: 'O(n²), efficient for small datasets.', complexity: { time: 'O(n²)', space: 'O(1)' } },
  { id: 'heap-sort', name: 'Heap Sort', category: 'sorting', description: 'O(n log n), in-place sorting using a heap.', complexity: { time: 'O(n log n)', space: 'O(1)' } },
  { id: 'counting-sort', name: 'Counting Sort', category: 'sorting', description: 'O(n+k), non-comparative sorting.', complexity: { time: 'O(n+k)', space: 'O(k)' } },
  { id: 'radix-sort', name: 'Radix Sort', category: 'sorting', description: 'O(nk), for integers using digits.', complexity: { time: 'O(nk)', space: 'O(n+k)' } },
  
  // 2. SEARCHING
  { id: 'binary-search', name: 'Binary Search', category: 'searching', description: 'O(log n), essential for sorted data.', complexity: { time: 'O(log n)', space: 'O(1)' } },
  { id: 'linear-search', name: 'Linear Search', category: 'searching', description: 'O(n), basic searching through every element.', complexity: { time: 'O(n)', space: 'O(1)' } },

  // 3. GRAPH
  { id: 'bfs', name: 'Breadth-First Search (BFS)', category: 'graph', description: 'Level-order traversal exploring neighbors first.', complexity: { time: 'O(V+E)', space: 'O(V)' } },
  { id: 'dfs', name: 'Depth-First Search (DFS)', category: 'graph', description: 'Recursive traversal exploring deep before backtracking.', complexity: { time: 'O(V+E)', space: 'O(V)' } },
  { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'graph', description: 'Shortest path from source to all vertices.', complexity: { time: 'O(E + V log V)', space: 'O(V)' } },
  { id: 'floyd-warshall', name: 'Floyd-Warshall', category: 'graph', description: 'Shortest path between all vertex pairs.', complexity: { time: 'O(V³)', space: 'O(V²)' } },
  { id: 'prim', name: "Prim's Algorithm", category: 'graph', description: 'Minimum Spanning Tree (MST) from a starting vertex.', complexity: { time: 'O(E log V)', space: 'O(V)' } },
  { id: 'kruskal', name: "Kruskal's Algorithm", category: 'graph', description: 'MST using edges sorted by weight.', complexity: { time: 'O(E log E)', space: 'O(V)' } },
  { id: 'topological-sort', name: 'Topological Sort', category: 'graph', description: 'Linear ordering of vertices for DAGs.', complexity: { time: 'O(V+E)', space: 'O(V)' } },

  // 4. DYNAMIC PROGRAMMING
  { id: 'fibonacci-dp', name: 'Fibonacci Sequence', category: 'dp', description: 'Basic memoization example.', complexity: { time: 'O(n)', space: 'O(n)' } },
  { id: 'knapsack-01', name: '0/1 Knapsack Problem', category: 'dp', description: 'Item selection optimization.', complexity: { time: 'O(nW)', space: 'O(nW)' } },
  { id: 'lcs', name: 'Longest Common Subsequence (LCS)', category: 'dp', description: 'String comparison optimization.', complexity: { time: 'O(mn)', space: 'O(mn)' } },
  { id: 'lis', name: 'Longest Increasing Subsequence (LIS)', category: 'dp', description: 'Sequence analysis.', complexity: { time: 'O(n log n)', space: 'O(n)' } },

  // 5. GREEDY
  { id: 'activity-selection', name: 'Activity Selection', category: 'greedy', description: 'Maximum non-overlapping events.', complexity: { time: 'O(n log n)', space: 'O(1)' } },
  { id: 'huffman-coding', name: 'Huffman Coding', category: 'greedy', description: 'Data compression tree building.', complexity: { time: 'O(n log n)', space: 'O(n)' } },

  // 6. STRING
  { id: 'kmp', name: 'KMP Algorithm', category: 'string', description: 'Efficient pattern matching with prefix function.', complexity: { time: 'O(n+m)', space: 'O(m)' } },
  { id: 'trie-string', name: 'Trie Prefix Matching', category: 'string', description: 'Fast dictionary lookups.', complexity: { time: 'O(L)', space: 'O(AL)' } },

  // 7. TREE
  { id: 'bst-ops', name: 'BST Operations', category: 'tree', description: 'Insert, Delete, Search in sorted tree.', complexity: { time: 'O(h)', space: 'O(h)' } },
  { id: 'tree-traversal', name: 'Tree Traversals', category: 'tree', description: 'Inorder, Preorder, Postorder visits.', complexity: { time: 'O(n)', space: 'O(n)' } },
  { id: 'avl-tree', name: 'AVL Tree Balancing', category: 'tree', description: 'Self-balancing BST using rotations.', complexity: { time: 'O(log n)', space: 'O(n)' } },

  // 8. ADVANCED DS
  { id: 'union-find', name: 'Union-Find (Disjoint Set)', category: 'advanced-ds', description: 'Cycle detection and connectivity.', complexity: { time: 'O(α(n))', space: 'O(n)' } },
  { id: 'segment-tree', name: 'Segment Tree', category: 'advanced-ds', description: 'Efficient range queries.', complexity: { time: 'O(log n)', space: 'O(n)' } },

  // 9. RECURSION & BACKTRACKING
  { id: 'n-queens', name: 'N-Queens Problem', category: 'backtracking', description: 'Placing queens safely on a chessboard.', complexity: { time: 'O(N!)', space: 'O(N)' } },
  { id: 'sudoku-solver', name: 'Sudoku Solver', category: 'backtracking', description: 'Exhaustive grid solving.', complexity: { time: 'O(9^(n*n))', space: 'O(n*n)' } },

  // 10. OTHER
  { id: 'two-pointers', name: 'Two Pointers Technique', category: 'other', description: 'Optimized linear processing.', complexity: { time: 'O(n)', space: 'O(1)' } },
  { id: 'sliding-window', name: 'Sliding Window', category: 'other', description: 'Subarray/Substring optimization.', complexity: { time: 'O(n)', space: 'O(1)' } },



];

export const GRID_ROWS = 15;
export const GRID_COLS = 30;
