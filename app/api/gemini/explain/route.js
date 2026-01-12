// import { GoogleGenerativeAI } from '@google/generative-ai';

// export async function GET(req) {
//   try {
//     const apiKey = process.env.GENAI_API_KEY;
//     if (!apiKey) {
//       const msg = 'GENAI_API_KEY not set on the server';
//       console.error(msg);
//       return new Response(JSON.stringify({ text: '', error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' }});
//     }

//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get('name') || 'algorithm';
//     const step = searchParams.get('step') || '';

//     // Correct SDK initialization
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//     const prompt = `Explain the ${name} algorithm to a computer science student. ${step ? `Focus: ${step}` : ''} Provide a concise explanation and why it's useful. Use markdown.`;

//     // Correct API call
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return new Response(JSON.stringify({ text }), { status: 200, headers: { 'Content-Type': 'application/json' }});
//   } catch (err) {
//     console.error('Gemini API error:', err?.message || err);
//     if (err?.message?.includes('API_KEY')) {
//       return new Response(JSON.stringify({ text: 'API key invalid or expired.', error: 'Auth error' }), { status: 401, headers: { 'Content-Type': 'application/json' }});
//     }
//     if (err?.message?.includes('429')) {
//       return new Response(JSON.stringify({ text: 'Rate limited. Try again in a moment.', error: '429' }), { status: 429, headers: { 'Content-Type': 'application/json' }});
//     }
//     return new Response(JSON.stringify({ text: 'Explanation unavailable.', error: err?.message || 'server error' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
//   }
// }






import { GoogleGenerativeAI } from '@google/generative-ai';

