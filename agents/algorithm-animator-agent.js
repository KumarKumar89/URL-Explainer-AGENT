/**
 * Algorithm Animator Agent
 * Generates step-by-step visualizations for algorithms
 * Perfect for sorting, searching, graph algorithms, and more
 */

class AlgorithmAnimatorAgent {
  constructor() {
    this.algorithmTemplates = {
      sorting: ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'],
      searching: ['linear', 'binary', 'ternary', 'jump'],
      graph: ['bfs', 'dfs', 'dijkstra', 'astar', 'prim', 'kruskal'],
      tree: ['inorder', 'preorder', 'postorder', 'levelorder'],
      dp: ['fibonacci', 'knapsack', 'lcs', 'matrix-chain']
    };
  }

  /**
   * Main method - generates algorithm animation data
   */
  async generateAlgorithmAnimation(topic, content) {
    console.log(`🎬 Algorithm Animator: Processing "${topic}"...`);

    const algorithmInfo = await this.identifyAlgorithm(topic, content);
    
    if (!algorithmInfo) {
      return this.generateGenericAlgorithm(topic);
    }

    const animationData = {
      name: algorithmInfo.name,
      category: algorithmInfo.category,
      description: algorithmInfo.description,
      pseudocode: algorithmInfo.pseudocode,
      complexity: algorithmInfo.complexity,
      steps: await this.generateSteps(algorithmInfo),
      visualType: this.getVisualType(algorithmInfo.category),
      interactiveElements: this.getInteractiveElements(algorithmInfo)
    };

    return animationData;
  }

  /**
   * Identify the algorithm from topic/content
   */
  async identifyAlgorithm(topic, content) {
    const topicLower = topic.toLowerCase();
    
    // Sorting Algorithms
    if (topicLower.includes('bubble sort')) {
      return this.getBubbleSortInfo();
    }
    if (topicLower.includes('merge sort')) {
      return this.getMergeSortInfo();
    }
    if (topicLower.includes('quick sort')) {
      return this.getQuickSortInfo();
    }
    if (topicLower.includes('binary search')) {
      return this.getBinarySearchInfo();
    }
    if (topicLower.includes('breadth-first search') || topicLower.includes('bfs')) {
      return this.getBFSInfo();
    }
    if (topicLower.includes('depth-first search') || topicLower.includes('dfs')) {
      return this.getDFSInfo();
    }
    if (topicLower.includes('dijkstra')) {
      return this.getDijkstraInfo();
    }

    // Try to extract from content
    return this.extractAlgorithmFromContent(topic, content);
  }

  /**
   * Generate step-by-step visualization data
   */
  async generateSteps(algorithmInfo) {
    const steps = [];
    
    switch(algorithmInfo.type) {
      case 'bubble-sort':
        return this.generateBubbleSortSteps();
      case 'binary-search':
        return this.generateBinarySearchSteps();
      case 'bfs':
        return this.generateBFSSteps();
      default:
        return this.generateGenericSteps(algorithmInfo);
    }
  }

  /**
   * Bubble Sort Animation Steps
   */
  generateBubbleSortSteps() {
    const array = [64, 34, 25, 12, 22, 11, 90];
    const steps = [];
    let stepNum = 1;
    
    steps.push({
      step: stepNum++,
      action: 'Initial Array',
      array: [...array],
      compare: [],
      swapped: false,
      explanation: 'Starting with unsorted array'
    });

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        const beforeSwap = [...array];
        
        steps.push({
          step: stepNum++,
          action: `Compare arr[${j}]=${array[j]} and arr[${j+1}]=${array[j+1]}`,
          array: [...array],
          compare: [j, j + 1],
          swapped: false,
          explanation: `Comparing elements at positions ${j} and ${j+1}`
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          
          steps.push({
            step: stepNum++,
            action: `Swap arr[${j}] and arr[${j+1}]`,
            array: [...array],
            compare: [j, j + 1],
            swapped: true,
            explanation: `${beforeSwap[j]} > ${beforeSwap[j+1]}, so we swap them`
          });
        }
      }
      
      steps.push({
        step: stepNum++,
        action: `Element ${i+1} in correct position`,
        array: [...array],
        compare: [],
        swapped: false,
        sorted: array.length - i - 1,
        explanation: `Largest element bubbled to position ${array.length - i - 1}`
      });
    }

    steps.push({
      step: stepNum,
      action: 'Sorting Complete!',
      array: [...array],
      compare: [],
      swapped: false,
      sorted: true,
      explanation: 'Array is now fully sorted'
    });

