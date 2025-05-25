/**
 * Tree Algorithms Implementation
 * Contains binary search tree operations and tree traversal algorithms
 */

class TreeAlgorithms {
    static bstInsert(values) {
        const steps = [];
        let root = null;

        class TreeNode {
            constructor(value) {
                this.value = value;
                this.left = null;
                this.right = null;
                this.id = `node-${value}`;
            }
        }

        function insertNode(root, value, path = []) {
            if (!root) {
                const newNode = new TreeNode(value);
                steps.push({
                    type: 'create_node',
                    node: newNode,
                    path: [...path],
                    description: `Creating new node with value ${value}`,
                    code: 'if (!root) {\n  return new TreeNode(value);\n}',
                    highlight: [0, 1, 2]
                });
                return newNode;
            }

            steps.push({
                type: 'visit_node',
                nodeId: root.id,
                value: value,
                currentValue: root.value,
                path: [...path],
                description: `Visiting node ${root.value}, comparing with ${value}`,
                code: 'if (value < root.value) {',
                highlight: [3],
                stats: { comparisons: 1 }
            });

            if (value < root.value) {
                steps.push({
                    type: 'go_left',
                    nodeId: root.id,
                    description: `${value} < ${root.value}, going left`,
                    code: '  root.left = insert(root.left, value);',
                    highlight: [4]
                });
                root.left = insertNode(root.left, value, [...path, 'left']);
            } else if (value > root.value) {
                steps.push({
                    type: 'go_right',
                    nodeId: root.id,
                    description: `${value} > ${root.value}, going right`,
                    code: '} else if (value > root.value) {\n  root.right = insert(root.right, value);',
                    highlight: [5, 6]
                });
                root.right = insertNode(root.right, value, [...path, 'right']);
            } else {
                steps.push({
                    type: 'duplicate',
                    nodeId: root.id,
                    description: `Value ${value} already exists in the tree`,
                    code: '} else {\n  // Value already exists\n}',
                    highlight: [7, 8, 9]
                });
            }

            return root;
        }

        steps.push({
            type: 'init',
            description: 'Starting BST insertion - building binary search tree',
            code: 'function insert(root, value) {',
            highlight: [0]
        });

        values.forEach(value => {
            root = insertNode(root, value);
            steps.push({
                type: 'tree_state',
                tree: this.serializeTree(root),
                description: `Tree after inserting ${value}`,
                code: 'return root;',
                highlight: [10]
            });
        });

        return {
            steps,
            finalTree: this.serializeTree(root),
            complexity: {
                time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
                space: 'O(h)' // h is height of tree
            },
            code: `function insert(root, value) {
  if (!root) {
    return new TreeNode(value);
  }
  
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  // Duplicate values are ignored
  
  return root;
}`,
            explanation: "Binary Search Tree insertion maintains the BST property: left subtree contains values less than the node, right subtree contains values greater than the node.",
            applications: [
                "Database indexing",
                "Expression parsing",
                "File system organization",
                "Priority queues"
            ]
        };
    }