const FALLBACK_EXPLANATIONS = {
 'bubble-sort': 'Bubble Sort is the most basic sorting algorithm and is mainly used to understand how sorting works internally. The idea is very simple: compare two adjacent elements and swap them if they are in the wrong order. This process is repeated again and again until the array becomes sorted.\n\nHOW IT WORKS INTERNALLY:\nThink of bubbles rising in water. The heaviest bubble goes up. Similarly, in Bubble Sort, the largest element moves to the end of the array after every pass.\n\nSTEP-BY-STEP PROCESS:\n1. Start from index 0.\n2. Compare element at index i with element at i+1.\n3. If element[i] > element[i+1], swap them.\n4. Move to the next index.\n5. Continue until the end of the array.\n6. After first pass, the largest element reaches the last position.\n7. Repeat the same steps for the remaining unsorted part.\n8. Stop when no swaps happen in a full pass.\n\nEXAMPLE:\nArray: [5, 1, 4, 2]\nPass 1: (5,1) swap → [1,5,4,2]\n        (5,4) swap → [1,4,5,2]\n        (5,2) swap → [1,4,2,5]\nPass 2: (1,4) ok\n        (4,2) swap → [1,2,4,5]\nPass 3: no swaps → sorted\n\nWHY IT IS SLOW:\nIt compares every element again and again even if array is almost sorted.\n\nTIME COMPLEXITY: O(n²)\nSPACE COMPLEXITY: O(1)\n\nUSED FOR: Learning and understanding sorting basics.',


'quick-sort': 'Quick Sort is a fast and widely used sorting algorithm based on the divide-and-conquer technique. Instead of slowly swapping elements like Bubble Sort, it divides the problem into smaller parts and solves them efficiently.\n\nCORE IDEA:\nPick one element called the pivot and arrange the array so that all elements smaller than pivot come to the left and larger ones to the right.\n\nSTEP-BY-STEP PROCESS:\n1. Choose a pivot (usually last element).\n2. Create two regions:\n   - left side → elements smaller than pivot\n   - right side → elements greater than pivot\n3. Place pivot in its correct position.\n4. Recursively apply Quick Sort on left subarray.\n5. Recursively apply Quick Sort on right subarray.\n6. Stop when subarray size is 0 or 1.\n\nEXAMPLE:\nArray: [6, 3, 8, 5, 2]\nPivot = 5\nLeft: [3,2]\nRight: [6,8]\nResult after partition: [3,2,5,6,8]\nNow sort left and right recursively.\nFinal result: [2,3,5,6,8]\n\nWHY IT IS FAST:\nIt reduces problem size very quickly and works well with CPU cache.\n\nTIME COMPLEXITY:\nAverage: O(n log n)\nWorst: O(n²) (bad pivot)\n\nSPACE COMPLEXITY: O(log n)\n\nUSED FOR: Real-world sorting systems.',


'merge-sort': 'Merge Sort is a stable and predictable sorting algorithm that always gives the same performance. It works by dividing the array into smaller pieces and then merging them back in sorted order.\n\nCORE IDEA:\nDivide until you cannot divide anymore, then merge in sorted way.\n\nSTEP-BY-STEP PROCESS:\n1. Divide the array into two halves.\n2. Recursively divide each half until only single elements remain.\n3. Merge two sorted halves by comparing elements one by one.\n4. Continue merging until full array is formed.\n\nEXAMPLE:\nArray: [4, 2, 6, 1]\nDivide → [4,2] and [6,1]\nDivide → [4],[2] and [6],[1]\nMerge → [2,4] and [1,6]\nFinal merge → [1,2,4,6]\n\nWHY EXTRA SPACE:\nBecause merging requires a temporary array.\n\nTIME COMPLEXITY: O(n log n)\nSPACE COMPLEXITY: O(n)\n\nUSED FOR: Large datasets, stable sorting.',


'insertion-sort': 'Insertion Sort works the same way humans sort playing cards. It builds the sorted list one element at a time.\n\nCORE IDEA:\nTake one element and insert it into the correct position in the already sorted part.\n\nSTEP-BY-STEP PROCESS:\n1. Assume first element is sorted.\n2. Pick the next element.\n3. Compare it with previous elements.\n4. Shift larger elements one position right.\n5. Insert element in correct place.\n6. Repeat until array ends.\n\nEXAMPLE:\nArray: [5, 3, 4]\nSorted part: [5]\nInsert 3 → [3,5]\nInsert 4 → [3,4,5]\n\nWHY IT IS GOOD:\nVery fast for small or nearly sorted arrays.\n\nTIME COMPLEXITY: O(n²)\nSPACE COMPLEXITY: O(1)\n\nUSED FOR: Small inputs.',


'linear-search': 'Linear Search is the simplest searching technique. It checks each element one by one until the target is found.\n\nSTEP-BY-STEP PROCESS:\n1. Start from first element.\n2. Compare current element with target.\n3. If match found, stop.\n4. Else move to next element.\n5. If end reached, element not found.\n\nEXAMPLE:\nArray: [10, 20, 30, 40]\nSearch 30 → check 10 ❌ → 20 ❌ → 30 ✅\n\nTIME COMPLEXITY: O(n)\nSPACE COMPLEXITY: O(1)\n\nUSED FOR: Unsorted or small arrays.',


'binary-search': 'Binary Search is a fast searching algorithm that works only on sorted arrays. It repeatedly cuts the search space into half.\n\nCORE IDEA:\nInstead of checking every element, decide which half to ignore.\n\nSTEP-BY-STEP PROCESS:\n1. Ensure array is sorted.\n2. Set low = 0, high = n-1.\n3. Find middle element.\n4. If target == middle → found.\n5. If target < middle → search left half.\n6. If target > middle → search right half.\n7. Repeat until found or range ends.\n\nEXAMPLE:\nArray: [1,3,5,7,9]\nTarget: 7\nMid = 5 → go right\nMid = 7 → found\n\nTIME COMPLEXITY: O(log n)\nSPACE COMPLEXITY: O(1)\n\nUSED FOR: Large sorted datasets.',


'bfs': 'Breadth-First Search explores a graph level by level. It uses a queue so that nodes are visited in the order they are discovered.\n\nCORE IDEA:\nVisit all neighbors first before going deeper.\n\nSTEP-BY-STEP PROCESS:\n1. Start from source node.\n2. Mark it visited.\n3. Push it into queue.\n4. Remove front of queue.\n5. Visit all unvisited neighbors.\n6. Push neighbors into queue.\n7. Repeat until queue is empty.\n\nWHY QUEUE:\nQueue ensures first-in-first-out order.\n\nUSED FOR:\nShortest path in unweighted graphs.\n\nTIME COMPLEXITY: O(V+E)',


'dfs': 'Depth-First Search explores as deep as possible before backtracking. It uses recursion or a stack.\n\nCORE IDEA:\nGo deep first, then come back.\n\nSTEP-BY-STEP PROCESS:\n1. Start at source node.\n2. Mark it visited.\n3. Visit an unvisited neighbor.\n4. Continue until dead end.\n5. Backtrack and try other paths.\n\nUSED FOR:\nCycle detection, maze problems.\n\nTIME COMPLEXITY: O(V+E)',


'dijkstra': 'Dijkstra\'s Algorithm finds the shortest distance from a source node to all other nodes in a weighted graph.\n\nCORE IDEA:\nAlways pick the closest unvisited node.\n\nSTEP-BY-STEP PROCESS:\n1. Set distance of source = 0, others = infinity.\n2. Add all nodes to priority queue.\n3. Pick node with smallest distance.\n4. Update distances of neighbors.\n5. Repeat until all nodes visited.\n\nUSED FOR:\nGPS navigation, routing.\n\nTIME COMPLEXITY: O(E log V)',


'fibonacci-dp': 'The Fibonacci Sequence using Dynamic Programming solves the inefficiency of the recursive approach. In normal recursion, the same values are calculated again and again, which wastes time.\n\nCORE IDEA:\nStore already calculated results so they can be reused.\n\nSTEP-BY-STEP PROCESS (TABULATION):\n1. Create an array dp[].\n2. Set dp[0] = 0 and dp[1] = 1.\n3. For i from 2 to n:\n   dp[i] = dp[i-1] + dp[i-2]\n4. Return dp[n].\n\nWHY DP IS BETTER:\nEach Fibonacci value is calculated only once.\n\nEXAMPLE:\nn = 6\nSequence → 0,1,1,2,3,5,8\n\nTIME COMPLEXITY: O(n)\nSPACE COMPLEXITY: O(n)\n\nUSED FOR:\nLearning DP basics.',


'knapsack-01': 'The 0/1 Knapsack Problem is a classic Dynamic Programming problem where you must choose items to maximize total value without exceeding weight capacity.\n\nCORE IDEA:\nFor each item, decide whether to include it or not.\n\nSTEP-BY-STEP PROCESS:\n1. Create a DP table dp[n+1][W+1].\n2. Rows represent items, columns represent capacity.\n3. If item weight ≤ capacity:\n   dp[i][w] = max(include, exclude).\n4. Else copy value from above.\n5. Final answer is dp[n][W].\n\nEXAMPLE:\nItems: (wt,val) → (1,1),(3,4),(4,5)\nCapacity = 7\nOptimal value = 9\n\nWHY DP:\nGreedy fails because local choice may not be optimal.\n\nTIME COMPLEXITY: O(nW)\nSPACE COMPLEXITY: O(nW)\n\nUSED FOR:\nResource optimization.',


'lcs': 'Longest Common Subsequence finds the longest sequence that appears in both strings in the same order (not necessarily continuous).\n\nCORE IDEA:\nBreak the problem into smaller string comparisons.\n\nSTEP-BY-STEP PROCESS:\n1. Create DP table dp[m+1][n+1].\n2. Compare characters of both strings.\n3. If match → dp[i][j] = 1 + dp[i-1][j-1]\n4. Else → max(dp[i-1][j], dp[i][j-1])\n5. Final value is dp[m][n].\n\nEXAMPLE:\nS1 = ABCDGH\nS2 = AEDFHR\nLCS = ADH\n\nUSED FOR:\nText comparison, Git diff tools.',


'lis': 'Longest Increasing Subsequence finds the longest subsequence where elements are strictly increasing.\n\nCORE IDEA:\nMaintain smallest possible tail values.\n\nSTEP-BY-STEP PROCESS:\n1. Create empty array tails.\n2. Traverse array.\n3. Use binary search to place element.\n4. Replace or append.\n\nEXAMPLE:\nArray: [10,9,2,5,3,7,101]\nLIS = [2,3,7,101]\n\nTIME COMPLEXITY: O(n log n)\nSPACE COMPLEXITY: O(n)\n\nUSED FOR:\nSequence analysis.',


'activity-selection': 'Activity Selection chooses maximum number of non-overlapping activities.\n\nCORE IDEA:\nAlways pick the activity that finishes earliest.\n\nSTEP-BY-STEP PROCESS:\n1. Sort activities by finish time.\n2. Select first activity.\n3. Select next activity whose start ≥ last finish.\n4. Repeat until all checked.\n\nWHY GREEDY WORKS:\nEarly finish gives more room for future activities.\n\nUSED FOR:\nScheduling problems.',


'huffman-coding': 'Huffman Coding compresses data by assigning shorter codes to frequent characters.\n\nCORE IDEA:\nFrequent characters → shorter codes.\n\nSTEP-BY-STEP PROCESS:\n1. Count frequency of characters.\n2. Create min-heap.\n3. Merge two smallest nodes.\n4. Repeat until one tree remains.\n5. Assign binary codes.\n\nUSED FOR:\nData compression (ZIP, JPEG).',


'bst-ops': 'Binary Search Tree stores elements in sorted manner.\n\nCORE IDEA:\nLeft < Root < Right.\n\nOPERATIONS:\n- Insert: Compare and place.\n- Search: Traverse left/right.\n- Delete: Handle 0,1,2 children.\n\nTIME COMPLEXITY: O(h)\n\nUSED FOR:\nFast lookup.',


'tree-traversal': 'Tree Traversal means visiting all nodes.\n\nTYPES:\n1. Inorder: Left → Root → Right\n2. Preorder: Root → Left → Right\n3. Postorder: Left → Right → Root\n\nUSED FOR:\nExpression evaluation.',


'avl-tree': 'AVL Tree is a self-balancing BST.\n\nCORE IDEA:\nMaintain balance factor.\n\nSTEP-BY-STEP PROCESS:\n1. Insert node.\n2. Check balance.\n3. Apply rotations.\n\nWHY IMPORTANT:\nGuarantees O(log n).\n\nUSED FOR:\nBalanced searching.',


'union-find': 'Union-Find manages disjoint sets efficiently.\n\nCORE IDEA:\nTrack connected components.\n\nOPERATIONS:\n- Find parent.\n- Union sets.\n\nOptimized using path compression.\n\nUSED FOR:\nCycle detection.',


'segment-tree': 'Segment Tree handles range queries efficiently.\n\nCORE IDEA:\nDivide array into segments.\n\nSTEP-BY-STEP PROCESS:\n1. Build tree.\n2. Query range.\n3. Update values.\n\nUSED FOR:\nRange sum/min/max.',


'n-queens': 'Place N queens so none attack each other.\n\nCORE IDEA:\nTry and backtrack.\n\nSTEP-BY-STEP PROCESS:\n1. Place queen in row.\n2. Check safety.\n3. Move next row.\n4. Backtrack if unsafe.\n\nUSED FOR:\nConstraint problems.',


'sudoku-solver': 'Sudoku Solver uses backtracking to fill grid.\n\nSTEP-BY-STEP PROCESS:\n1. Find empty cell.\n2. Try numbers 1–9.\n3. Check validity.\n4. Backtrack if needed.\n\nUSED FOR:\nPuzzle solving.',


'two-pointers': 'Two pointers technique uses two indices to reduce complexity.\n\nCORE IDEA:\nMove pointers based on condition.\n\nUSED FOR:\nPairs, sorted arrays.',


'sliding-window': 'Sliding Window maintains a window over elements.\n\nCORE IDEA:\nExpand and shrink window.\n\nUSED FOR:\nSubarrays and substrings.'
};

