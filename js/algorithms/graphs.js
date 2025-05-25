/**
 * Graph Algorithms Implementation
 * Contains graph algorithm implementations with step-by-step visualization
 */

class GraphAlgorithms {
    static graphBFS(graph, startNode) {
        const steps = [];
        const visited = new Set();
        const queue = [startNode];
        const result = [];
        
        steps.push({
            type: 'init',
            graph: this.cloneGraph(graph),
            startNode: startNode,
            visited: Array.from(visited),
            queue: [...queue],
            result: [...result],
            description: `Starting BFS from node ${startNode}`,
            code: 'function bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];',
            highlight: [0, 1, 2]
        });

        while (queue.length > 0) {
            const current = queue.shift();
            
            if (visited.has(current)) continue;
            
            visited.add(current);
            result.push(current);
            
            steps.push({
                type: 'visit',
                graph: this.cloneGraph(graph),
                currentNode: current,
                visited: Array.from(visited),
                queue: [...queue],
                result: [...result],
                description: `Visiting node ${current}`,
                code: '  while (queue.length > 0) {\n    const current = queue.shift();\n    visited.add(current);',
                highlight: [3, 4, 5],
                stats: { visited: 1 }
            });

            // Add neighbors to queue
            const neighbors = graph[current] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    
                    steps.push({
                        type: 'explore',
                        graph: this.cloneGraph(graph),
                        currentNode: current,
                        neighbor: neighbor,
                        visited: Array.from(visited),
                        queue: [...queue],
                        description: `Adding neighbor ${neighbor} to queue`,
                        code: '    for (const neighbor of graph[current]) {\n      if (!visited.has(neighbor)) {\n        queue.push(neighbor);',
                        highlight: [6, 7, 8],
                        stats: { explored: 1 }
                    });
                }
            }
        }

        steps.push({
            type: 'complete',
            graph: this.cloneGraph(graph),
            visited: Array.from(visited),
            result: [...result],
            description: `BFS completed. Traversal order: [${result.join(', ')}]`,
            code: '}',
            highlight: [9]
        });

        return {
            steps,
            result: [...result],
            complexity: {
                time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                space: 'O(V)'
            },
            code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    result.push(current);
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
            explanation: "BFS explores all vertices at the current depth before moving to vertices at the next depth level, using a queue data structure.",
            applications: [
                "Shortest path in unweighted graphs",
                "Level-order traversal",
                "Finding connected components",
                "Web crawling"
            ]
        };
    }

    static graphDFS(graph, startNode) {
        const steps = [];
        const visited = new Set();
        const result = [];
        
        steps.push({
            type: 'init',
            graph: this.cloneGraph(graph),
            startNode: startNode,
            visited: Array.from(visited),
            result: [...result],
            description: `Starting DFS from node ${startNode}`,
            code: 'function dfs(graph, start) {\n  const visited = new Set();\n  const result = [];',
            highlight: [0, 1, 2]
        });

        this.dfsHelper(graph, startNode, visited, result, steps);

        steps.push({
            type: 'complete',
            graph: this.cloneGraph(graph),
            visited: Array.from(visited),
            result: [...result],
            description: `DFS completed. Traversal order: [${result.join(', ')}]`,
            code: '}',
            highlight: [8]
        });

        return {
            steps,
            result: [...result],
            complexity: {
                time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                space: 'O(V)'
            },
            code: `function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(node) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(start);
  return result;
}`,
            explanation: "DFS explores as far as possible along each branch before backtracking, using recursion or a stack.",
            applications: [
                "Topological sorting",
                "Detecting cycles",
                "Finding strongly connected components",
                "Maze solving"
            ]
        };
    }

    static dfsHelper(graph, node, visited, result, steps) {
        visited.add(node);
        result.push(node);

        steps.push({
            type: 'visit',
            graph: this.cloneGraph(graph),
            currentNode: node,
            visited: Array.from(visited),
            result: [...result],
            description: `Visiting node ${node}`,
            code: '  function dfsHelper(node) {\n    visited.add(node);\n    result.push(node);',
            highlight: [3, 4, 5],
            stats: { visited: 1 }
        });

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                steps.push({
                    type: 'explore',
                    graph: this.cloneGraph(graph),
                    currentNode: node,
                    neighbor: neighbor,
                    visited: Array.from(visited),
                    description: `Exploring neighbor ${neighbor} from ${node}`,
                    code: '    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        dfsHelper(neighbor);',
                    highlight: [6, 7, 8],
                    stats: { explored: 1 }
                });

                this.dfsHelper(graph, neighbor, visited, result, steps);
            }
        }
    }

    static topologicalSort(graph) {
        const steps = [];
        const visited = new Set();
        const stack = [];
        const nodes = Object.keys(graph);

        steps.push({
            type: 'init',
            graph: this.cloneGraph(graph),
            visited: Array.from(visited),
            stack: [...stack],
            description: 'Starting topological sort using DFS',
            code: 'function topologicalSort(graph) {\n  const visited = new Set();\n  const stack = [];',
            highlight: [0, 1, 2]
        });

        // Perform DFS for all unvisited nodes
        for (const node of nodes) {
            if (!visited.has(node)) {
                this.topologicalDFS(graph, node, visited, stack, steps);
            }
        }

        const result = stack.reverse();

        steps.push({
            type: 'complete',
            graph: this.cloneGraph(graph),
            result: [...result],
            description: `Topological sort completed. Order: [${result.join(', ')}]`,
            code: '  return stack.reverse();',
            highlight: [9]
        });

        return {
            steps,
            result: [...result],
            complexity: {
                time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                space: 'O(V)'
            },
            code: `function topologicalSort(graph) {
  const visited = new Set();
  const stack = [];
  
  function topologicalDFS(node) {
    visited.add(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        topologicalDFS(neighbor);
      }
    }
    
    stack.push(node);
  }
  
  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      topologicalDFS(node);
    }
  }
  
  return stack.reverse();
}`,
            explanation: "Topological sorting produces a linear ordering of vertices such that for every directed edge (u,v), vertex u comes before v in the ordering.",
            applications: [
                "Task scheduling",
                "Course prerequisite ordering",
                "Build systems",
                "Dependency resolution"
            ]
        };
    }

    static topologicalDFS(graph, node, visited, stack, steps) {
        visited.add(node);

        steps.push({
            type: 'visit',
            graph: this.cloneGraph(graph),
            currentNode: node,
            visited: Array.from(visited),
            stack: [...stack],
            description: `Visiting node ${node}`,
            code: '  function topologicalDFS(node) {\n    visited.add(node);',
            highlight: [3, 4],
            stats: { visited: 1 }
        });

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                steps.push({
                    type: 'explore',
                    graph: this.cloneGraph(graph),
                    currentNode: node,
                    neighbor: neighbor,
                    visited: Array.from(visited),
                    description: `Exploring neighbor ${neighbor} from ${node}`,
                    code: '    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        topologicalDFS(neighbor);',
                    highlight: [5, 6, 7],
                    stats: { explored: 1 }
                });

                this.topologicalDFS(graph, neighbor, visited, stack, steps);
            }
        }

        stack.push(node);
        steps.push({
            type: 'finish',
            graph: this.cloneGraph(graph),
            currentNode: node,
            stack: [...stack],
            description: `Finished processing ${node}, adding to stack`,
            code: '    stack.push(node);',
            highlight: [8],
            stats: { finished: 1 }
        });
    }

    static stronglyConnectedComponents(graph) {
        const steps = [];
        const visited = new Set();
        const stack = [];
        const nodes = Object.keys(graph);

        steps.push({
            type: 'init',
            graph: this.cloneGraph(graph),
            description: 'Starting Kosaraju\'s algorithm for finding strongly connected components',
            code: 'function kosaraju(graph) {\n  // Step 1: Fill stack with finish times',
            highlight: [0, 1]
        });

        // Step 1: Fill vertices in stack according to their finishing times
        for (const node of nodes) {
            if (!visited.has(node)) {
                this.fillOrder(graph, node, visited, stack, steps);
            }
        }

        steps.push({
            type: 'transpose',
            graph: this.cloneGraph(graph),
            stack: [...stack],
            description: 'Step 2: Creating transpose graph',
            code: '  // Step 2: Create transpose graph',
            highlight: [2]
        });

        // Step 2: Create a reversed graph
        const transposedGraph = this.getTranspose(graph);

        steps.push({
            type: 'transpose_complete',
            graph: this.cloneGraph(transposedGraph),
            description: 'Transpose graph created',
            code: '  const transposedGraph = getTranspose(graph);',
            highlight: [3]
        });

        // Step 3: Process all vertices in order defined by stack
        visited.clear();
        const components = [];

        steps.push({
            type: 'find_components',
            graph: this.cloneGraph(transposedGraph),
            stack: [...stack],
            description: 'Step 3: Finding SCCs by processing vertices in reverse finish order',
            code: '  // Step 3: Process vertices in reverse finish order',
            highlight: [4]
        });

        while (stack.length > 0) {
            const node = stack.pop();
            if (!visited.has(node)) {
                const component = [];
                this.dfsForSCC(transposedGraph, node, visited, component, steps);
                components.push(component);

                steps.push({
                    type: 'component_found',
                    graph: this.cloneGraph(transposedGraph),
                    component: [...component],
                    components: components.map(comp => [...comp]),
                    description: `Found strongly connected component: [${component.join(', ')}]`,
                    code: '    components.push(component);',
                    highlight: [5]
                });
            }
        }

        steps.push({
            type: 'complete',
            graph: this.cloneGraph(graph),
            components: components.map(comp => [...comp]),
            description: `Found ${components.length} strongly connected components`,
            code: '  return components;',
            highlight: [6]
        });

        return {
            steps,
            components: components.map(comp => [...comp]),
            complexity: {
                time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                space: 'O(V)'
            },
            code: `function kosaraju(graph) {
  const visited = new Set();
  const stack = [];
  
  // Step 1: Fill stack with finish times
  function fillOrder(node) {
    visited.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        fillOrder(neighbor);
      }
    }
    stack.push(node);
  }
  
  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      fillOrder(node);
    }
  }
  
  // Step 2: Create transpose graph
  const transposedGraph = getTranspose(graph);
  
  // Step 3: Process vertices in reverse finish order
  visited.clear();
  const components = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      const component = [];
      dfsForSCC(transposedGraph, node, component);
      components.push(component);
    }
  }
  
  return components;
}`,
            explanation: "Kosaraju's algorithm finds strongly connected components using two DFS passes: one on the original graph to get finish times, and one on the transpose graph.",
            applications: [
                "Social network analysis",
                "Web page ranking",
                "Compiler optimization",
                "Circuit design"
            ]
        };
    }

    static fillOrder(graph, node, visited, stack, steps) {
        visited.add(node);

        steps.push({
            type: 'fill_visit',
            graph: this.cloneGraph(graph),
            currentNode: node,
            visited: Array.from(visited),
            stack: [...stack],
            description: `Visiting node ${node} for fill order`,
            code: '  function fillOrder(node) {\n    visited.add(node);',
            highlight: [0, 1],
            stats: { visited: 1 }
        });

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.fillOrder(graph, neighbor, visited, stack, steps);
            }
        }

        stack.push(node);
        steps.push({
            type: 'fill_finish',
            graph: this.cloneGraph(graph),
            currentNode: node,
            stack: [...stack],
            description: `Finished processing ${node}, adding to stack`,
            code: '    stack.push(node);',
            highlight: [2],
            stats: { finished: 1 }
        });
    }

    static dfsForSCC(graph, node, visited, component, steps) {
        visited.add(node);
        component.push(node);

        steps.push({
            type: 'scc_visit',
            graph: this.cloneGraph(graph),
            currentNode: node,
            visited: Array.from(visited),
            component: [...component],
            description: `Adding node ${node} to current component`,
            code: '  function dfsForSCC(node, component) {\n    visited.add(node);\n    component.push(node);',
            highlight: [0, 1, 2],
            stats: { visited: 1 }
        });

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.dfsForSCC(graph, neighbor, visited, component, steps);
            }
        }
    }

    static getTranspose(graph) {
        const transpose = {};
        
        // Initialize all nodes
        for (const node of Object.keys(graph)) {
            transpose[node] = [];
        }
        
        // Reverse all edges
        for (const node of Object.keys(graph)) {
            for (const neighbor of graph[node]) {
                if (!transpose[neighbor]) {
                    transpose[neighbor] = [];
                }
                transpose[neighbor].push(node);
            }
        }
        
        return transpose;
    }

    static cloneGraph(graph) {
        const clone = {};
        for (const node in graph) {
            clone[node] = [...graph[node]];
        }
        return clone;
    }

    static getAlgorithm(algorithmId) {
        const algorithms = {
            'graph-bfs': this.graphBFS,
            'graph-dfs': this.graphDFS,
            'topological-sort': this.topologicalSort,
            'strongly-connected': this.stronglyConnectedComponents
        };

        return algorithms[algorithmId] || null;
    }

    static generateSteps(algorithmId) {
        const algorithm = this.getAlgorithm(algorithmId);
        if (!algorithm) return [];
        
        // Create sample graph data
        const sampleGraph = {
            'A': ['B', 'C'],
            'B': ['D', 'E'],
            'C': ['F'],
            'D': [],
            'E': ['F'],
            'F': []
        };
        
        const startNode = 'A';
        const result = algorithm(sampleGraph, startNode);
        return result.steps || [];
    }

    static getImplementation(algorithmId) {
        const implementations = {
            'graph-bfs': {
                timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                spaceComplexity: 'O(V)',
                code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    result.push(current);
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
                description: "BFS explores all vertices at the current depth before moving to vertices at the next depth level, using a queue data structure.",
                applications: [
                    "Shortest path in unweighted graphs",
                    "Level-order traversal",
                    "Finding connected components",
                    "Web crawling"
                ],
                performanceNotes: "Guarantees shortest path in unweighted graphs. Space complexity can be high for wide graphs."
            },
            'graph-dfs': {
                timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                spaceComplexity: 'O(V)',
                code: `function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(node) {
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(start);
  return result;
}`,
                description: "DFS explores as far as possible along each branch before backtracking, using recursion or a stack.",
                applications: [
                    "Topological sorting",
                    "Detecting cycles",
                    "Finding strongly connected components",
                    "Maze solving"
                ],
                performanceNotes: "Uses less memory than BFS for deep graphs. Recursion depth limited by call stack size."
            },
            'topological-sort': {
                timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                spaceComplexity: 'O(V)',
                code: `function topologicalSort(graph) {
  const visited = new Set();
  const stack = [];
  
  function topologicalDFS(node) {
    visited.add(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        topologicalDFS(neighbor);
      }
    }
    
    stack.push(node);
  }
  
  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      topologicalDFS(node);
    }
  }
  
  return stack.reverse();
}`,
                description: "Topological sorting produces a linear ordering of vertices such that for every directed edge (u,v), vertex u comes before v.",
                applications: [
                    "Task scheduling",
                    "Course prerequisite ordering",
                    "Build systems",
                    "Dependency resolution"
                ],
                performanceNotes: "Only works on Directed Acyclic Graphs (DAGs). Detects cycles if they exist."
            },
            'strongly-connected': {
                timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
                spaceComplexity: 'O(V)',
                code: `function kosaraju(graph) {
  const visited = new Set();
  const stack = [];
  
  // Step 1: Fill stack with finish times
  function fillOrder(node) {
    visited.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        fillOrder(neighbor);
      }
    }
    stack.push(node);
  }
  
  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      fillOrder(node);
    }
  }
  
  // Step 2: Create transpose graph
  const transposedGraph = getTranspose(graph);
  
  // Step 3: Process vertices in reverse finish order
  visited.clear();
  const components = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      const component = [];
      dfsForSCC(transposedGraph, node, component);
      components.push(component);
    }
  }
  
  return components;
}`,
                description: "Kosaraju's algorithm finds strongly connected components using two DFS passes on the original and transpose graphs.",
                applications: [
                    "Social network analysis",
                    "Web page ranking",
                    "Compiler optimization",
                    "Circuit design"
                ],
                performanceNotes: "Requires two DFS traversals. Works only on directed graphs. Linear time complexity."
            }
        };

        return implementations[algorithmId] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphAlgorithms;
}

// Make available globally
window.GraphAlgorithms = GraphAlgorithms; 