/**
 * Pathfinding Algorithms Implementation
 * Contains pathfinding algorithm implementations with step-by-step visualization
 */

class PathfindingAlgorithms {
  static dijkstra(grid, start, end) {
    const steps = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    const previous = Array(rows).fill().map(() => Array(cols).fill(null));
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const queue = [];

    distances[start.row][start.col] = 0;
    queue.push({ ...start, distance: 0 });

    steps.push({
      type: 'init',
      grid: grid.map(row => [...row]),
      start: start,
      end: end,
      distances: distances.map(row => [...row]),
      description: "Starting Dijkstra's Algorithm - finding shortest path",
      code: "function dijkstra(grid, start, end) {\n  const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));\n  distances[start.row][start.col] = 0;",
      highlight: [0, 1, 2]
    });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

    while (queue.length > 0) {
      // Find node with minimum distance
      queue.sort((a, b) => a.distance - b.distance);
      const current = queue.shift();

      if (visited[current.row][current.col]) continue;
      visited[current.row][current.col] = true;

      steps.push({
        type: 'visit',
        grid: grid.map(row => [...row]),
        current: current,
        visited: visited.map(row => [...row]),
        distances: distances.map(row => [...row]),
        description: `Visiting node (${current.row}, ${current.col}) with distance ${current.distance}`,
        code: "  while (queue.length > 0) {\n    const current = queue.shift();\n    visited[current.row][current.col] = true;",
        highlight: [3, 4, 5],
        stats: { visited: 1 }
      });

      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        const path = [];
        let pathNode = { row: end.row, col: end.col };

        while (pathNode) {
          path.unshift(pathNode);
          pathNode = previous[pathNode.row][pathNode.col];
        }

        steps.push({
          type: 'path_found',
          grid: grid.map(row => [...row]),
          path: path,
          distance: distances[end.row][end.col],
          description: `Path found! Total distance: ${distances[end.row][end.col]}`,
          code: "    if (current === end) {\n      // Reconstruct path\n      return path;",
          highlight: [6, 7, 8]
        });

        return {
          steps,
          path: path,
          distance: distances[end.row][end.col],
          complexity: {
            time: { best: 'O(V log V)', average: 'O(V log V)', worst: 'O(V log V)' },
            space: 'O(V)'
          },
          code: `function dijkstra(grid, start, end) {
  const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const queue = [start];
  
  distances[start.row][start.col] = 0;
  
  while (queue.length > 0) {
    const current = getMinDistanceNode(queue, distances);
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col]) {
        const newDistance = distances[current.row][current.col] + 1;
        if (newDistance < distances[neighbor.row][neighbor.col]) {
          distances[neighbor.row][neighbor.col] = newDistance;
          previous[neighbor.row][neighbor.col] = current;
          queue.push(neighbor);
        }
      }
    }
  }
  
  return null; // No path found
}`,
          explanation: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph by maintaining a priority queue of unvisited nodes and always processing the node with the smallest known distance.",
          applications: [
            "GPS navigation systems",
            "Network routing protocols",
            "Social networking (shortest path between users)",
            "Game AI pathfinding"
          ]
        };
      }

      // Check all neighbors
      for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !visited[newRow][newCol] && grid[newRow][newCol] !== 1) {

          const newDistance = distances[current.row][current.col] + 1;

          steps.push({
            type: 'explore',
            grid: grid.map(row => [...row]),
            current: current,
            neighbor: { row: newRow, col: newCol },
            newDistance: newDistance,
            oldDistance: distances[newRow][newCol],
            description: `Exploring neighbor (${newRow}, ${newCol}). New distance: ${newDistance}, Old distance: ${distances[newRow][newCol]}`,
            code: "    for (const neighbor of getNeighbors(current)) {\n      const newDistance = distances[current] + 1;",
            highlight: [9, 10],
            stats: { explored: 1 }
          });

          if (newDistance < distances[newRow][newCol]) {
            distances[newRow][newCol] = newDistance;
            previous[newRow][newCol] = current;
            queue.push({ row: newRow, col: newCol, distance: newDistance });

            steps.push({
              type: 'update_distance',
              grid: grid.map(row => [...row]),
              node: { row: newRow, col: newCol },
              newDistance: newDistance,
              distances: distances.map(row => [...row]),
              description: `Updated distance to (${newRow}, ${newCol}): ${newDistance}`,
              code: "      if (newDistance < distances[neighbor]) {\n        distances[neighbor] = newDistance;\n        previous[neighbor] = current;",
              highlight: [11, 12, 13],
              stats: { updated: 1 }
            });
          }
        }
      }
    }

    steps.push({
      type: 'no_path',
      grid: grid.map(row => [...row]),
      description: "No path found to the destination",
      code: "  }\n  return null; // No path found\n}",
      highlight: [14, 15]
    });

    return {
      steps,
      path: null,
      distance: Infinity,
      complexity: {
        time: { best: 'O(V log V)', average: 'O(V log V)', worst: 'O(V log V)' },
        space: 'O(V)'
      },
      code: `function dijkstra(grid, start, end) {
  const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const queue = [start];
  
  distances[start.row][start.col] = 0;
  
  while (queue.length > 0) {
    const current = getMinDistanceNode(queue, distances);
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col]) {
        const newDistance = distances[current.row][current.col] + 1;
        if (newDistance < distances[neighbor.row][neighbor.col]) {
          distances[neighbor.row][neighbor.col] = newDistance;
          previous[neighbor.row][neighbor.col] = current;
          queue.push(neighbor);
        }
      }
    }
  }
  
  return null; // No path found
}`,
      explanation: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph by maintaining a priority queue of unvisited nodes and always processing the node with the smallest known distance.",
      applications: [
        "GPS navigation systems",
        "Network routing protocols",
        "Social networking (shortest path between users)",
        "Game AI pathfinding"
      ]
    };
  }

  static aStar(grid, start, end) {
    const steps = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
    const previous = Array(rows).fill().map(() => Array(cols).fill(null));
    const openSet = [];
    const closedSet = Array(rows).fill().map(() => Array(cols).fill(false));

    const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, end);
    openSet.push(start);

    steps.push({
      type: 'init',
      grid: grid.map(row => [...row]),
      start: start,
      end: end,
      gScore: gScore.map(row => [...row]),
      fScore: fScore.map(row => [...row]),
      description: "Starting A* Algorithm - using heuristic to guide search",
      code: "function aStar(grid, start, end) {\n  const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));\n  const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));",
      highlight: [0, 1, 2]
    });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (openSet.length > 0) {
      // Find node with lowest fScore
      openSet.sort((a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
      const current = openSet.shift();
      closedSet[current.row][current.col] = true;

      steps.push({
        type: 'visit',
        grid: grid.map(row => [...row]),
        current: current,
        gScore: gScore.map(row => [...row]),
        fScore: fScore.map(row => [...row]),
        heuristic: heuristic(current, end),
        description: `Visiting node (${current.row}, ${current.col}). g=${gScore[current.row][current.col]}, h=${heuristic(current, end)}, f=${fScore[current.row][current.col]}`,
        code: "  while (openSet.length > 0) {\n    const current = getLowestFScore(openSet);\n    closedSet[current.row][current.col] = true;",
        highlight: [3, 4, 5],
        stats: { visited: 1 }
      });

      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        const path = [];
        let pathNode = { row: end.row, col: end.col };

        while (pathNode) {
          path.unshift(pathNode);
          pathNode = previous[pathNode.row][pathNode.col];
        }

        steps.push({
          type: 'path_found',
          grid: grid.map(row => [...row]),
          path: path,
          distance: gScore[end.row][end.col],
          description: `Path found! Total distance: ${gScore[end.row][end.col]}`,
          code: "    if (current === end) {\n      return reconstructPath(previous, end);",
          highlight: [6, 7]
        });

        return {
          steps,
          path: path,
          distance: gScore[end.row][end.col],
          complexity: {
            time: { best: 'O(b^d)', average: 'O(b^d)', worst: 'O(b^d)' },
            space: 'O(b^d)'
          },
          code: `function aStar(grid, start, end) {
  const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const openSet = [start];
  const closedSet = Array(rows).fill().map(() => Array(cols).fill(false));
  
  const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  
  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = heuristic(start, end);
  
  while (openSet.length > 0) {
    const current = getLowestFScore(openSet);
    closedSet[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (closedSet[neighbor.row][neighbor.col]) continue;
      
      const tentativeGScore = gScore[current.row][current.col] + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor.row][neighbor.col]) {
        continue;
      }
      
      previous[neighbor.row][neighbor.col] = current;
      gScore[neighbor.row][neighbor.col] = tentativeGScore;
      fScore[neighbor.row][neighbor.col] = tentativeGScore + heuristic(neighbor, end);
    }
  }
  
  return null; // No path found
}`,
          explanation: "A* algorithm combines the benefits of Dijkstra's algorithm and greedy best-first search by using both the actual distance from start (g) and a heuristic estimate to the goal (h).",
          applications: [
            "Video game pathfinding",
            "Robotics navigation",
            "GPS systems with traffic considerations",
            "Puzzle solving (15-puzzle, etc.)"
          ]
        };
      }

      // Check all neighbors
      for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !closedSet[newRow][newCol] && grid[newRow][newCol] !== 1) {

          const neighbor = { row: newRow, col: newCol };
          const tentativeGScore = gScore[current.row][current.col] + 1;

          steps.push({
            type: 'explore',
            grid: grid.map(row => [...row]),
            current: current,
            neighbor: neighbor,
            tentativeGScore: tentativeGScore,
            currentGScore: gScore[newRow][newCol],
            heuristic: heuristic(neighbor, end),
            description: `Exploring neighbor (${newRow}, ${newCol}). Tentative g=${tentativeGScore}, current g=${gScore[newRow][newCol]}, h=${heuristic(neighbor, end)}`,
            code: "    for (const neighbor of getNeighbors(current)) {\n      const tentativeGScore = gScore[current] + 1;",
            highlight: [8, 9],
            stats: { explored: 1 }
          });

          if (!openSet.some(node => node.row === newRow && node.col === newCol)) {
            openSet.push(neighbor);
          } else if (tentativeGScore >= gScore[newRow][newCol]) {
            continue;
          }

          previous[newRow][newCol] = current;
          gScore[newRow][newCol] = tentativeGScore;
          fScore[newRow][newCol] = tentativeGScore + heuristic(neighbor, end);

          steps.push({
            type: 'update_scores',
            grid: grid.map(row => [...row]),
            node: neighbor,
            gScore: tentativeGScore,
            heuristic: heuristic(neighbor, end),
            fScore: tentativeGScore + heuristic(neighbor, end),
            description: `Updated scores for (${newRow}, ${newCol}): g=${tentativeGScore}, h=${heuristic(neighbor, end)}, f=${tentativeGScore + heuristic(neighbor, end)}`,
            code: "      gScore[neighbor] = tentativeGScore;\n      fScore[neighbor] = tentativeGScore + heuristic(neighbor, end);",
            highlight: [10, 11],
            stats: { updated: 1 }
          });
        }
      }
    }

    steps.push({
      type: 'no_path',
      grid: grid.map(row => [...row]),
      description: "No path found to the destination",
      code: "  }\n  return null; // No path found\n}",
      highlight: [12, 13]
    });

    return {
      steps,
      path: null,
      distance: Infinity,
      complexity: {
        time: { best: 'O(b^d)', average: 'O(b^d)', worst: 'O(b^d)' },
        space: 'O(b^d)'
      },
      code: `function aStar(grid, start, end) {
  const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const openSet = [start];
  const closedSet = Array(rows).fill().map(() => Array(cols).fill(false));
  
  const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  
  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = heuristic(start, end);
  
  while (openSet.length > 0) {
    const current = getLowestFScore(openSet);
    closedSet[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (closedSet[neighbor.row][neighbor.col]) continue;
      
      const tentativeGScore = gScore[current.row][current.col] + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor.row][neighbor.col]) {
        continue;
      }
      
      previous[neighbor.row][neighbor.col] = current;
      gScore[neighbor.row][neighbor.col] = tentativeGScore;
      fScore[neighbor.row][neighbor.col] = tentativeGScore + heuristic(neighbor, end);
    }
  }
  
  return null; // No path found
}`,
      explanation: "A* algorithm combines the benefits of Dijkstra's algorithm and greedy best-first search by using both the actual distance from start (g) and a heuristic estimate to the goal (h).",
      applications: [
        "Video game pathfinding",
        "Robotics navigation",
        "GPS systems with traffic considerations",
        "Puzzle solving (15-puzzle, etc.)"
      ]
    };
  }

  static bfsPath(grid, start, end) {
    const steps = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const previous = Array(rows).fill().map(() => Array(cols).fill(null));
    const queue = [start];

    visited[start.row][start.col] = true;

    steps.push({
      type: 'init',
      grid: grid.map(row => [...row]),
      start: start,
      end: end,
      visited: visited.map(row => [...row]),
      description: "Starting BFS Pathfinding - exploring level by level",
      code: "function bfsPath(grid, start, end) {\n  const queue = [start];\n  visited[start.row][start.col] = true;",
      highlight: [0, 1, 2]
    });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const current = queue.shift();

      steps.push({
        type: 'visit',
        grid: grid.map(row => [...row]),
        current: current,
        visited: visited.map(row => [...row]),
        queueSize: queue.length,
        description: `Visiting node (${current.row}, ${current.col}). Queue size: ${queue.length}`,
        code: "  while (queue.length > 0) {\n    const current = queue.shift();",
        highlight: [3, 4],
        stats: { visited: 1 }
      });

      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        const path = [];
        let pathNode = { row: end.row, col: end.col };

        while (pathNode) {
          path.unshift(pathNode);
          pathNode = previous[pathNode.row][pathNode.col];
        }

        steps.push({
          type: 'path_found',
          grid: grid.map(row => [...row]),
          path: path,
          distance: path.length - 1,
          description: `Path found! Length: ${path.length - 1}`,
          code: "    if (current === end) {\n      return reconstructPath(previous, end);",
          highlight: [5, 6]
        });

        return {
          steps,
          path: path,
          distance: path.length - 1,
          complexity: {
            time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
            space: 'O(V)'
          },
          code: `function bfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const queue = [start];
  
  visited[start.row][start.col] = true;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        visited[neighbor.row][neighbor.col] = true;
        previous[neighbor.row][neighbor.col] = current;
        queue.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
          explanation: "BFS pathfinding explores all nodes at the current depth before moving to nodes at the next depth, guaranteeing the shortest path in unweighted graphs.",
          applications: [
            "Shortest path in unweighted graphs",
            "Level-order traversal",
            "Finding connected components",
            "Social network analysis (degrees of separation)"
          ]
        };
      }

      // Check all neighbors
      for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !visited[newRow][newCol] && grid[newRow][newCol] !== 1) {

          visited[newRow][newCol] = true;
          previous[newRow][newCol] = current;
          queue.push({ row: newRow, col: newCol });

          steps.push({
            type: 'explore',
            grid: grid.map(row => [...row]),
            current: current,
            neighbor: { row: newRow, col: newCol },
            visited: visited.map(row => [...row]),
            queueSize: queue.length,
            description: `Added neighbor (${newRow}, ${newCol}) to queue. Queue size: ${queue.length}`,
            code: "    for (const neighbor of getNeighbors(current)) {\n      if (!visited[neighbor] && grid[neighbor] !== 1) {\n        visited[neighbor] = true;\n        queue.push(neighbor);",
            highlight: [7, 8, 9, 10],
            stats: { explored: 1 }
          });
        }
      }
    }

    steps.push({
      type: 'no_path',
      grid: grid.map(row => [...row]),
      description: "No path found to the destination",
      code: "  }\n  return null; // No path found\n}",
      highlight: [11, 12]
    });

    return {
      steps,
      path: null,
      distance: Infinity,
      complexity: {
        time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        space: 'O(V)'
      },
      code: `function bfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const queue = [start];
  
  visited[start.row][start.col] = true;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        visited[neighbor.row][neighbor.col] = true;
        previous[neighbor.row][neighbor.col] = current;
        queue.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
      explanation: "BFS pathfinding explores all nodes at the current depth before moving to nodes at the next depth, guaranteeing the shortest path in unweighted graphs.",
      applications: [
        "Shortest path in unweighted graphs",
        "Level-order traversal",
        "Finding connected components",
        "Social network analysis (degrees of separation)"
      ]
    };
  }

  static dfsPath(grid, start, end) {
    const steps = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const previous = Array(rows).fill().map(() => Array(cols).fill(null));
    const stack = [start];

    steps.push({
      type: 'init',
      grid: grid.map(row => [...row]),
      start: start,
      end: end,
      visited: visited.map(row => [...row]),
      description: "Starting DFS Pathfinding - exploring as deep as possible",
      code: "function dfsPath(grid, start, end) {\n  const stack = [start];",
      highlight: [0, 1]
    });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (stack.length > 0) {
      const current = stack.pop();

      if (visited[current.row][current.col]) continue;
      visited[current.row][current.col] = true;

      steps.push({
        type: 'visit',
        grid: grid.map(row => [...row]),
        current: current,
        visited: visited.map(row => [...row]),
        stackSize: stack.length,
        description: `Visiting node (${current.row}, ${current.col}). Stack size: ${stack.length}`,
        code: "  while (stack.length > 0) {\n    const current = stack.pop();\n    visited[current.row][current.col] = true;",
        highlight: [2, 3, 4],
        stats: { visited: 1 }
      });

      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        const path = [];
        let pathNode = { row: end.row, col: end.col };

        while (pathNode) {
          path.unshift(pathNode);
          pathNode = previous[pathNode.row][pathNode.col];
        }

        steps.push({
          type: 'path_found',
          grid: grid.map(row => [...row]),
          path: path,
          distance: path.length - 1,
          description: `Path found! Length: ${path.length - 1} (Note: DFS doesn't guarantee shortest path)`,
          code: "    if (current === end) {\n      return reconstructPath(previous, end);",
          highlight: [5, 6]
        });

        return {
          steps,
          path: path,
          distance: path.length - 1,
          complexity: {
            time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
            space: 'O(V)'
          },
          code: `function dfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const stack = [start];
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        previous[neighbor.row][neighbor.col] = current;
        stack.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
          explanation: "DFS pathfinding explores as far as possible along each branch before backtracking. It doesn't guarantee the shortest path but uses less memory than BFS.",
          applications: [
            "Maze solving",
            "Topological sorting",
            "Finding strongly connected components",
            "Detecting cycles in graphs"
          ]
        };
      }

      // Check all neighbors (in reverse order for consistent visualization)
      for (let i = directions.length - 1; i >= 0; i--) {
        const [dr, dc] = directions[i];
        const newRow = current.row + dr;
        const newCol = current.col + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
          !visited[newRow][newCol] && grid[newRow][newCol] !== 1) {

          previous[newRow][newCol] = current;
          stack.push({ row: newRow, col: newCol });

          steps.push({
            type: 'explore',
            grid: grid.map(row => [...row]),
            current: current,
            neighbor: { row: newRow, col: newCol },
            visited: visited.map(row => [...row]),
            stackSize: stack.length,
            description: `Added neighbor (${newRow}, ${newCol}) to stack. Stack size: ${stack.length}`,
            code: "    for (const neighbor of getNeighbors(current)) {\n      if (!visited[neighbor] && grid[neighbor] !== 1) {\n        stack.push(neighbor);",
            highlight: [7, 8, 9],
            stats: { explored: 1 }
          });
        }
      }
    }

    steps.push({
      type: 'no_path',
      grid: grid.map(row => [...row]),
      description: "No path found to the destination",
      code: "  }\n  return null; // No path found\n}",
      highlight: [10, 11]
    });

    return {
      steps,
      path: null,
      distance: Infinity,
      complexity: {
        time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        space: 'O(V)'
      },
      code: `function dfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const stack = [start];
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        previous[neighbor.row][neighbor.col] = current;
        stack.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
      explanation: "DFS pathfinding explores as far as possible along each branch before backtracking. It doesn't guarantee the shortest path but uses less memory than BFS.",
      applications: [
        "Maze solving",
        "Topological sorting",
        "Finding strongly connected components",
        "Detecting cycles in graphs"
      ]
    };
  }

  static getAlgorithm(algorithmId) {
    const algorithms = {
      'dijkstra': this.dijkstra,
      'a-star': this.aStar,
      'bfs-path': this.bfsPath,
      'dfs-path': this.dfsPath
    };

    return algorithms[algorithmId] || null;
  }

  static generateSteps(algorithmId) {
    const algorithm = this.getAlgorithm(algorithmId);
    if (!algorithm) return [];
    
    // Create a sample grid for pathfinding
    const grid = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0]
    ];
    const start = { row: 0, col: 0 };
    const end = { row: 4, col: 4 };
    
    const result = algorithm(grid, start, end);
    return result.steps || [];
  }

  static getImplementation(algorithmId) {
    const implementations = {
      'dijkstra': {
        timeComplexity: { best: 'O(V log V)', average: 'O(V log V)', worst: 'O(V log V)' },
        spaceComplexity: 'O(V)',
        code: `function dijkstra(grid, start, end) {
  const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const queue = [start];
  
  distances[start.row][start.col] = 0;
  
  while (queue.length > 0) {
    const current = getMinDistanceNode(queue, distances);
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col]) {
        const newDistance = distances[current.row][current.col] + 1;
        if (newDistance < distances[neighbor.row][neighbor.col]) {
          distances[neighbor.row][neighbor.col] = newDistance;
          previous[neighbor.row][neighbor.col] = current;
          queue.push(neighbor);
        }
      }
    }
  }
  
  return null;
}`,
        description: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph by maintaining a priority queue of unvisited nodes.",
        applications: [
          "GPS navigation systems",
          "Network routing protocols",
          "Social networking (shortest path between users)",
          "Game AI pathfinding"
        ],
        performanceNotes: "Guarantees shortest path in weighted graphs. Time complexity depends on priority queue implementation."
      },
      'a-star': {
        timeComplexity: { best: 'O(b^d)', average: 'O(b^d)', worst: 'O(b^d)' },
        spaceComplexity: 'O(b^d)',
        code: `function aStar(grid, start, end) {
  const gScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const fScore = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const openSet = [start];
  const closedSet = Array(rows).fill().map(() => Array(cols).fill(false));
  
  const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  
  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = heuristic(start, end);
  
  while (openSet.length > 0) {
    const current = getLowestFScore(openSet);
    closedSet[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (closedSet[neighbor.row][neighbor.col]) continue;
      
      const tentativeGScore = gScore[current.row][current.col] + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor.row][neighbor.col]) {
        continue;
      }
      
      previous[neighbor.row][neighbor.col] = current;
      gScore[neighbor.row][neighbor.col] = tentativeGScore;
      fScore[neighbor.row][neighbor.col] = tentativeGScore + heuristic(neighbor, end);
    }
  }
  
  return null;
}`,
        description: "A* algorithm combines Dijkstra's algorithm with a heuristic to guide the search towards the goal more efficiently.",
        applications: [
          "Video game pathfinding",
          "Robotics navigation",
          "GPS systems with traffic considerations",
          "Puzzle solving (15-puzzle, etc.)"
        ],
        performanceNotes: "More efficient than Dijkstra when good heuristic is available. Performance depends on heuristic quality."
      },
      'bfs-path': {
        timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        spaceComplexity: 'O(V)',
        code: `function bfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const queue = [start];
  
  visited[start.row][start.col] = true;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        visited[neighbor.row][neighbor.col] = true;
        previous[neighbor.row][neighbor.col] = current;
        queue.push(neighbor);
      }
    }
  }
  
  return null;
}`,
        description: "BFS pathfinding explores all nodes at the current depth before moving to nodes at the next depth, guaranteeing shortest path in unweighted graphs.",
        applications: [
          "Shortest path in unweighted graphs",
          "Level-order traversal",
          "Finding connected components",
          "Social network analysis (degrees of separation)"
        ],
        performanceNotes: "Guarantees shortest path in unweighted graphs. Uses more memory than DFS but finds optimal solution."
      },
      'dfs-path': {
        timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
        spaceComplexity: 'O(V)',
        code: `function dfsPath(grid, start, end) {
  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const previous = Array(rows).fill().map(() => Array(cols).fill(null));
  const stack = [start];
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;
    
    if (current === end) {
      return reconstructPath(previous, end);
    }
    
    for (const neighbor of getNeighbors(current, grid)) {
      if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col] !== 1) {
        previous[neighbor.row][neighbor.col] = current;
        stack.push(neighbor);
      }
    }
  }
  
  return null;
}`,
        description: "DFS pathfinding explores as far as possible along each branch before backtracking. Doesn't guarantee shortest path but uses less memory.",
        applications: [
          "Maze solving",
          "Topological sorting",
          "Finding strongly connected components",
          "Detecting cycles in graphs"
        ],
        performanceNotes: "Uses less memory than BFS but doesn't guarantee shortest path. Good for finding any path quickly."
      }
    };

    return implementations[algorithmId] || null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathfindingAlgorithms;
}

// Make available globally
window.PathfindingAlgorithms = PathfindingAlgorithms; 