/**
 * @typedef {'sorting' | 'searching' | 'graph' | 'dp' | 'greedy' | 'string' | 'tree' | 'advanced-ds' | 'backtracking' | 'other'} AlgorithmType
 */

/**
 * @typedef {Object} Algorithm
 * @property {string} id
 * @property {string} name
 * @property {AlgorithmType} category
 * @property {string} description
 * @property {{time: string, space: string}} complexity
 */

/**
 * @typedef {Object} Node
 * @property {number} row
 * @property {number} col
 * @property {boolean} [isStart]
 * @property {boolean} [isFinish]
 * @property {number} distance
 * @property {boolean} isVisited
 * @property {boolean} [isWall]
 * @property {Node | null} previousNode
 * @property {any} [val]
 * @property {boolean} [isPath]
 */

/**
 * @typedef {Object} SortingBar
 * @property {number} value
 * @property {'idle' | 'comparing' | 'swapping' | 'sorted' | 'pivot'} status
 */

export {};