export async function GET(req) {
  try {
    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      const msg = 'GENAI_API_KEY not set on the server';
      console.error(msg);
      return new Response(JSON.stringify({ text: '', error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'algorithm';
    const step = searchParams.get('step') || '';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Explain the ${name} algorithm to a computer science student. ${step ? `Focus: ${step}` : ''} Provide a concise explanation and why it's useful. Use markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    console.error('Gemini API error:', err?.message || err);

    // Handle quota exceeded (429)
    if (err?.message?.includes('429') || err?.status === 429) {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get('name') || 'algorithm';
      const fallback = FALLBACK_EXPLANATIONS[name.toLowerCase().replace(' ', '-')] || 
        `${name} is an important algorithm. The AI tutor quota is temporarily exceeded. Please try again later or check your Google Cloud API quota.`;
      return new Response(JSON.stringify({ text: fallback, error: 'Quota exceeded (429) - using fallback' }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }

    // Handle auth errors
    if (err?.message?.includes('API_KEY') || err?.status === 401) {
      return new Response(JSON.stringify({ text: 'API key invalid. Check your GENAI_API_KEY in .env.local', error: 'Auth error' }), { status: 401, headers: { 'Content-Type': 'application/json' }});
    }

    // Generic error fallback
    return new Response(JSON.stringify({ text: 'Explanation currently unavailable. Check back soon!', error: err?.message || 'server error' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
  }
}