    return steps;
  }

  /**
   * Binary Search Animation Steps
   */
  generateBinarySearchSteps(target = 23) {
    const array = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39];
    const steps = [];
    let left = 0, right = array.length - 1;
    let stepNum = 1;

    steps.push({
      step: stepNum++,
      action: 'Initial Setup',
      array: [...array],
      left,
      right,
      mid: null,
      target,
      explanation: `Searching for ${target} in sorted array`
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        step: stepNum++,
        action: `Check middle element at index ${mid}`,
        array: [...array],
        left,
        right,
        mid,
        target,
        highlight: [mid],
        explanation: `arr[${mid}] = ${array[mid]}`
      });

      if (array[mid] === target) {
        steps.push({
          step: stepNum++,
          action: 'Target Found!',
          array: [...array],
          left,
          right,
          mid,
          target,
          highlight: [mid],
          found: true,
          explanation: `Found ${target} at index ${mid}`
        });
        break;
      } else if (array[mid] < target) {
        const oldLeft = left;
        left = mid + 1;
        steps.push({
          step: stepNum++,
          action: `Target is greater, search right half`,
          array: [...array],
          left,
          right,
          mid,
          target,
          highlight: [mid],
          explanation: `${array[mid]} < ${target}, so search indices ${oldLeft}-${mid} are eliminated`
        });
      } else {
        right = mid - 1;
        steps.push({
          step: stepNum++,
          action: `Target is smaller, search left half`,
          array: [...array],
          left,
          right,
          mid,
          target,
          highlight: [mid],
          explanation: `${array[mid]} > ${target}, so search indices ${mid+1}-${right+1} are eliminated`
        });
      }
    }

    if (left > right) {
      steps.push({
        step: stepNum,
        action: 'Target Not Found',
        array: [...array],
        target,
        found: false,
        explanation: `${target} is not in the array`
      });
    }

    return steps;
  }

  /**
   * BFS Animation Steps
   */
  generateBFSSteps() {
    const graph = {
      nodes: [0, 1, 2, 3, 4, 5, 6],
      edges: [[0,1], [0,2], [1,3], [1,4], [2,5], [2,6]]
    };
    
    const steps = [];
    const visited = new Set();
    const queue = [0];
    let stepNum = 1;

    steps.push({
      step: stepNum++,
      action: 'Start BFS from node 0',
      graph: JSON.parse(JSON.stringify(graph)),
      visited: [],
      queue: [0],
      current: 0,
      explanation: 'Initialize: Start from root node, add to queue'
    });

    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!visited.has(current)) {
        visited.add(current);
        
        steps.push({
          step: stepNum++,
          action: `Visit node ${current}`,
          graph: JSON.parse(JSON.stringify(graph)),
          visited: Array.from(visited),
          queue: [...queue],
          current,
          highlight: [current],
          explanation: `Processing node ${current}`
        });

        const neighbors = graph.edges
          .filter(e => e[0] === current || e[1] === current)
          .map(e => e[0] === current ? e[1] : e[0]);

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
            steps.push({
              step: stepNum++,
              action: `Add neighbor ${neighbor} to queue`,
              graph: JSON.parse(JSON.stringify(graph)),
              visited: Array.from(visited),
              queue: [...queue],
              current,
              highlight: [neighbor],
              explanation: `Node ${neighbor} is unvisited, adding to queue`
            });
          }
        }
      }
    }

    steps.push({
      step: stepNum,
      action: 'BFS Complete!',
      graph: JSON.parse(JSON.stringify(graph)),
      visited: Array.from(visited),
      queue: [],
      order: Array.from(visited),
      explanation: `BFS traversal order: ${Array.from(visited).join(' → ')}`
    });

    return steps;
  }

  /**
   * Get algorithm info templates
   */
  getBubbleSortInfo() {
    return {
      name: 'Bubble Sort',
      type: 'bubble-sort',
      category: 'sorting',
      description: 'Simple sorting algorithm that repeatedly swaps adjacent elements if they are in wrong order',
      pseudocode: `
for i = 0 to n-1:
  for j = 0 to n-i-1:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
      `,
      complexity: {
        time: {
          best: 'O(n)',
          average: 'O(n²)',
          worst: 'O(n²)'
        },
        space: 'O(1)'
      }
    };
  }

  getBinarySearchInfo() {
    return {
      name: 'Binary Search',
      type: 'binary-search',
      category: 'searching',
      description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing search interval in half',
      pseudocode: `
while left <= right:
  mid = (left + right) // 2
  if arr[mid] == target:
    return mid
  elif arr[mid] < target:
    left = mid + 1
  else:
    right = mid - 1
      `,
      complexity: {
        time: {
          best: 'O(1)',
          average: 'O(log n)',
          worst: 'O(log n)'
        },
        space: 'O(1)'
      }
    };
  }

  getBFSInfo() {
    return {
      name: 'Breadth-First Search (BFS)',
      type: 'bfs',
      category: 'graph',
      description: 'Graph traversal algorithm that explores all neighbors at current depth before moving to next level',
      pseudocode: `
queue = [start]
visited = {start}
while queue not empty:
  node = queue.dequeue()
  for neighbor in node.neighbors:
    if neighbor not in visited:
      visited.add(neighbor)
      queue.enqueue(neighbor)
      `,
      complexity: {
        time: {
          best: 'O(V + E)',
          average: 'O(V + E)',
          worst: 'O(V + E)'
        },
        space: 'O(V)'
      }
    };
  }

  getMergeSortInfo() {
    return {
      name: 'Merge Sort',
      type: 'merge-sort',
      category: 'sorting',
      description: 'Divide-and-conquer algorithm that divides array into halves, sorts them, then merges',
      pseudocode: `
if len(arr) <= 1:
  return arr
mid = len(arr) // 2
left = merge_sort(arr[:mid])
right = merge_sort(arr[mid:])
return merge(left, right)
      `,
      complexity: {
        time: {
          best: 'O(n log n)',
          average: 'O(n log n)',
          worst: 'O(n log n)'
        },
        space: 'O(n)'
      }
    };
  }

  getQuickSortInfo() {
    return {
      name: 'Quick Sort',
      type: 'quick-sort',
      category: 'sorting',
      description: 'Divide-and-conquer algorithm using a pivot to partition array',
      pseudocode: `
if len(arr) <= 1:
  return arr
pivot = arr[len(arr) // 2]
left = [x for x in arr if x < pivot]
middle = [x for x in arr if x == pivot]
right = [x for x in arr if x > pivot]
return quick_sort(left) + middle + quick_sort(right)
      `,
      complexity: {
        time: {
          best: 'O(n log n)',
          average: 'O(n log n)',
          worst: 'O(n²)'
        },
        space: 'O(log n)'
      }
    };
  }

  getDFSInfo() {
    return {
      name: 'Depth-First Search (DFS)',
      type: 'dfs',
      category: 'graph',
      description: 'Graph traversal algorithm that explores as far as possible along each branch before backtracking',
      pseudocode: `
def dfs(node, visited):
  visited.add(node)
  for neighbor in node.neighbors:
    if neighbor not in visited:
      dfs(neighbor, visited)
      `,
      complexity: {
        time: {
          best: 'O(V + E)',
          average: 'O(V + E)',
          worst: 'O(V + E)'
        },
        space: 'O(V)'
      }
    };
  }

  getDijkstraInfo() {
    return {
      name: "Dijkstra's Algorithm",
      type: 'dijkstra',
      category: 'graph',
      description: 'Shortest path algorithm for weighted graphs with non-negative edge weights',
      pseudocode: `
dist[source] = 0
priority_queue = [(0, source)]
while queue not empty:
  d, u = extract_min(queue)
  for v, weight in u.neighbors:
    if dist[u] + weight < dist[v]:
      dist[v] = dist[u] + weight
      queue.insert((dist[v], v))
      `,
      complexity: {
        time: {
          best: 'O((V + E) log V)',
          average: 'O((V + E) log V)',
          worst: 'O((V + E) log V)'
        },
        space: 'O(V)'
      }
    };
  }

  /**
   * Generic fallback methods
   */
  generateGenericAlgorithm(topic) {
    return {
      name: topic,
      category: 'general',
      description: `Step-by-step visualization of ${topic}`,
      pseudocode: 'Algorithm pseudocode would be extracted from content',
      complexity: {
        time: { worst: 'O(n)' },
        space: 'O(1)'
      },
      steps: this.generateGenericSteps({ name: topic }),
      visualType: 'array'
    };
  }

  generateGenericSteps(algorithmInfo) {
    return [
      {
        step: 1,
        action: 'Initialize',
        explanation: 'Set up initial conditions',
        state: {}
      },
      {
        step: 2,
        action: 'Process',
        explanation: 'Execute main algorithm logic',
        state: {}
      },
      {
        step: 3,
        action: 'Complete',
        explanation: 'Return final result',
        state: {}
      }
    ];
  }

  getVisualType(category) {
    const mapping = {
      sorting: 'array',
      searching: 'array',
      graph: 'network',
      tree: 'tree',
      dp: 'table',
      general: 'flowchart'
    };
    return mapping[category] || 'flowchart';
  }

  getInteractiveElements(algorithmInfo) {
    return {
      speedControl: true,
      stepControls: true,
      resetButton: true,
      complexityDisplay: true,
      pseudocodeHighlight: true
    };
  }

  extractAlgorithmFromContent(topic, content) {
    // Extract algorithm details from researched content
    // This is a simplified version - can be enhanced with NLP
    return {
      name: topic,
      category: 'extracted',
      description: `Information about ${topic} extracted from research`,
      type: 'generic',
      complexity: {
        time: { worst: 'O(n)' },
        space: 'O(1)'
      }
    };
  }
}

module.exports = { AlgorithmAnimatorAgent };
