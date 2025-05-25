/**
 * Searching Algorithms Implementation
 * Contains all searching algorithm implementations with step-by-step visualization
 */

class SearchingAlgorithms {
  static linearSearch(arr, target) {
    const steps = [];
    const array = [...arr];
    const n = array.length;

    steps.push({
      type: 'init',
      array: [...array],
      target: target,
      description: `Starting Linear Search for target value: ${target}`,
      code: 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {',
      highlight: [0, 1]
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        type: 'compare',
        array: [...array],
        comparing: [i],
        target: target,
        description: `Checking element at index ${i}: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}`,
        code: '    if (arr[i] === target) {',
        highlight: [2],
        stats: { comparisons: 1 }
      });

      if (array[i] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          found: [i],
          target: target,
          description: `Target ${target} found at index ${i}!`,
          code: '      return i;',
          highlight: [3]
        });

        return {
          steps,
          result: i,
          complexity: {
            time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
            space: 'O(1)'
          },
          code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
          explanation: "Linear Search sequentially checks each element in the array until the target is found or the end is reached.",
          applications: [
            "Unsorted arrays",
            "Small datasets",
            "When simplicity is preferred over efficiency",
            "Linked lists and other sequential data structures"
          ]
        };
      }
    }

    steps.push({
      type: 'not_found',
      array: [...array],
      target: target,
      description: `Target ${target} not found in the array`,
      code: '  }\n  return -1;\n}',
      highlight: [5, 6]
    });

    return {
      steps,
      result: -1,
      complexity: {
        time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        space: 'O(1)'
      },
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
      explanation: "Linear Search sequentially checks each element in the array until the target is found or the end is reached.",
      applications: [
        "Unsorted arrays",
        "Small datasets",
        "When simplicity is preferred over efficiency",
        "Linked lists and other sequential data structures"
      ]
    };
  }

  static binarySearch(arr, target) {
    const steps = [];
    const array = [...arr];
    let left = 0;
    let right = array.length - 1;

    steps.push({
      type: 'init',
      array: [...array],
      target: target,
      range: [left, right],
      description: `Starting Binary Search for target: ${target}. Array must be sorted!`,
      code: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;',
      highlight: [0, 1, 2]
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        type: 'calculate_mid',
        array: [...array],
        range: [left, right],
        mid: mid,
        target: target,
        description: `Calculating middle index: (${left} + ${right}) / 2 = ${mid}`,
        code: '  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);',
        highlight: [3, 4]
      });

      steps.push({
        type: 'compare',
        array: [...array],
        comparing: [mid],
        target: target,
        range: [left, right],
        description: `Comparing middle element ${array[mid]} with target ${target}`,
        code: '    if (arr[mid] === target) {',
        highlight: [5],
        stats: { comparisons: 1 }
      });

      if (array[mid] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          found: [mid],
          target: target,
          description: `Target ${target} found at index ${mid}!`,
          code: '      return mid;',
          highlight: [6]
        });

        return {
          steps,
          result: mid,
          complexity: {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            space: 'O(1)'
          },
          code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
          explanation: "Binary Search works on sorted arrays by repeatedly dividing the search interval in half, comparing the target with the middle element.",
          applications: [
            "Sorted arrays",
            "Large datasets requiring fast search",
            "Database indexing",
            "Finding insertion points"
          ]
        };
      } else if (array[mid] < target) {
        steps.push({
          type: 'search_right',
          array: [...array],
          range: [left, right],
          mid: mid,
          newRange: [mid + 1, right],
          target: target,
          description: `${array[mid]} < ${target}, searching right half`,
          code: '    } else if (arr[mid] < target) {\n      left = mid + 1;',
          highlight: [7, 8]
        });
        left = mid + 1;
      } else {
        steps.push({
          type: 'search_left',
          array: [...array],
          range: [left, right],
          mid: mid,
          newRange: [left, mid - 1],
          target: target,
          description: `${array[mid]} > ${target}, searching left half`,
          code: '    } else {\n      right = mid - 1;',
          highlight: [9, 10]
        });
        right = mid - 1;
      }
    }

    steps.push({
      type: 'not_found',
      array: [...array],
      target: target,
      description: `Target ${target} not found in the array`,
      code: '  }\n  return -1;\n}',
      highlight: [12, 13]
    });

    return {
      steps,
      result: -1,
      complexity: {
        time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        space: 'O(1)'
      },
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
      explanation: "Binary Search works on sorted arrays by repeatedly dividing the search interval in half, comparing the target with the middle element.",
      applications: [
        "Sorted arrays",
        "Large datasets requiring fast search",
        "Database indexing",
        "Finding insertion points"
      ]
    };
  }

  static jumpSearch(arr, target) {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;

    steps.push({
      type: 'init',
      array: [...array],
      target: target,
      step: step,
      description: `Starting Jump Search for target: ${target}. Step size: √${n} = ${step}`,
      code: 'function jumpSearch(arr, target) {\n  const n = arr.length;\n  const step = Math.floor(Math.sqrt(n));\n  let prev = 0;',
      highlight: [0, 1, 2, 3]
    });

    // Finding the block where element is present
    while (array[Math.min(step, n) - 1] < target) {
      steps.push({
        type: 'jump',
        array: [...array],
        current: Math.min(step, n) - 1,
        target: target,
        step: step,
        description: `Jumping: ${array[Math.min(step, n) - 1]} < ${target}, moving to next block`,
        code: '  while (arr[Math.min(step, n) - 1] < target) {',
        highlight: [4],
        stats: { comparisons: 1 }
      });

      prev = step;
      step += Math.floor(Math.sqrt(n));

      if (prev >= n) {
        steps.push({
          type: 'not_found',
          array: [...array],
          target: target,
          description: `Reached end of array, target ${target} not found`,
          code: '    if (prev >= n) return -1;',
          highlight: [7]
        });

        return {
          steps,
          result: -1,
          complexity: {
            time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
            space: 'O(1)'
          },
          code: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}`,
          explanation: "Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block.",
          applications: [
            "Sorted arrays where binary search is not suitable",
            "Systems with expensive comparison operations",
            "When you want better performance than linear search but simpler than binary search"
          ]
        };
      }
    }

    steps.push({
      type: 'block_found',
      array: [...array],
      range: [prev, Math.min(step, n) - 1],
      target: target,
      description: `Target might be in block from ${prev} to ${Math.min(step, n) - 1}`,
      code: '  }',
      highlight: [8]
    });

    // Linear search in the identified block
    while (array[prev] < target) {
      steps.push({
        type: 'linear_search',
        array: [...array],
        comparing: [prev],
        target: target,
        description: `Linear search in block: ${array[prev]} < ${target}`,
        code: '  while (arr[prev] < target) {',
        highlight: [9],
        stats: { comparisons: 1 }
      });

      prev++;
      if (prev === Math.min(step, n)) {
        steps.push({
          type: 'not_found',
          array: [...array],
          target: target,
          description: `Reached end of block, target ${target} not found`,
          code: '    if (prev === Math.min(step, n)) return -1;',
          highlight: [11]
        });

        return {
          steps,
          result: -1,
          complexity: {
            time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
            space: 'O(1)'
          },
          code: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}`,
          explanation: "Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block.",
          applications: [
            "Sorted arrays where binary search is not suitable",
            "Systems with expensive comparison operations",
            "When you want better performance than linear search but simpler than binary search"
          ]
        };
      }
    }

    steps.push({
      type: 'compare',
      array: [...array],
      comparing: [prev],
      target: target,
      description: `Final comparison: ${array[prev]} ${array[prev] === target ? '==' : '!='} ${target}`,
      code: '  if (arr[prev] === target) return prev;',
      highlight: [13],
      stats: { comparisons: 1 }
    });

    if (array[prev] === target) {
      steps.push({
        type: 'found',
        array: [...array],
        found: [prev],
        target: target,
        description: `Target ${target} found at index ${prev}!`,
        code: '  return prev;',
        highlight: [13]
      });

      return {
        steps,
        result: prev,
        complexity: {
          time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
          space: 'O(1)'
        },
        code: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}`,
        explanation: "Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block.",
        applications: [
          "Sorted arrays where binary search is not suitable",
          "Systems with expensive comparison operations",
          "When you want better performance than linear search but simpler than binary search"
        ]
      };
    }

    steps.push({
      type: 'not_found',
      array: [...array],
      target: target,
      description: `Target ${target} not found in the array`,
      code: '  return -1;\n}',
      highlight: [14]
    });

    return {
      steps,
      result: -1,
      complexity: {
        time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
        space: 'O(1)'
      },
      code: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}`,
      explanation: "Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block.",
      applications: [
        "Sorted arrays where binary search is not suitable",
        "Systems with expensive comparison operations",
        "When you want better performance than linear search but simpler than binary search"
      ]
    };
  }

  static interpolationSearch(arr, target) {
    const steps = [];
    const array = [...arr];
    let low = 0;
    let high = array.length - 1;

    steps.push({
      type: 'init',
      array: [...array],
      target: target,
      range: [low, high],
      description: `Starting Interpolation Search for target: ${target}. Works best with uniformly distributed data.`,
      code: 'function interpolationSearch(arr, target) {\n  let low = 0;\n  let high = arr.length - 1;',
      highlight: [0, 1, 2]
    });

    while (low <= high && target >= array[low] && target <= array[high]) {
      if (low === high) {
        steps.push({
          type: 'single_element',
          array: [...array],
          comparing: [low],
          target: target,
          description: `Only one element left to check at index ${low}`,
          code: '  while (low <= high && target >= arr[low] && target <= arr[high]) {\n    if (low === high) {',
          highlight: [3, 4]
        });

        if (array[low] === target) {
          steps.push({
            type: 'found',
            array: [...array],
            found: [low],
            target: target,
            description: `Target ${target} found at index ${low}!`,
            code: '      if (arr[low] === target) return low;',
            highlight: [5]
          });

          return {
            steps,
            result: low,
            complexity: {
              time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
              space: 'O(1)'
            },
            code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1;
}`,
            explanation: "Interpolation Search improves upon binary search by estimating the position of the target based on the value distribution, working best with uniformly distributed sorted data.",
            applications: [
              "Uniformly distributed sorted arrays",
              "Large datasets with numeric values",
              "Phone books, dictionaries",
              "When data distribution is known and uniform"
            ]
          };
        }

        steps.push({
          type: 'not_found',
          array: [...array],
          target: target,
          description: `Target ${target} not found`,
          code: '      return -1;',
          highlight: [6]
        });

        return {
          steps,
          result: -1,
          complexity: {
            time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
            space: 'O(1)'
          },
          code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1;
}`,
          explanation: "Interpolation Search improves upon binary search by estimating the position of the target based on the value distribution, working best with uniformly distributed sorted data.",
          applications: [
            "Uniformly distributed sorted arrays",
            "Large datasets with numeric values",
            "Phone books, dictionaries",
            "When data distribution is known and uniform"
          ]
        };
      }

      // Calculate interpolated position
      const pos = low + Math.floor(((target - array[low]) / (array[high] - array[low])) * (high - low));

      steps.push({
        type: 'interpolate',
        array: [...array],
        range: [low, high],
        pos: pos,
        target: target,
        description: `Interpolating position: ${low} + ((${target} - ${array[low]}) / (${array[high]} - ${array[low]})) * (${high} - ${low}) = ${pos}`,
        code: '    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));',
        highlight: [9]
      });

      steps.push({
        type: 'compare',
        array: [...array],
        comparing: [pos],
        target: target,
        description: `Comparing element at interpolated position ${pos}: ${array[pos]} ${array[pos] === target ? '==' : '!='} ${target}`,
        code: '    if (arr[pos] === target) {',
        highlight: [11],
        stats: { comparisons: 1 }
      });

      if (array[pos] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          found: [pos],
          target: target,
          description: `Target ${target} found at index ${pos}!`,
          code: '      return pos;',
          highlight: [12]
        });

        return {
          steps,
          result: pos,
          complexity: {
            time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
            space: 'O(1)'
          },
          code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1;
}`,
          explanation: "Interpolation Search improves upon binary search by estimating the position of the target based on the value distribution, working best with uniformly distributed sorted data.",
          applications: [
            "Uniformly distributed sorted arrays",
            "Large datasets with numeric values",
            "Phone books, dictionaries",
            "When data distribution is known and uniform"
          ]
        };
      } else if (array[pos] < target) {
        steps.push({
          type: 'search_right',
          array: [...array],
          range: [low, high],
          pos: pos,
          newRange: [pos + 1, high],
          target: target,
          description: `${array[pos]} < ${target}, searching right half`,
          code: '    } else if (arr[pos] < target) {\n      low = pos + 1;',
          highlight: [13, 14]
        });
        low = pos + 1;
      } else {
        steps.push({
          type: 'search_left',
          array: [...array],
          range: [low, high],
          pos: pos,
          newRange: [low, pos - 1],
          target: target,
          description: `${array[pos]} > ${target}, searching left half`,
          code: '    } else {\n      high = pos - 1;',
          highlight: [15, 16]
        });
        high = pos - 1;
      }
    }

    steps.push({
      type: 'not_found',
      array: [...array],
      target: target,
      description: `Target ${target} not found in the array`,
      code: '  }\n  return -1;\n}',
      highlight: [18, 19]
    });

    return {
      steps,
      result: -1,
      complexity: {
        time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
        space: 'O(1)'
      },
      code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1;
}`,
      explanation: "Interpolation Search improves upon binary search by estimating the position of the target based on the value distribution, working best with uniformly distributed sorted data.",
      applications: [
        "Uniformly distributed sorted arrays",
        "Large datasets with numeric values",
        "Phone books, dictionaries",
        "When data distribution is known and uniform"
      ]
    };
  }

  static getAlgorithm(algorithmId) {
    const algorithms = {
      'linear-search': this.linearSearch,
      'binary-search': this.binarySearch,
      'jump-search': this.jumpSearch,
      'interpolation-search': this.interpolationSearch
    };

    return algorithms[algorithmId] || null;
  }

  static generateSteps(algorithmId, data = [2, 3, 4, 10, 40], target = 10) {
    const algorithm = this.getAlgorithm(algorithmId);
    if (!algorithm) return [];
    
    const result = algorithm(data, target);
    return result.steps || [];
  }

  static getImplementation(algorithmId) {
    const implementations = {
      'linear-search': {
        timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        spaceComplexity: 'O(1)',
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
        description: "Linear Search sequentially checks each element in the array until the target is found or the end is reached.",
        applications: [
          "Unsorted arrays",
          "Small datasets",
          "When simplicity is preferred over efficiency",
          "Linked lists and other sequential data structures"
        ],
        performanceNotes: "Simple but inefficient for large datasets. Best case when target is at the beginning, worst case when target is at the end or not present."
      },
      'binary-search': {
        timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        spaceComplexity: 'O(1)',
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
        description: "Binary Search works on sorted arrays by repeatedly dividing the search interval in half.",
        applications: [
          "Sorted arrays",
          "Large datasets requiring fast search",
          "Database indexing",
          "Finding insertion points"
        ],
        performanceNotes: "Requires sorted array. Very efficient with O(log n) time complexity. Iterative version uses O(1) space."
      },
      'jump-search': {
        timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
        spaceComplexity: 'O(1)',
        code: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}`,
        description: "Jump Search works on sorted arrays by jumping ahead by fixed steps, then performing linear search in the identified block.",
        applications: [
          "Sorted arrays where binary search is not suitable",
          "Systems with expensive comparison operations",
          "When you want better performance than linear search but simpler than binary search"
        ],
        performanceNotes: "Better than linear search but not as efficient as binary search. Optimal jump size is √n."
      },
      'interpolation-search': {
        timeComplexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
        spaceComplexity: 'O(1)',
        code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    
    const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1;
}`,
        description: "Interpolation Search improves upon binary search by estimating the position of the target based on value distribution.",
        applications: [
          "Uniformly distributed sorted arrays",
          "Large datasets with numeric values",
          "Phone books, dictionaries",
          "When data distribution is known and uniform"
        ],
        performanceNotes: "Works best with uniformly distributed data. Can degrade to O(n) with non-uniform distribution."
      }
    };

    return implementations[algorithmId] || null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchingAlgorithms;
}

// Make available globally
window.SearchingAlgorithms = SearchingAlgorithms; 