    static bstSearch(tree, target) {
        const steps = [];

        function searchNode(node, target, path = []) {
            if (!node) {
                steps.push({
                    type: 'not_found',
                    path: [...path],
                    description: `Reached null node - value ${target} not found`,
                    code: 'if (!root) {\n  return null;\n}',
                    highlight: [0, 1, 2]
                });
                return null;
            }

            steps.push({
                type: 'visit_node',
                nodeId: node.id,
                target: target,
                currentValue: node.value,
                path: [...path],
                description: `Visiting node ${node.value}, searching for ${target}`,
                code: 'if (target === root.value) {',
                highlight: [3],
                stats: { comparisons: 1 }
            });

            if (target === node.value) {
                steps.push({
                    type: 'found',
                    nodeId: node.id,
                    description: `Found target value ${target}!`,
                    code: '  return root;',
                    highlight: [4]
                });
                return node;
            } else if (target < node.value) {
                steps.push({
                    type: 'go_left',
                    nodeId: node.id,
                    description: `${target} < ${node.value}, searching left subtree`,
                    code: '} else if (target < root.value) {\n  return search(root.left, target);',
                    highlight: [5, 6]
                });
                return searchNode(node.left, target, [...path, 'left']);
            } else {
                steps.push({
                    type: 'go_right',
                    nodeId: node.id,
                    description: `${target} > ${node.value}, searching right subtree`,
                    code: '} else {\n  return search(root.right, target);',
                    highlight: [7, 8]
                });
                return searchNode(node.right, target, [...path, 'right']);
            }
        }

        steps.push({
            type: 'init',
            tree: tree,
            target: target,
            description: `Starting BST search for value ${target}`,
            code: 'function search(root, target) {',
            highlight: [0]
        });

        const result = searchNode(tree, target);

        steps.push({
            type: 'complete',
            found: result !== null,
            description: result ? `Search completed - found ${target}` : `Search completed - ${target} not found`,
            code: '}',
            highlight: [9]
        });

        return {
            steps,
            found: result !== null,
            complexity: {
                time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
                space: 'O(h)'
            },
            code: `function search(root, target) {
  if (!root) {
    return null;
  }
  
  if (target === root.value) {
    return root;
  } else if (target < root.value) {
    return search(root.left, target);
  } else {
    return search(root.right, target);
  }
}`,
            explanation: "BST search compares the target with current node and recursively searches left or right subtree based on the comparison.",
            applications: [
                "Database queries",
                "Symbol tables in compilers",
                "Auto-complete features",
                "Range queries"
            ]
        };
    }

    static inorderTraversal(tree) {
        const steps = [];
        const result = [];

        function inorder(node, depth = 0) {
            if (!node) return;

            steps.push({
                type: 'visit_left',
                nodeId: node.id,
                description: `Visiting node ${node.value}, going to left subtree first`,
                code: 'function inorder(root) {\n  if (root) {\n    inorder(root.left);',
                highlight: [0, 1, 2],
                depth
            });

            inorder(node.left, depth + 1);

            steps.push({
                type: 'process_node',
                nodeId: node.id,
                value: node.value,
                description: `Processing node ${node.value} (adding to result)`,
                code: '    result.push(root.value);',
                highlight: [3],
                depth
            });
            result.push(node.value);

            steps.push({
                type: 'visit_right',
                nodeId: node.id,
                description: `Going to right subtree of node ${node.value}`,
                code: '    inorder(root.right);',
                highlight: [4],
                depth
            });

            inorder(node.right, depth + 1);
        }

        steps.push({
            type: 'init',
            tree: tree,
            description: 'Starting inorder traversal: Left → Root → Right',
            code: 'const result = [];',
            highlight: [0]
        });

        inorder(tree);

        steps.push({
            type: 'complete',
            result: [...result],
            description: `Inorder traversal completed. Result: [${result.join(', ')}]`,
            code: '  }\n}',
            highlight: [5, 6]
        });

        return {
            steps,
            result,
            complexity: {
                time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(h)'
            },
            code: `function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (node) {
      inorder(node.left);
      result.push(node.value);
      inorder(node.right);
    }
  }
  
  inorder(root);
  return result;
}`,
            explanation: "Inorder traversal visits nodes in Left-Root-Right order. For BST, this gives sorted sequence.",
            applications: [
                "Getting sorted data from BST",
                "Expression evaluation",
                "Syntax tree processing",
                "Tree serialization"
            ]
        };
    }

