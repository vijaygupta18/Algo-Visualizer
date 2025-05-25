/**
 * Data Structures Algorithms Implementation
 * Contains data structure operation implementations with step-by-step visualization
 */

class DataStructureAlgorithms {
    static stackOperations(operations) {
        const steps = [];
        const stack = [];
        
        steps.push({
            type: 'init',
            stack: [...stack],
            operations: [...operations],
            description: 'Initializing empty stack. LIFO (Last In, First Out) principle.',
            code: 'class Stack {\n  constructor() {\n    this.items = [];',
            highlight: [0, 1, 2]
        });

        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            
            if (operation.type === 'push') {
                stack.push(operation.value);
                
                steps.push({
                    type: 'push',
                    stack: [...stack],
                    operation: operation,
                    operationIndex: i,
                    pushedValue: operation.value,
                    description: `Push ${operation.value} onto stack. New top element: ${operation.value}`,
                    code: '  push(element) {\n    this.items.push(element);\n    return this.items.length;',
                    highlight: [3, 4, 5],
                    stats: { size: stack.length }
                });
                
            } else if (operation.type === 'pop') {
                if (stack.length === 0) {
                    steps.push({
                        type: 'pop_empty',
                        stack: [...stack],
                        operation: operation,
                        operationIndex: i,
                        description: 'Cannot pop from empty stack. Stack underflow!',
                        code: '  pop() {\n    if (this.items.length === 0) {\n      throw new Error("Stack underflow");',
                        highlight: [6, 7, 8],
                        stats: { size: stack.length }
                    });
                } else {
                    const poppedValue = stack.pop();
                    
                    steps.push({
                        type: 'pop',
                        stack: [...stack],
                        operation: operation,
                        operationIndex: i,
                        poppedValue: poppedValue,
                        description: `Pop ${poppedValue} from stack. ${stack.length > 0 ? `New top: ${stack[stack.length - 1]}` : 'Stack is now empty'}`,
                        code: '    }\n    return this.items.pop();',
                        highlight: [9, 10],
                        stats: { size: stack.length }
                    });
                }
                
            } else if (operation.type === 'peek') {
                if (stack.length === 0) {
                    steps.push({
                        type: 'peek_empty',
                        stack: [...stack],
                        operation: operation,
                        operationIndex: i,
                        description: 'Cannot peek empty stack.',
                        code: '  peek() {\n    if (this.items.length === 0) {\n      return undefined;',
                        highlight: [11, 12, 13],
                        stats: { size: stack.length }
                    });
                } else {
                    const topValue = stack[stack.length - 1];
                    
                    steps.push({
                        type: 'peek',
                        stack: [...stack],
                        operation: operation,
                        operationIndex: i,
                        topValue: topValue,
                        description: `Peek top element: ${topValue}. Stack unchanged.`,
                        code: '    }\n    return this.items[this.items.length - 1];',
                        highlight: [14, 15],
                        stats: { size: stack.length }
                    });
                }
            }
        }

        steps.push({
            type: 'complete',
            stack: [...stack],
            description: `Stack operations completed. Final stack size: ${stack.length}`,
            code: '}',
            highlight: [16]
        });

