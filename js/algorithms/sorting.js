/**
 * Sorting Algorithms Implementation
 * Contains all sorting algorithm implementations with step-by-step visualization
 */

class SortingAlgorithms {
    static bubbleSort(arr) {
        const steps = [];
        const n = arr.length;
        const array = [...arr];

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Bubble Sort - comparing adjacent elements',
            code: 'function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {',
            highlight: [0, 1, 2]
        });

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [j, j + 1],
                    description: `Comparing elements at positions ${j} and ${j + 1}: ${array[j]} and ${array[j + 1]}`,
                    code: '    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {',
                    highlight: [3, 4],
                    stats: { comparisons: 1 }
                });

                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    steps.push({
                        type: 'swap',
                        array: [...array],
                        swapped: [j, j + 1],
                        description: `Swapping ${array[j + 1]} and ${array[j]} because ${array[j + 1]} < ${array[j]}`,
                        code: '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
                        highlight: [5],
                        stats: { swaps: 1 }
                    });
                }
            }

            steps.push({
                type: 'sorted',
                array: [...array],
                sortedIndices: [n - 1 - i],
                description: `Element at position ${n - 1 - i} is now in its final sorted position`,
                code: '  }',
                highlight: [6]
            });
        }

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Bubble Sort completed! Array is now sorted.',
            code: '}',
            highlight: [7]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            },
            code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
            explanation: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. The pass through the list is repeated until the list is sorted.",
            applications: [
                "Educational purposes - easy to understand",
                "Small datasets where simplicity is preferred",
                "Nearly sorted data (adaptive version)"
            ]
        };
    }

    static selectionSort(arr) {
        const steps = [];
        const n = arr.length;
        const array = [...arr];

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Selection Sort - finding minimum element in each iteration',
            code: 'function selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {',
            highlight: [0, 1, 2]
        });

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;

            steps.push({
                type: 'select',
                array: [...array],
                selected: [i],
                description: `Finding minimum element from position ${i} to ${n - 1}`,
                code: '    let minIdx = i;',
                highlight: [3]
            });

            for (let j = i + 1; j < n; j++) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [minIdx, j],
                    description: `Comparing ${array[minIdx]} at position ${minIdx} with ${array[j]} at position ${j}`,
                    code: '    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) {',
                    highlight: [4, 5],
                    stats: { comparisons: 1 }
                });

                if (array[j] < array[minIdx]) {
                    minIdx = j;
                    steps.push({
                        type: 'update_min',
                        array: [...array],
                        newMin: j,
                        description: `New minimum found: ${array[j]} at position ${j}`,
                        code: '        minIdx = j;',
                        highlight: [6]
                    });
                }
            }

            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                steps.push({
                    type: 'swap',
                    array: [...array],
                    swapped: [i, minIdx],
                    description: `Swapping minimum element ${array[i]} to position ${i}`,
                    code: '    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];',
                    highlight: [8],
                    stats: { swaps: 1 }
                });
            }

            steps.push({
                type: 'sorted',
                array: [...array],
                sortedIndices: [i],
                description: `Element at position ${i} is now in its final sorted position`,
                code: '  }',
                highlight: [9]
            });
        }

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Selection Sort completed! Array is now sorted.',
            code: '}',
            highlight: [10]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            },
            code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
            explanation: "Selection Sort divides the array into sorted and unsorted regions. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region.",
            applications: [
                "Small datasets",
                "Memory-constrained environments",
                "When minimizing the number of swaps is important"
            ]
        };
    }

    static insertionSort(arr) {
        const steps = [];
        const n = arr.length;
        const array = [...arr];

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Insertion Sort - building sorted array one element at a time',
            code: 'function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {',
            highlight: [0, 1]
        });

        for (let i = 1; i < n; i++) {
            const key = array[i];
            let j = i - 1;

            steps.push({
                type: 'select',
                array: [...array],
                selected: [i],
                description: `Selecting element ${key} at position ${i} to insert into sorted portion`,
                code: '    const key = arr[i];\n    let j = i - 1;',
                highlight: [2, 3]
            });

            while (j >= 0 && array[j] > key) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [j, i],
                    description: `Comparing ${array[j]} with key ${key}. Moving ${array[j]} one position right`,
                    code: '    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];',
                    highlight: [4, 5],
                    stats: { comparisons: 1 }
                });

                array[j + 1] = array[j];
                steps.push({
                    type: 'shift',
                    array: [...array],
                    shifted: [j + 1],
                    description: `Shifted ${array[j + 1]} to position ${j + 1}`,
                    code: '      j--;',
                    highlight: [6],
                    stats: { accesses: 1 }
                });
                j--;
            }

            array[j + 1] = key;
            steps.push({
                type: 'insert',
                array: [...array],
                inserted: [j + 1],
                description: `Inserted key ${key} at position ${j + 1}`,
                code: '    arr[j + 1] = key;',
                highlight: [8],
                stats: { accesses: 1 }
            });
        }

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Insertion Sort completed! Array is now sorted.',
            code: '}',
            highlight: [9]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            },
            code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
            explanation: "Insertion Sort builds the final sorted array one element at a time. It takes each element and inserts it into its correct position among the previously sorted elements.",
            applications: [
                "Small datasets",
                "Nearly sorted arrays",
                "Online algorithms (sorting data as it arrives)",
                "Hybrid sorting algorithms (used in Timsort)"
            ]
        };
    }

    static mergeSort(arr) {
        const steps = [];
        const array = [...arr];

        function merge(left, mid, right, depth = 0) {
            const leftArr = array.slice(left, mid + 1);
            const rightArr = array.slice(mid + 1, right + 1);

            steps.push({
                type: 'divide',
                array: [...array],
                range: [left, right],
                leftRange: [left, mid],
                rightRange: [mid + 1, right],
                description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
                code: 'function merge(left, mid, right) {',
                highlight: [0],
                depth
            });

            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [left + i, mid + 1 + j],
                    description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
                    code: '  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) {',
                    highlight: [1, 2],
                    stats: { comparisons: 1 },
                    depth
                });

                if (leftArr[i] <= rightArr[j]) {
                    array[k] = leftArr[i];
                    steps.push({
                        type: 'place',
                        array: [...array],
                        placed: [k],
                        description: `Placing ${leftArr[i]} at position ${k}`,
                        code: '      arr[k++] = left[i++];',
                        highlight: [3],
                        stats: { accesses: 1 },
                        depth
                    });
                    i++;
                } else {
                    array[k] = rightArr[j];
                    steps.push({
                        type: 'place',
                        array: [...array],
                        placed: [k],
                        description: `Placing ${rightArr[j]} at position ${k}`,
                        code: '      arr[k++] = right[j++];',
                        highlight: [5],
                        stats: { accesses: 1 },
                        depth
                    });
                    j++;
                }
                k++;
            }

            while (i < leftArr.length) {
                array[k] = leftArr[i];
                steps.push({
                    type: 'place',
                    array: [...array],
                    placed: [k],
                    description: `Placing remaining element ${leftArr[i]} at position ${k}`,
                    code: '  while (i < left.length) arr[k++] = left[i++];',
                    highlight: [7],
                    stats: { accesses: 1 },
                    depth
                });
                i++;
                k++;
            }

            while (j < rightArr.length) {
                array[k] = rightArr[j];
                steps.push({
                    type: 'place',
                    array: [...array],
                    placed: [k],
                    description: `Placing remaining element ${rightArr[j]} at position ${k}`,
                    code: '  while (j < right.length) arr[k++] = right[j++];',
                    highlight: [8],
                    stats: { accesses: 1 },
                    depth
                });
                j++;
                k++;
            }
        }

        function mergeSortHelper(left, right, depth = 0) {
            if (left < right) {
                const mid = Math.floor((left + right) / 2);

                steps.push({
                    type: 'divide',
                    array: [...array],
                    range: [left, right],
                    mid: mid,
                    description: `Dividing array from ${left} to ${right} at position ${mid}`,
                    code: 'function mergeSort(left, right) {\n  if (left < right) {\n    const mid = Math.floor((left + right) / 2);',
                    highlight: [0, 1, 2],
                    depth
                });

                mergeSortHelper(left, mid, depth + 1);
                mergeSortHelper(mid + 1, right, depth + 1);
                merge(left, mid, right, depth);
            }
        }

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Merge Sort - divide and conquer approach',
            code: 'function mergeSort(arr) {',
            highlight: [0]
        });

        mergeSortHelper(0, array.length - 1);

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Merge Sort completed! Array is now sorted.',
            code: '}',
            highlight: [9]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                space: 'O(n)'
            },
            code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
            explanation: "Merge Sort uses divide-and-conquer strategy. It divides the array into two halves, recursively sorts them, and then merges the sorted halves back together.",
            applications: [
                "Large datasets requiring stable sorting",
                "External sorting (when data doesn't fit in memory)",
                "Linked list sorting",
                "Parallel processing applications"
            ]
        };
    }

    static quickSort(arr) {
        const steps = [];
        const array = [...arr];

        function partition(low, high, depth = 0) {
            const pivot = array[high];
            let i = low - 1;

            steps.push({
                type: 'pivot',
                array: [...array],
                pivot: high,
                range: [low, high],
                description: `Choosing pivot: ${pivot} at position ${high}`,
                code: 'function partition(low, high) {\n  const pivot = arr[high];\n  let i = low - 1;',
                highlight: [0, 1, 2],
                depth
            });

            for (let j = low; j < high; j++) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [j, high],
                    description: `Comparing ${array[j]} with pivot ${pivot}`,
                    code: '  for (let j = low; j < high; j++) {\n    if (arr[j] < pivot) {',
                    highlight: [3, 4],
                    stats: { comparisons: 1 },
                    depth
                });

                if (array[j] < pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]];
                    steps.push({
                        type: 'swap',
                        array: [...array],
                        swapped: [i, j],
                        description: `Swapping ${array[i]} and ${array[j]} (element smaller than pivot)`,
                        code: '      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];',
                        highlight: [5, 6],
                        stats: { swaps: 1 },
                        depth
                    });
                }
            }

            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            steps.push({
                type: 'pivot_place',
                array: [...array],
                swapped: [i + 1, high],
                pivotPosition: i + 1,
                description: `Placing pivot ${pivot} at its final position ${i + 1}`,
                code: '  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n  return i + 1;',
                highlight: [8, 9],
                stats: { swaps: 1 },
                depth
            });

            return i + 1;
        }

        function quickSortHelper(low, high, depth = 0) {
            if (low < high) {
                steps.push({
                    type: 'divide',
                    array: [...array],
                    range: [low, high],
                    description: `Sorting subarray from ${low} to ${high}`,
                    code: 'function quickSort(low, high) {\n  if (low < high) {',
                    highlight: [0, 1],
                    depth
                });

                const pi = partition(low, high, depth);

                quickSortHelper(low, pi - 1, depth + 1);
                quickSortHelper(pi + 1, high, depth + 1);
            }
        }

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Quick Sort - divide and conquer with partitioning',
            code: 'function quickSort(arr) {',
            highlight: [0]
        });

        quickSortHelper(0, array.length - 1);

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Quick Sort completed! Array is now sorted.',
            code: '}',
            highlight: [10]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
                space: 'O(log n)'
            },
            code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
            explanation: "Quick Sort picks a 'pivot' element and partitions the array around it, placing smaller elements before and larger elements after the pivot. It then recursively sorts the sub-arrays.",
            applications: [
                "General-purpose sorting (most programming languages)",
                "In-place sorting with good average performance",
                "Cache-efficient sorting",
                "Parallel processing implementations"
            ]
        };
    }

    static heapSort(arr) {
        const steps = [];
        const array = [...arr];
        const n = array.length;

        function heapify(n, i, depth = 0) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            steps.push({
                type: 'heapify_start',
                array: [...array],
                node: i,
                left: left < n ? left : null,
                right: right < n ? right : null,
                description: `Heapifying subtree rooted at index ${i}`,
                code: 'function heapify(n, i) {\n  let largest = i;\n  const left = 2 * i + 1;\n  const right = 2 * i + 2;',
                highlight: [0, 1, 2, 3],
                depth
            });

            if (left < n) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [left, largest],
                    description: `Comparing left child ${array[left]} with current largest ${array[largest]}`,
                    code: '  if (left < n && arr[left] > arr[largest]) {',
                    highlight: [4],
                    stats: { comparisons: 1 },
                    depth
                });

                if (array[left] > array[largest]) {
                    largest = left;
                    steps.push({
                        type: 'update_largest',
                        array: [...array],
                        newLargest: left,
                        description: `Left child ${array[left]} is larger, updating largest`,
                        code: '    largest = left;',
                        highlight: [5],
                        depth
                    });
                }
            }

            if (right < n) {
                steps.push({
                    type: 'compare',
                    array: [...array],
                    comparing: [right, largest],
                    description: `Comparing right child ${array[right]} with current largest ${array[largest]}`,
                    code: '  if (right < n && arr[right] > arr[largest]) {',
                    highlight: [6],
                    stats: { comparisons: 1 },
                    depth
                });

                if (array[right] > array[largest]) {
                    largest = right;
                    steps.push({
                        type: 'update_largest',
                        array: [...array],
                        newLargest: right,
                        description: `Right child ${array[right]} is larger, updating largest`,
                        code: '    largest = right;',
                        highlight: [7],
                        depth
                    });
                }
            }

            if (largest !== i) {
                [array[i], array[largest]] = [array[largest], array[i]];
                steps.push({
                    type: 'swap',
                    array: [...array],
                    swapped: [i, largest],
                    description: `Swapping ${array[i]} and ${array[largest]} to maintain heap property`,
                    code: '  if (largest !== i) {\n    [arr[i], arr[largest]] = [arr[largest], arr[i]];',
                    highlight: [8, 9],
                    stats: { swaps: 1 },
                    depth
                });

                heapify(n, largest, depth + 1);
            }
        }

        steps.push({
            type: 'init',
            array: [...array],
            description: 'Starting Heap Sort - building max heap then extracting elements',
            code: 'function heapSort(arr) {',
            highlight: [0]
        });

        // Build max heap
        steps.push({
            type: 'build_heap',
            array: [...array],
            description: 'Building max heap from bottom up',
            code: '  // Build max heap\n  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {',
            highlight: [1, 2]
        });

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }

        steps.push({
            type: 'heap_built',
            array: [...array],
            description: 'Max heap built successfully. Largest element is at root.',
            code: '  }',
            highlight: [4]
        });

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            steps.push({
                type: 'extract',
                array: [...array],
                swapped: [0, i],
                extracted: i,
                description: `Extracting maximum element ${array[i]} to position ${i}`,
                code: '  for (let i = n - 1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];',
                highlight: [5, 6],
                stats: { swaps: 1 }
            });

            heapify(i, 0);
        }

        steps.push({
            type: 'complete',
            array: [...array],
            description: 'Heap Sort completed! Array is now sorted.',
            code: '}',
            highlight: [8]
        });

        return {
            steps,
            complexity: {
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                space: 'O(1)'
            },
            code: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
            explanation: "Heap Sort builds a max heap from the input array, then repeatedly extracts the maximum element and places it at the end of the array, maintaining the heap property.",
            applications: [
                "Systems with strict memory constraints",
                "Real-time systems requiring predictable performance",
                "Priority queue implementations",
                "Selection algorithms (finding k largest elements)"
            ]
        };
    }

    static getAlgorithm(algorithmId) {
        const algorithms = {
            'bubble-sort': this.bubbleSort,
            'selection-sort': this.selectionSort,
            'insertion-sort': this.insertionSort,
            'merge-sort': this.mergeSort,
            'quick-sort': this.quickSort,
            'heap-sort': this.heapSort
        };

        return algorithms[algorithmId] || null;
    }

    static generateSteps(algorithmId, data = [64, 34, 25, 12, 22, 11, 90]) {
        const algorithm = this.getAlgorithm(algorithmId);
        if (!algorithm) return [];
        
        const result = algorithm(data);
        return result.steps || [];
    }

    static getImplementation(algorithmId) {
        const implementations = {
            'bubble-sort': {
                timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                spaceComplexity: 'O(1)',
                code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
                description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.",
                applications: [
                    "Educational purposes - easy to understand",
                    "Small datasets where simplicity is preferred",
                    "Nearly sorted data (adaptive version)"
                ],
                performanceNotes: "Simple but inefficient for large datasets. Best case O(n) when array is already sorted with optimization."
            },
            'selection-sort': {
                timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
                spaceComplexity: 'O(1)',
                code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
                description: "Selection Sort divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region.",
                applications: [
                    "Small datasets",
                    "Memory-constrained environments",
                    "When minimizing the number of swaps is important"
                ],
                performanceNotes: "Always performs O(n²) comparisons regardless of input. Minimizes number of swaps to O(n)."
            },
            'insertion-sort': {
                timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                spaceComplexity: 'O(1)',
                code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
                description: "Insertion Sort builds the final sorted array one element at a time by inserting each element into its correct position.",
                applications: [
                    "Small datasets",
                    "Nearly sorted arrays",
                    "Online algorithms (sorting data as it arrives)",
                    "Hybrid sorting algorithms (used in Timsort)"
                ],
                performanceNotes: "Efficient for small datasets and nearly sorted arrays. Adaptive and stable sorting algorithm."
            },
            'merge-sort': {
                timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                spaceComplexity: 'O(n)',
                code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
                description: "Merge Sort uses divide-and-conquer strategy, dividing the array into halves, recursively sorts them, and merges the results.",
                applications: [
                    "Large datasets requiring stable sorting",
                    "External sorting (when data doesn't fit in memory)",
                    "Linked list sorting",
                    "Parallel processing applications"
                ],
                performanceNotes: "Guaranteed O(n log n) performance but requires O(n) extra space. Stable sorting algorithm."
            },
            'quick-sort': {
                timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
                spaceComplexity: 'O(log n)',
                code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
                description: "Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.",
                applications: [
                    "General-purpose sorting (most programming languages)",
                    "In-place sorting with good average performance",
                    "Cache-efficient sorting",
                    "Parallel processing implementations"
                ],
                performanceNotes: "Average case O(n log n) but worst case O(n²) with poor pivot selection. In-place sorting with O(log n) space for recursion."
            },
            'heap-sort': {
                timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                spaceComplexity: 'O(1)',
                code: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
                description: "Heap Sort builds a max heap from the input array, then repeatedly extracts the maximum element.",
                applications: [
                    "Systems with strict memory constraints",
                    "Real-time systems requiring predictable performance",
                    "Priority queue implementations",
                    "Selection algorithms (finding k largest elements)"
                ],
                performanceNotes: "Guaranteed O(n log n) performance with O(1) space complexity. Not stable but in-place sorting."
            }
        };

        return implementations[algorithmId] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingAlgorithms;
}

// Make available globally
window.SortingAlgorithms = SortingAlgorithms; 