    static preorderTraversal(tree) {
        const steps = [];
        const result = [];

        function preorder(node, depth = 0) {
            if (!node) return;

            steps.push({
                type: 'process_node',
                nodeId: node.id,
                value: node.value,
                description: `Processing node ${node.value} first (Root)`,
                code: 'function preorder(root) {\n  if (root) {\n    result.push(root.value);',
                highlight: [0, 1, 2],
                depth
            });
            result.push(node.value);

            steps.push({
                type: 'visit_left',
                nodeId: node.id,
                description: `Going to left subtree of node ${node.value}`,
                code: '    preorder(root.left);',
                highlight: [3],
                depth
            });

            preorder(node.left, depth + 1);

            steps.push({
                type: 'visit_right',
                nodeId: node.id,
                description: `Going to right subtree of node ${node.value}`,
                code: '    preorder(root.right);',
                highlight: [4],
                depth
            });

            preorder(node.right, depth + 1);
        }

        steps.push({
            type: 'init',
            tree: tree,
            description: 'Starting preorder traversal: Root → Left → Right',
            code: 'const result = [];',
            highlight: [0]
        });

        preorder(tree);

        steps.push({
            type: 'complete',
            result: [...result],
            description: `Preorder traversal completed. Result: [${result.join(', ')}]`,
            code: '  }\n}',
            highlight: [5, 6]
        });

        return {
            steps,
            result,
            complexity: {
                time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(h)'
            },
            code: `function preorderTraversal(root) {
  const result = [];
  
  function preorder(node) {
    if (node) {
      result.push(node.value);
      preorder(node.left);
      preorder(node.right);
    }
  }
  
  preorder(root);
  return result;
}`,
            explanation: "Preorder traversal visits nodes in Root-Left-Right order. Useful for creating copy of tree.",
            applications: [
                "Tree copying/cloning",
                "Prefix expression evaluation",
                "Tree serialization",
                "Directory listing"
            ]
        };
    }

    static postorderTraversal(tree) {
        const steps = [];
        const result = [];

        function postorder(node, depth = 0) {
            if (!node) return;

            steps.push({
                type: 'visit_left',
                nodeId: node.id,
                description: `Visiting node ${node.value}, going to left subtree first`,
                code: 'function postorder(root) {\n  if (root) {\n    postorder(root.left);',
                highlight: [0, 1, 2],
                depth
            });

            postorder(node.left, depth + 1);

            steps.push({
                type: 'visit_right',
                nodeId: node.id,
                description: `Going to right subtree of node ${node.value}`,
                code: '    postorder(root.right);',
                highlight: [3],
                depth
            });

            postorder(node.right, depth + 1);

            steps.push({
                type: 'process_node',
                nodeId: node.id,
                value: node.value,
                description: `Processing node ${node.value} after both subtrees`,
                code: '    result.push(root.value);',
                highlight: [4],
                depth
            });
            result.push(node.value);
        }

        steps.push({
            type: 'init',
            tree: tree,
            description: 'Starting postorder traversal: Left → Right → Root',
            code: 'const result = [];',
            highlight: [0]
        });

        postorder(tree);

        steps.push({
            type: 'complete',
            result: [...result],
            description: `Postorder traversal completed. Result: [${result.join(', ')}]`,
            code: '  }\n}',
            highlight: [5, 6]
        });

        return {
            steps,
            result,
            complexity: {
                time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(h)'
            },
            code: `function postorderTraversal(root) {
  const result = [];
  
  function postorder(node) {
    if (node) {
      postorder(node.left);
      postorder(node.right);
      result.push(node.value);
    }
  }
  
  postorder(root);
  return result;
}`,
            explanation: "Postorder traversal visits nodes in Left-Right-Root order. Useful for deleting tree safely.",
            applications: [
                "Tree deletion",
                "Postfix expression evaluation",
                "Calculating directory sizes",
                "Memory cleanup"
            ]
        };
    }

    static levelOrderTraversal(tree) {
        const steps = [];
        const result = [];

        if (!tree) {
            steps.push({
                type: 'empty_tree',
                description: 'Tree is empty',
                code: 'if (!root) return [];',
                highlight: [0]
            });
            return { steps, result, complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)' } };
        }

        const queue = [tree];
        let level = 0;

        steps.push({
            type: 'init',
            tree: tree,
            description: 'Starting level order traversal using queue (BFS)',
            code: 'const queue = [root];\nconst result = [];',
            highlight: [0, 1]
        });

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];