        return {
            steps,
            finalStack: [...stack],
            complexity: {
                time: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)' },
                space: 'O(n)'
            },
            code: `class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  pop() {
    if (this.items.length === 0) {
      throw new Error("Stack underflow");
    }
    return this.items.pop();
  }
  
  peek() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}`,
            explanation: "Stack is a LIFO (Last In, First Out) data structure where elements are added and removed from the same end (top).",
            applications: [
                "Function call management",
                "Expression evaluation",
                "Undo operations",
                "Browser history"
            ]
        };
    }

    static queueOperations(operations) {
        const steps = [];
        const queue = [];
        
        steps.push({
            type: 'init',
            queue: [...queue],
            operations: [...operations],
            description: 'Initializing empty queue. FIFO (First In, First Out) principle.',
            code: 'class Queue {\n  constructor() {\n    this.items = [];',
            highlight: [0, 1, 2]
        });

        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            
            if (operation.type === 'enqueue') {
                queue.push(operation.value);
                
                steps.push({
                    type: 'enqueue',
                    queue: [...queue],
                    operation: operation,
                    operationIndex: i,
                    enqueuedValue: operation.value,
                    description: `Enqueue ${operation.value} to rear of queue. Queue size: ${queue.length}`,
                    code: '  enqueue(element) {\n    this.items.push(element);\n    return this.items.length;',
                    highlight: [3, 4, 5],
                    stats: { size: queue.length }
                });
                
            } else if (operation.type === 'dequeue') {
                if (queue.length === 0) {
                    steps.push({
                        type: 'dequeue_empty',
                        queue: [...queue],
                        operation: operation,
                        operationIndex: i,
                        description: 'Cannot dequeue from empty queue. Queue underflow!',
                        code: '  dequeue() {\n    if (this.items.length === 0) {\n      throw new Error("Queue underflow");',
                        highlight: [6, 7, 8],
                        stats: { size: queue.length }
                    });
                } else {
                    const dequeuedValue = queue.shift();
                    
                    steps.push({
                        type: 'dequeue',
                        queue: [...queue],
                        operation: operation,
                        operationIndex: i,
                        dequeuedValue: dequeuedValue,
                        description: `Dequeue ${dequeuedValue} from front of queue. ${queue.length > 0 ? `New front: ${queue[0]}` : 'Queue is now empty'}`,
                        code: '    }\n    return this.items.shift();',
                        highlight: [9, 10],
                        stats: { size: queue.length }
                    });
                }
                
            } else if (operation.type === 'front') {
                if (queue.length === 0) {
                    steps.push({
                        type: 'front_empty',
                        queue: [...queue],
                        operation: operation,
                        operationIndex: i,
                        description: 'Cannot get front of empty queue.',
                        code: '  front() {\n    if (this.items.length === 0) {\n      return undefined;',
                        highlight: [11, 12, 13],
                        stats: { size: queue.length }
                    });
                } else {
                    const frontValue = queue[0];
                    
                    steps.push({
                        type: 'front',
                        queue: [...queue],
                        operation: operation,
                        operationIndex: i,
                        frontValue: frontValue,
                        description: `Front element: ${frontValue}. Queue unchanged.`,
                        code: '    }\n    return this.items[0];',
                        highlight: [14, 15],
                        stats: { size: queue.length }
                    });
                }
            }
        }

        steps.push({
            type: 'complete',
            queue: [...queue],
            description: `Queue operations completed. Final queue size: ${queue.length}`,
            code: '}',
            highlight: [16]
        });

        return {
            steps,
            finalQueue: [...queue],
            complexity: {
                time: { enqueue: 'O(1)', dequeue: 'O(n)', front: 'O(1)' },
                space: 'O(n)'
            },
            code: `class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  dequeue() {
    if (this.items.length === 0) {
      throw new Error("Queue underflow");
    }
    return this.items.shift();
  }
  
  front() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}`,
            explanation: "Queue is a FIFO (First In, First Out) data structure where elements are added at the rear and removed from the front.",
            applications: [
                "Process scheduling",
                "Breadth-first search",
                "Print job management",
                "Handling requests in web servers"
            ]
        };
    }

    static linkedListOperations(operations) {
        const steps = [];
        let head = null;
        let size = 0;
        
        const listToArray = (head) => {
            const result = [];
            let current = head;
            while (current) {
                result.push(current.value);
                current = current.next;
            }
            return result;
        };

        steps.push({
            type: 'init',
            list: listToArray(head),
            operations: [...operations],
            description: 'Initializing empty linked list.',
            code: 'class ListNode {\n  constructor(value) {\n    this.value = value;\n    this.next = null;',
            highlight: [0, 1, 2, 3]
        });

        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            
            if (operation.type === 'insert') {
                const newNode = { value: operation.value, next: null };
                
                if (operation.position === 0 || head === null) {
                    // Insert at beginning
                    newNode.next = head;
                    head = newNode;
                    size++;
                    
                    steps.push({
                        type: 'insert_head',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        insertedValue: operation.value,
                        description: `Insert ${operation.value} at head. New head: ${operation.value}`,
                        code: '  insertAtHead(value) {\n    const newNode = new ListNode(value);\n    newNode.next = this.head;\n    this.head = newNode;',
                        highlight: [4, 5, 6, 7],
                        stats: { size: size }
                    });
                } else {
                    // Insert at specific position
                    let current = head;
                    let position = 0;
                    
                    while (current.next && position < operation.position - 1) {
                        current = current.next;
                        position++;
                    }
                    
                    newNode.next = current.next;
                    current.next = newNode;
                    size++;
                    
                    steps.push({
                        type: 'insert_middle',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        insertedValue: operation.value,
                        position: operation.position,
                        description: `Insert ${operation.value} at position ${operation.position}`,
                        code: '  insertAt(position, value) {\n    const newNode = new ListNode(value);\n    // Traverse to position\n    newNode.next = current.next;\n    current.next = newNode;',
                        highlight: [8, 9, 10, 11, 12],
                        stats: { size: size }
                    });
                }
                
            } else if (operation.type === 'delete') {
                if (head === null) {
                    steps.push({
                        type: 'delete_empty',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        description: 'Cannot delete from empty list.',
                        code: '  delete(value) {\n    if (this.head === null) return false;',
                        highlight: [13, 14],
                        stats: { size: size }
                    });
                } else if (head.value === operation.value) {
                    // Delete head
                    const deletedValue = head.value;
                    head = head.next;
                    size--;
                    
                    steps.push({
                        type: 'delete_head',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        deletedValue: deletedValue,
                        description: `Delete head node with value ${deletedValue}. ${head ? `New head: ${head.value}` : 'List is now empty'}`,
                        code: '    if (this.head.value === value) {\n      this.head = this.head.next;\n      return true;',
                        highlight: [15, 16, 17],
                        stats: { size: size }
                    });
                } else {
                    // Delete from middle/end
                    let current = head;
                    let found = false;
                    
                    while (current.next) {
                        if (current.next.value === operation.value) {
                            const deletedValue = current.next.value;
                            current.next = current.next.next;
                            size--;
                            found = true;
                            
                            steps.push({
                                type: 'delete_middle',
                                list: listToArray(head),
                                operation: operation,
                                operationIndex: i,
                                deletedValue: deletedValue,
                                description: `Delete node with value ${deletedValue}`,
                                code: '    while (current.next) {\n      if (current.next.value === value) {\n        current.next = current.next.next;\n        return true;',
                                highlight: [18, 19, 20, 21],
                                stats: { size: size }
                            });
                            break;
                        }
                        current = current.next;
                    }
                    
                    if (!found) {
                        steps.push({
                            type: 'delete_not_found',
                            list: listToArray(head),
                            operation: operation,
                            operationIndex: i,
                            searchValue: operation.value,
                            description: `Value ${operation.value} not found in list`,
                            code: '    return false; // Value not found',
                            highlight: [22],
                            stats: { size: size }
                        });
                    }
                }
                
            } else if (operation.type === 'search') {
                let current = head;
                let position = 0;
                let found = false;
                
                steps.push({
                    type: 'search_start',
                    list: listToArray(head),
                    operation: operation,
                    operationIndex: i,
                    searchValue: operation.value,
                    description: `Searching for value ${operation.value}`,
                    code: '  search(value) {\n    let current = this.head;\n    let position = 0;',
                    highlight: [23, 24, 25],
                    stats: { size: size }
                });
                
                while (current) {
                    steps.push({
                        type: 'search_compare',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        searchValue: operation.value,
                        currentValue: current.value,
                        currentPosition: position,
                        description: `Comparing ${current.value} at position ${position} with target ${operation.value}`,
                        code: '    while (current) {\n      if (current.value === value) {\n        return position;',
                        highlight: [26, 27, 28],
                        stats: { comparisons: 1 }
                    });
                    
                    if (current.value === operation.value) {
                        found = true;
                        steps.push({
                            type: 'search_found',
                            list: listToArray(head),
                            operation: operation,
                            operationIndex: i,
                            searchValue: operation.value,
                            foundPosition: position,
                            description: `Found ${operation.value} at position ${position}`,
                            code: '        return position;',
                            highlight: [28],
                            stats: { found: true }
                        });
                        break;
                    }
                    
                    current = current.next;
                    position++;
                }
                
                if (!found) {
                    steps.push({
                        type: 'search_not_found',
                        list: listToArray(head),
                        operation: operation,
                        operationIndex: i,
                        searchValue: operation.value,
                        description: `Value ${operation.value} not found in list`,
                        code: '    return -1; // Not found',
                        highlight: [29],
                        stats: { found: false }
                    });
                }
            }
        }

        steps.push({
            type: 'complete',
            list: listToArray(head),
            description: `Linked list operations completed. Final size: ${size}`,
            code: '}',
            highlight: [30]
        });

        return {
            steps,
            finalList: listToArray(head),
            size: size,
            complexity: {
                time: { insert: 'O(n)', delete: 'O(n)', search: 'O(n)' },
                space: 'O(1) per operation'
            },
            code: `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  insertAtHead(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
  
  insertAt(position, value) {
    if (position === 0) {
      this.insertAtHead(value);
      return;
    }
    
    const newNode = new ListNode(value);
    let current = this.head;
    
    for (let i = 0; i < position - 1 && current; i++) {
      current = current.next;
    }
    
    if (current) {
      newNode.next = current.next;
      current.next = newNode;
      this.size++;
    }
  }
  
  delete(value) {
    if (this.head === null) return false;
    
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    
    return false;
  }
  
  search(value) {
    let current = this.head;
    let position = 0;
    
    while (current) {
      if (current.value === value) {
        return position;
      }
      current = current.next;
      position++;
    }
    
    return -1;
  }
}`,
            explanation: "Linked List is a linear data structure where elements are stored in nodes, and each node contains data and a reference to the next node.",
            applications: [
                "Dynamic memory allocation",
                "Implementation of other data structures",
                "Undo functionality",
                "Music playlist management"
            ]
        };
    }

    static hashTableOperations(operations, tableSize = 7) {
        const steps = [];
        const table = new Array(tableSize).fill(null).map(() => []);
        
        const hash = (key) => {
            let hashValue = 0;
            for (let i = 0; i < key.length; i++) {
                hashValue += key.charCodeAt(i);
            }
            return hashValue % tableSize;
        };

        steps.push({
            type: 'init',
            table: table.map(bucket => [...bucket]),
            tableSize: tableSize,
            operations: [...operations],
            description: `Initializing hash table with ${tableSize} buckets. Using simple hash function.`,
            code: 'class HashTable {\n  constructor(size) {\n    this.size = size;\n    this.table = new Array(size).fill(null).map(() => []);',
            highlight: [0, 1, 2, 3]
        });

        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            
            if (operation.type === 'insert') {
                const hashValue = hash(operation.key);
                const bucket = table[hashValue];
                
                steps.push({
                    type: 'hash_key',
                    table: table.map(bucket => [...bucket]),
                    operation: operation,
                    operationIndex: i,
                    key: operation.key,
                    hashValue: hashValue,
                    description: `Hash("${operation.key}") = ${hashValue}. Inserting into bucket ${hashValue}`,
                    code: '  hash(key) {\n    let hashValue = 0;\n    for (let i = 0; i < key.length; i++) {\n      hashValue += key.charCodeAt(i);\n    }\n    return hashValue % this.size;',
                    highlight: [4, 5, 6, 7, 8, 9],
                    stats: { hashValue: hashValue }
                });
                
                // Check if key already exists
                const existingIndex = bucket.findIndex(item => item.key === operation.key);
                
                if (existingIndex !== -1) {
                    // Update existing key
                    bucket[existingIndex].value = operation.value;
                    
                    steps.push({
                        type: 'update',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        value: operation.value,
                        hashValue: hashValue,
                        description: `Key "${operation.key}" already exists. Updating value to ${operation.value}`,
                        code: '  insert(key, value) {\n    const index = this.hash(key);\n    const bucket = this.table[index];\n    // Update existing key',
                        highlight: [10, 11, 12, 13],
                        stats: { collision: bucket.length > 1 }
                    });
                } else {
                    // Insert new key-value pair
                    bucket.push({ key: operation.key, value: operation.value });
                    
                    steps.push({
                        type: 'insert',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        value: operation.value,
                        hashValue: hashValue,
                        collision: bucket.length > 1,
                        description: `Insert ("${operation.key}", ${operation.value}) into bucket ${hashValue}${bucket.length > 1 ? '. Collision detected!' : ''}`,
                        code: '    bucket.push({key, value});',
                        highlight: [14],
                        stats: { collision: bucket.length > 1 }
                    });
                }
                
            } else if (operation.type === 'search') {
                const hashValue = hash(operation.key);
                const bucket = table[hashValue];
                
                steps.push({
                    type: 'search_hash',
                    table: table.map(bucket => [...bucket]),
                    operation: operation,
                    operationIndex: i,
                    key: operation.key,
                    hashValue: hashValue,
                    description: `Hash("${operation.key}") = ${hashValue}. Searching in bucket ${hashValue}`,
                    code: '  search(key) {\n    const index = this.hash(key);\n    const bucket = this.table[index];',
                    highlight: [15, 16, 17],
                    stats: { hashValue: hashValue }
                });
                
                const item = bucket.find(item => item.key === operation.key);
                
                if (item) {
                    steps.push({
                        type: 'search_found',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        value: item.value,
                        hashValue: hashValue,
                        description: `Found "${operation.key}" with value ${item.value}`,
                        code: '    const item = bucket.find(item => item.key === key);\n    return item ? item.value : undefined;',
                        highlight: [18, 19],
                        stats: { found: true, comparisons: bucket.findIndex(item => item.key === operation.key) + 1 }
                    });
                } else {
                    steps.push({
                        type: 'search_not_found',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        hashValue: hashValue,
                        description: `Key "${operation.key}" not found in bucket ${hashValue}`,
                        code: '    return undefined; // Key not found',
                        highlight: [19],
                        stats: { found: false, comparisons: bucket.length }
                    });
                }
                
            } else if (operation.type === 'delete') {
                const hashValue = hash(operation.key);
                const bucket = table[hashValue];
                
                steps.push({
                    type: 'delete_hash',
                    table: table.map(bucket => [...bucket]),
                    operation: operation,
                    operationIndex: i,
                    key: operation.key,
                    hashValue: hashValue,
                    description: `Hash("${operation.key}") = ${hashValue}. Deleting from bucket ${hashValue}`,
                    code: '  delete(key) {\n    const index = this.hash(key);\n    const bucket = this.table[index];',
                    highlight: [20, 21, 22],
                    stats: { hashValue: hashValue }
                });
                
                const itemIndex = bucket.findIndex(item => item.key === operation.key);
                
                if (itemIndex !== -1) {
                    const deletedItem = bucket.splice(itemIndex, 1)[0];
                    
                    steps.push({
                        type: 'delete_found',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        deletedValue: deletedItem.value,
                        hashValue: hashValue,
                        description: `Deleted "${operation.key}" with value ${deletedItem.value}`,
                        code: '    const itemIndex = bucket.findIndex(item => item.key === key);\n    if (itemIndex !== -1) {\n      bucket.splice(itemIndex, 1);\n      return true;',
                        highlight: [23, 24, 25, 26],
                        stats: { deleted: true }
                    });
                } else {
                    steps.push({
                        type: 'delete_not_found',
                        table: table.map(bucket => [...bucket]),
                        operation: operation,
                        operationIndex: i,
                        key: operation.key,
                        hashValue: hashValue,
                        description: `Key "${operation.key}" not found, cannot delete`,
                        code: '    return false; // Key not found',
                        highlight: [27],
                        stats: { deleted: false }
                    });
                }
            }
        }

        // Calculate load factor and collision statistics
        let totalItems = 0;
        let bucketsUsed = 0;
        let maxBucketSize = 0;
        
        for (const bucket of table) {
            totalItems += bucket.length;
            if (bucket.length > 0) bucketsUsed++;
            maxBucketSize = Math.max(maxBucketSize, bucket.length);
        }
        
        const loadFactor = totalItems / tableSize;

        steps.push({
            type: 'complete',
            table: table.map(bucket => [...bucket]),
            totalItems: totalItems,
            bucketsUsed: bucketsUsed,
            loadFactor: loadFactor.toFixed(2),
            maxBucketSize: maxBucketSize,
            description: `Hash table operations completed. Load factor: ${loadFactor.toFixed(2)}, Max bucket size: ${maxBucketSize}`,
            code: '}',
            highlight: [28]
        });

        return {
            steps,
            finalTable: table.map(bucket => [...bucket]),
            stats: {
                totalItems,
                bucketsUsed,
                loadFactor: parseFloat(loadFactor.toFixed(2)),
                maxBucketSize
            },
            complexity: {
                time: { 
                    average: { insert: 'O(1)', search: 'O(1)', delete: 'O(1)' },
                    worst: { insert: 'O(n)', search: 'O(n)', delete: 'O(n)' }
                },
                space: 'O(n)'
            },
            code: `class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }
  
  hash(key) {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i);
    }
    return hashValue % this.size;
  }
  
  insert(key, value) {
    const index = this.hash(key);
    const bucket = this.table[index];
    
    const existingIndex = bucket.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      bucket[existingIndex].value = value;
    } else {
      bucket.push({key, value});
    }
  }
  
  search(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const item = bucket.find(item => item.key === key);
    return item ? item.value : undefined;
  }
  
  delete(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const itemIndex = bucket.findIndex(item => item.key === key);
    
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      return true;
    }
    return false;
  }
}`,
            explanation: "Hash Table uses a hash function to map keys to array indices, providing fast average-case access. Collisions are handled using chaining.",
            applications: [
                "Database indexing",
                "Caching systems",
                "Symbol tables in compilers",
                "Associative arrays/dictionaries"
            ]
        };
    }

    static getAlgorithm(algorithmId) {
        const algorithms = {
            'stack-operations': this.stackOperations,
            'queue-operations': this.queueOperations,
            'linked-list': this.linkedListOperations,
            'hash-table': this.hashTableOperations
        };

        return algorithms[algorithmId] || null;
    }

    static generateSteps(algorithmId) {
        const algorithm = this.getAlgorithm(algorithmId);
        if (!algorithm) return [];
        
        let result;
        switch (algorithmId) {
            case 'stack-operations':
                result = algorithm([
                    { type: 'push', value: 10 },
                    { type: 'push', value: 20 },
                    { type: 'peek' },
                    { type: 'pop' },
                    { type: 'push', value: 30 }
                ]);
                break;
            case 'queue-operations':
                result = algorithm([
                    { type: 'enqueue', value: 10 },
                    { type: 'enqueue', value: 20 },
                    { type: 'dequeue' },
                    { type: 'enqueue', value: 30 }
                ]);
                break;
            case 'linked-list':
                result = algorithm([
                    { type: 'insert', value: 10 },
                    { type: 'insert', value: 20 },
                    { type: 'insert', value: 30 },
                    { type: 'delete', value: 20 }
                ]);
                break;
            case 'hash-table':
                result = algorithm([
                    { type: 'insert', key: 'apple', value: 5 },
                    { type: 'insert', key: 'banana', value: 7 },
                    { type: 'search', key: 'apple' },
                    { type: 'delete', key: 'banana' }
                ]);
                break;
            default:
                return [];
        }
        
        return result.steps || [];
    }

    static getImplementation(algorithmId) {
        const implementations = {
            'stack-operations': {
                timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
                spaceComplexity: 'O(n)',
                code: `class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  pop() {
    if (this.items.length === 0) {
      throw new Error("Stack underflow");
    }
    return this.items.pop();
  }
  
  peek() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}`,
                description: "Stack is a LIFO (Last In, First Out) data structure where elements are added and removed from the same end (top).",
                applications: [
                    "Function call management",
                    "Expression evaluation",
                    "Undo operations",
                    "Browser history"
                ],
                performanceNotes: "All operations are O(1). Memory usage grows linearly with number of elements."
            },
            'queue-operations': {
                timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
                spaceComplexity: 'O(n)',
                code: `class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  dequeue() {
    if (this.items.length === 0) {
      throw new Error("Queue underflow");
    }
    return this.items.shift();
  }
  
  front() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}`,
                description: "Queue is a FIFO (First In, First Out) data structure where elements are added at rear and removed from front.",
                applications: [
                    "Process scheduling",
                    "Breadth-first search",
                    "Print job management",
                    "Handling requests in web servers"
                ],
                performanceNotes: "Enqueue is O(1), dequeue using shift() is O(n). Can be optimized with circular buffer or linked list."
            },
            'linked-list': {
                timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(n)',
                code: `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  insert(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
  
  delete(value) {
    if (!this.head) return false;
    
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      this.size--;
      return true;
    }
    
    return false;
  }
  
  search(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return true;
      current = current.next;
    }
    return false;
  }
}`,
                description: "Linked List is a linear data structure where elements are stored in nodes, each containing data and a reference to the next node.",
                applications: [
                    "Dynamic memory allocation",
                    "Implementation of other data structures",
                    "Undo functionality",
                    "Music playlist management"
                ],
                performanceNotes: "Insertion at head is O(1), search and deletion are O(n). No random access like arrays."
            },
            'hash-table': {
                timeComplexity: { 
                    best: 'O(1)', 
                    average: 'O(1)', 
                    worst: 'O(n)' 
                },
                spaceComplexity: 'O(n)',
                code: `class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }
  
  hash(key) {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i);
    }
    return hashValue % this.size;
  }
  
  insert(key, value) {
    const index = this.hash(key);
    const bucket = this.table[index];
    
    const existingIndex = bucket.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      bucket[existingIndex].value = value;
    } else {
      bucket.push({key, value});
    }
  }
  
  search(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const item = bucket.find(item => item.key === key);
    return item ? item.value : undefined;
  }
  
  delete(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const itemIndex = bucket.findIndex(item => item.key === key);
    
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      return true;
    }
    return false;
  }
}`,
                description: "Hash Table uses a hash function to map keys to array indices, providing fast average-case access with collision handling via chaining.",
                applications: [
                    "Database indexing",
                    "Caching systems",
                    "Symbol tables in compilers",
                    "Associative arrays/dictionaries"
                ],
                performanceNotes: "Average O(1) operations, but can degrade to O(n) with poor hash function or high load factor. Load factor should be kept below 0.75."
            }
        };

        return implementations[algorithmId] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataStructureAlgorithms;
}

// Make available globally
window.DataStructureAlgorithms = DataStructureAlgorithms; 