            steps.push({
                type: 'start_level',
                level: level,
                queueSize: levelSize,
                description: `Processing level ${level} with ${levelSize} nodes`,
                code: 'while (queue.length > 0) {\n  const node = queue.shift();',
                highlight: [2, 3]
            });

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                steps.push({
                    type: 'process_node',
                    nodeId: node.id,
                    value: node.value,
                    level: level,
                    description: `Processing node ${node.value} at level ${level}`,
                    code: '  result.push(node.value);',
                    highlight: [4]
                });

                result.push(node.value);
                currentLevel.push(node.value);

                if (node.left) {
                    queue.push(node.left);
                    steps.push({
                        type: 'enqueue_left',
                        nodeId: node.id,
                        childId: node.left.id,
                        description: `Adding left child ${node.left.value} to queue`,
                        code: '  if (node.left) queue.push(node.left);',
                        highlight: [5]
                    });
                }

                if (node.right) {
                    queue.push(node.right);
                    steps.push({
                        type: 'enqueue_right',
                        nodeId: node.id,
                        childId: node.right.id,
                        description: `Adding right child ${node.right.value} to queue`,
                        code: '  if (node.right) queue.push(node.right);',
                        highlight: [6]
                    });
                }
            }

            steps.push({
                type: 'level_complete',
                level: level,
                levelNodes: currentLevel,
                description: `Level ${level} completed: [${currentLevel.join(', ')}]`,
                code: '}',
                highlight: [7]
            });

            level++;
        }

        steps.push({
            type: 'complete',
            result: [...result],
            description: `Level order traversal completed. Result: [${result.join(', ')}]`,
            code: 'return result;',
            highlight: [8]
        });

        return {
            steps,
            result,
            complexity: {
                time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(w)' // w is maximum width of tree
            },
            code: `function levelOrderTraversal(root) {
  if (!root) return [];
  
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}`,
            explanation: "Level order traversal visits nodes level by level from left to right using a queue (BFS approach).",
            applications: [
                "Tree printing by levels",
                "Finding tree width",
                "Serialization for complete trees",
                "Finding nodes at specific level"
            ]
        };
    }

    static serializeTree(root) {
        if (!root) return null;

        return {
            value: root.value,
            id: root.id,
            left: this.serializeTree(root.left),
            right: this.serializeTree(root.right)
        };
    }

    static createSampleTree() {
        // Create a sample BST for demonstration
        const values = [50, 30, 70, 20, 40, 60, 80];
        let root = null;

        class TreeNode {
            constructor(value) {
                this.value = value;
                this.left = null;
                this.right = null;
                this.id = `node-${value}`;
            }
        }

        function insert(root, value) {
            if (!root) return new TreeNode(value);

            if (value < root.value) {
                root.left = insert(root.left, value);
            } else if (value > root.value) {
                root.right = insert(root.right, value);
            }

            return root;
        }

        values.forEach(value => {
            root = insert(root, value);
        });

        return this.serializeTree(root);
    }

    static getImplementation(algorithmId) {
        const implementations = {
            'bst-insert': {
                timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
                spaceComplexity: 'O(h)',
                code: `function insert(root, value) {
  if (!root) {
    return new TreeNode(value);
  }
  
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  
  return root;
}`,
                description: "Binary Search Tree insertion maintains the BST property by comparing values and recursively inserting in the appropriate subtree.",
                applications: [
                    "Database indexing",
                    "Expression parsing",
                    "File system organization",
                    "Priority queues"
                ],
                performanceNotes: "Best case O(log n) for balanced trees, worst case O(n) for skewed trees. Self-balancing trees like AVL maintain O(log n)."
            },
            'bst-search': {
                timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
                spaceComplexity: 'O(h)',
                code: `function search(root, target) {
  if (!root) return null;
  
  if (target === root.value) {
    return root;
  } else if (target < root.value) {
    return search(root.left, target);
  } else {
    return search(root.right, target);
  }
}`,
                description: "BST search efficiently finds elements by comparing with current node and recursively searching the appropriate subtree.",
                applications: [
                    "Database queries",
                    "Symbol tables in compilers",
                    "Auto-complete features",
                    "Range queries"
                ],
                performanceNotes: "Performance depends on tree balance. Balanced trees guarantee O(log n), while skewed trees degrade to O(n)."
            },
            'tree-traversal-inorder': {
                timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(h)',
                code: `function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (node) {
      inorder(node.left);
      result.push(node.value);
      inorder(node.right);
    }
  }
  
  inorder(root);
  return result;
}`,
                description: "Inorder traversal visits nodes in Left-Root-Right order, producing sorted sequence for BST.",
                applications: [
                    "Getting sorted data from BST",
                    "Expression evaluation",
                    "Syntax tree processing",
                    "Tree serialization"
                ],
                performanceNotes: "Always O(n) time as every node is visited once. Space complexity is O(h) due to recursion stack."
            },
            'tree-traversal-preorder': {
                timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(h)',
                code: `function preorderTraversal(root) {
  const result = [];
  
  function preorder(node) {
    if (node) {
      result.push(node.value);
      preorder(node.left);
      preorder(node.right);
    }
  }
  
  preorder(root);
  return result;
}`,
                description: "Preorder traversal visits nodes in Root-Left-Right order, useful for tree copying and prefix expressions.",
                applications: [
                    "Tree copying/cloning",
                    "Prefix expression evaluation",
                    "Tree serialization",
                    "Directory listing"
                ],
                performanceNotes: "Linear time complexity as each node is visited exactly once. Recursion depth equals tree height."
            },
            'tree-traversal-postorder': {
                timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(h)',
                code: `function postorderTraversal(root) {
  const result = [];
  
  function postorder(node) {
    if (node) {
      postorder(node.left);
      postorder(node.right);
      result.push(node.value);
    }
  }
  
  postorder(root);
  return result;
}`,
                description: "Postorder traversal visits nodes in Left-Right-Root order, ideal for safe tree deletion and postfix expressions.",
                applications: [
                    "Tree deletion",
                    "Postfix expression evaluation",
                    "Calculating directory sizes",
                    "Memory cleanup"
                ],
                performanceNotes: "Ensures children are processed before parent, making it safe for deletion operations."
            },
            'tree-traversal-bfs': {
                timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(w)',
                code: `function levelOrderTraversal(root) {
  if (!root) return [];
  
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}`,
                description: "Level order traversal visits nodes level by level using BFS approach with a queue.",
                applications: [
                    "Tree printing by levels",
                    "Finding tree width",
                    "Serialization for complete trees",
                    "Finding nodes at specific level"
                ],
                performanceNotes: "Space complexity is O(w) where w is maximum width of tree, which can be O(n) for complete trees."
            }
        };

        return implementations[algorithmId] || null;
    }

    static generateSteps(algorithmId, data = null) {
        const sampleTree = this.createSampleTree();

        switch (algorithmId) {
            case 'bst-insert':
                return this.bstInsert(data || [50, 30, 70, 20, 40, 60, 80]).steps;
            case 'bst-search':
                return this.bstSearch(sampleTree, data || 40).steps;
            case 'tree-traversal-inorder':
                return this.inorderTraversal(sampleTree).steps;
            case 'tree-traversal-preorder':
                return this.preorderTraversal(sampleTree).steps;
            case 'tree-traversal-postorder':
                return this.postorderTraversal(sampleTree).steps;
            case 'tree-traversal-bfs':
                return this.levelOrderTraversal(sampleTree).steps;
            default:
                return [];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeAlgorithms;
}

// Make available globally
window.TreeAlgorithms = TreeAlgorithms; 