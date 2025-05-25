/**
 * DSA Visualizer - Main Application Controller
 * Manages the overall application state and coordinates between modules
 */

class DSAVisualizerApp {
    constructor() {
        this.currentCategory = 'sorting';
        this.currentAlgorithm = null;
        this.visualizer = null;
        this.animationController = null;
        this.codeEditor = null;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.animationSpeed = 5;
        this.data = [];
        this.stats = {
            comparisons: 0,
            swaps: 0,
            accesses: 0
        };

        // Algorithm definitions
        this.algorithms = {
            sorting: [
                { id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting' },
                { id: 'selection-sort', name: 'Selection Sort', category: 'sorting' },
                { id: 'insertion-sort', name: 'Insertion Sort', category: 'sorting' },
                { id: 'merge-sort', name: 'Merge Sort', category: 'sorting' },
                { id: 'quick-sort', name: 'Quick Sort', category: 'sorting' },
                { id: 'heap-sort', name: 'Heap Sort', category: 'sorting' }
            ],
            searching: [
                { id: 'linear-search', name: 'Linear Search', category: 'searching' },
                { id: 'binary-search', name: 'Binary Search', category: 'searching' },
                { id: 'jump-search', name: 'Jump Search', category: 'searching' },
                { id: 'interpolation-search', name: 'Interpolation Search', category: 'searching' }
            ],
            pathfinding: [
                { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'pathfinding' },
                { id: 'a-star', name: 'A* Search', category: 'pathfinding' },
                { id: 'bfs-path', name: 'BFS Pathfinding', category: 'pathfinding' },
                { id: 'dfs-path', name: 'DFS Pathfinding', category: 'pathfinding' }
            ],
            trees: [
                { id: 'bst-insert', name: 'BST Insertion', category: 'trees' },
                { id: 'bst-search', name: 'BST Search', category: 'trees' },
                { id: 'tree-traversal-inorder', name: 'Inorder Traversal', category: 'trees' },
                { id: 'tree-traversal-preorder', name: 'Preorder Traversal', category: 'trees' },
                { id: 'tree-traversal-postorder', name: 'Postorder Traversal', category: 'trees' },
                { id: 'tree-traversal-bfs', name: 'Level Order (BFS)', category: 'trees' }
            ],
            graphs: [
                { id: 'graph-bfs', name: 'Breadth-First Search', category: 'graphs' },
                { id: 'graph-dfs', name: 'Depth-First Search', category: 'graphs' },
                { id: 'topological-sort', name: 'Topological Sort', category: 'graphs' },
                { id: 'strongly-connected', name: 'Strongly Connected Components', category: 'graphs' }
            ],
            dynamic: [
                { id: 'fibonacci-dp', name: 'Fibonacci (DP)', category: 'dynamic' },
                { id: 'knapsack', name: '0/1 Knapsack', category: 'dynamic' },
                { id: 'lcs', name: 'Longest Common Subsequence', category: 'dynamic' },
                { id: 'edit-distance', name: 'Edit Distance', category: 'dynamic' },
                { id: 'coin-change', name: 'Coin Change', category: 'dynamic' }
            ],
            'data-structures': [
                { id: 'stack-operations', name: 'Stack Operations', category: 'data-structures' },
                { id: 'queue-operations', name: 'Queue Operations', category: 'data-structures' },
                { id: 'linked-list', name: 'Linked List Operations', category: 'data-structures' },
                { id: 'hash-table', name: 'Hash Table Operations', category: 'data-structures' }
            ]
        };

        this.init();
    }

    init() {
        // Initialize components first
        this.initializeCodeEditor();
        this.populateAlgorithmSelect();
        this.initializeOperationBox();
        
        // Set up event listeners after components are initialized
        this.setupEventListeners();
        
        // Set initial state
        this.setCategory('sorting');
        this.generateRandomData();
        
        // Update UI last
        this.updateUI();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setCategory(category);
            });
        });

        // Algorithm selection
        document.getElementById('algorithm-select').addEventListener('change', (e) => {
            this.setAlgorithm(e.target.value);
        });

        // Control buttons - use a single handler for all animation controls
        const setupAnimationControl = (id, handler) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        };

        setupAnimationControl('play-pause-btn', () => this.togglePlayPause());
        setupAnimationControl('reset-btn', () => this.reset());
        setupAnimationControl('step-forward-btn', () => this.stepForward());
        setupAnimationControl('step-back-btn', () => this.stepBack());
        setupAnimationControl('fast-forward-btn', () => this.fastForward());

        // Input controls
        document.getElementById('array-input').addEventListener('input', (e) => {
            this.parseCustomInput(e.target.value);
        });

        document.getElementById('random-btn').addEventListener('click', () => {
            this.generateRandomData();
        });

        document.getElementById('array-size').addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            document.getElementById('size-display').textContent = size;
            this.generateRandomData(size);
        });

        // Speed control
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speed-display').textContent = `${this.animationSpeed}x`;
            if (this.animationController) {
                this.animationController.setSpeed(this.animationSpeed);
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.currentTarget.dataset.tab);
            });
        });

        // Copy code button
        document.getElementById('copy-code-btn').addEventListener('click', () => {
            this.copyCode();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Help modal
        document.getElementById('help-btn').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Search target change
        document.getElementById('search-target').addEventListener('input', () => {
            if (this.currentCategory === 'searching') {
                this.reset();
            }
        });

        // Tree input controls
        document.getElementById('generate-tree-btn').addEventListener('click', () => {
            this.generateTreeData();
        });

        // Graph input controls
        document.getElementById('generate-graph-btn').addEventListener('click', () => {
            this.generateGraphData();
        });

        // DP problem change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'dp-problem') {
                this.reset();
            }
        });
    }

    initializeCodeEditor() {
        const textarea = document.getElementById('code-editor');
        this.codeEditor = CodeMirror.fromTextArea(textarea, {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            readOnly: true,
            lineWrapping: true,
            styleActiveLine: true
        });
    }

    populateAlgorithmSelect() {
        const select = document.getElementById('algorithm-select');
        select.innerHTML = '';

        const categoryAlgorithms = this.algorithms[this.currentCategory] || [];
        categoryAlgorithms.forEach(algorithm => {
            const option = document.createElement('option');
            option.value = algorithm.id;
            option.textContent = algorithm.name;
            select.appendChild(option);
        });

        if (categoryAlgorithms.length > 0) {
            this.setAlgorithm(categoryAlgorithms[0].id);
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this.currentAlgorithm = null;

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Show/hide statistics panel based on category
        const statsPanel = document.querySelector('.stats-panel');
        if (statsPanel) {
            if (category === 'sorting') {
                statsPanel.style.display = 'flex';
            } else {
                statsPanel.style.display = 'none';
            }
        }

        // Show/hide input controls based on category
        this.updateInputControls(category);

        this.populateAlgorithmSelect();
        this.initializeVisualizer();
        this.reset();
    }

    updateInputControls(category) {
        // Hide all input groups first
        const inputGroups = [
            'search-target-group',
            'tree-input-group', 
            'graph-input-group',
            'dp-input-group',
            'ds-input-group'
        ];
        
        inputGroups.forEach(groupId => {
            const group = document.getElementById(groupId);
            if (group) group.style.display = 'none';
        });

        // Show relevant input controls based on category
        switch (category) {
            case 'searching':
                document.getElementById('search-target-group').style.display = 'block';
                break;
            case 'trees':
                document.getElementById('tree-input-group').style.display = 'block';
                break;
            case 'graphs':
                document.getElementById('graph-input-group').style.display = 'block';
                break;
            case 'dynamic':
                document.getElementById('dp-input-group').style.display = 'block';
                this.setupDPControls();
                break;
            case 'data-structures':
                document.getElementById('ds-input-group').style.display = 'block';
                this.setupDSControls();
                break;
            case 'pathfinding':
                // Pathfinding uses the grid visualizer with built-in controls
                break;
            case 'sorting':
            default:
                // Sorting uses the default array input
                break;
        }
    }

    setupDPControls() {
        const dpProblem = document.getElementById('dp-problem');
        const dpParams = document.getElementById('dp-params');
        
        const updateDPParams = () => {
            const problem = dpProblem.value;
            let paramsHTML = '';
            
            switch (problem) {
                case 'knapsack':
                    paramsHTML = `
                        <label>Items (weight,value):</label>
                        <input type="text" id="knapsack-items" placeholder="(2,3),(3,4),(4,5),(5,6)" value="(2,3),(3,4),(4,5),(5,6)">
                        <label>Capacity:</label>
                        <input type="number" id="knapsack-capacity" value="8" min="1" max="20">
                    `;
                    break;
                case 'lcs':
                    paramsHTML = `
                        <label>String 1:</label>
                        <input type="text" id="lcs-string1" placeholder="ABCDGH" value="ABCDGH">
                        <label>String 2:</label>
                        <input type="text" id="lcs-string2" placeholder="AEDFHR" value="AEDFHR">
                    `;
                    break;
                case 'edit-distance':
                    paramsHTML = `
                        <label>String 1:</label>
                        <input type="text" id="edit-string1" placeholder="kitten" value="kitten">
                        <label>String 2:</label>
                        <input type="text" id="edit-string2" placeholder="sitting" value="sitting">
                    `;
                    break;
                case 'coin-change':
                    paramsHTML = `
                        <label>Coins:</label>
                        <input type="text" id="coin-denominations" placeholder="1,5,10,25" value="1,5,10,25">
                        <label>Amount:</label>
                        <input type="number" id="coin-amount" value="30" min="1" max="100">
                    `;
                    break;
            }
            
            dpParams.innerHTML = paramsHTML;
        };
        
        dpProblem.addEventListener('change', updateDPParams);
        updateDPParams(); // Initialize
    }

    setupDSControls() {
        const dsOperation = document.getElementById('ds-operation');
        const dsValue = document.getElementById('ds-value');
        const executeBtn = document.getElementById('execute-operation-btn');
        
        executeBtn.addEventListener('click', () => {
            const operation = dsOperation.value;
            const value = dsValue.value;
            
            if (this.visualizer && this.visualizer[operation]) {
                if (operation === 'push' || operation === 'enqueue' || operation === 'insert') {
                    if (value) {
                        this.visualizer[operation](value);
                        dsValue.value = '';
                    }
                } else {
                    this.visualizer[operation]();
                }
            }
        });
    }

    setAlgorithm(algorithmId) {
        this.currentAlgorithm = algorithmId;
        document.getElementById('algorithm-select').value = algorithmId;

        // Initialize the appropriate visualizer
        this.initializeVisualizer();
        this.updateAlgorithmInfo();
        this.reset();
    }

    initializeOperationBox() {
        // Create container for operation box if it doesn't exist
        let container = document.getElementById('operation-box-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'operation-box-container';
            document.querySelector('.visualization-container').appendChild(container);
        }
        
        this.operationBox = new OperationBox('operation-box-container');
    }

    initializeVisualizer() {
        const canvas = document.getElementById('visualization-canvas');
        const svg = document.getElementById('visualization-svg');

        // Clear previous visualizations
        canvas.style.display = 'none';
        svg.style.display = 'none';
        svg.innerHTML = '';

        // Initialize appropriate visualizer based on category
        switch (this.currentCategory) {
            case 'sorting':
            case 'searching':
                canvas.style.display = 'block';
                this.visualizer = new ArrayVisualizer(canvas, this.data);
                break;
            case 'pathfinding':
                canvas.style.display = 'block';
                this.visualizer = new GridVisualizer(canvas);
                break;
            case 'trees':
                svg.style.display = 'block';
                this.visualizer = new TreeVisualizer(svg);
                // Initialize with sample tree data if no tree data exists
                if (!this.treeData) {
                    this.generateTreeData();
                } else {
                    this.visualizer.setTree(this.treeData);
                }
                break;
            case 'graphs':
                svg.style.display = 'block';
                this.visualizer = new GraphVisualizer(svg);
                // Initialize with sample graph data if no graph data exists
                if (!this.graphData) {
                    this.generateGraphData();
                } else {
                    this.visualizer.setGraph(this.graphData);
                }
                break;
            case 'dynamic':
                canvas.style.display = 'block';
                this.visualizer = new DPGridVisualizer(canvas);
                // The DPGridVisualizer now initializes with sample data automatically
                break;
            case 'data-structures':
                svg.style.display = 'block';
                this.visualizer = new DataStructureVisualizer(svg);
                
                // Set the data structure type based on the current algorithm
                if (this.currentAlgorithm) {
                    if (this.currentAlgorithm.includes('stack')) {
                        this.visualizer.setData([10, 20, 30], 'stack');
                    } else if (this.currentAlgorithm.includes('queue')) {
                        this.visualizer.setData([10, 20, 30], 'queue');
                    } else if (this.currentAlgorithm.includes('linked-list')) {
                        this.visualizer.setData([10, 20, 30], 'linked-list');
                    } else if (this.currentAlgorithm.includes('hash-table')) {
                        this.visualizer.setData([
                            {key: 'apple', value: 5},
                            {key: 'banana', value: 7},
                            {key: 'cherry', value: 3}
                        ], 'hash-table');
                    } else {
                        // Default to stack
                        this.visualizer.setData([10, 20, 30], 'stack');
                    }
                } else {
                    // Default initialization
                    this.visualizer.setData([10, 20, 30], 'stack');
                }
                break;
        }

        // Initialize animation controller with proper callbacks
        this.animationController = new AnimationController(this.visualizer, this.animationSpeed);
        
        // Set up callbacks
        this.animationController.onStepChange = (step, total) => {
            console.log('Step changed:', step, 'of', total);
            this.currentStep = step;
            this.totalSteps = total;
            this.updateStepInfo();
            this.operationBox.updateStep(step, total);
        };

        this.animationController.onStatsUpdate = (stats) => {
            console.log('Stats updated:', stats);
            if (stats.comparisons) this.stats.comparisons += stats.comparisons;
            if (stats.swaps) this.stats.swaps += stats.swaps;
            if (stats.accesses) this.stats.accesses += stats.accesses;
            this.updateStats();
            this.operationBox.updateStats(this.stats);
        };

        this.animationController.onExplanationUpdate = (explanation) => {
            console.log('Explanation updated:', explanation);
            document.getElementById('current-step-explanation').textContent = explanation;
            
            // Update operation box with explanation
            const currentStep = this.animationController.steps[this.currentStep];
            if (currentStep) {
                this.operationBox.updateOperation(
                    currentStep.description,
                    this.getStepExplanation(currentStep)
                );
            }
        };

        this.animationController.onComplete = () => {
            console.log('Animation completed');
            this.updatePlayButton();
            document.getElementById('current-step-explanation').textContent = 'Algorithm completed! Click reset to run again.';
            this.operationBox.updateOperation(
                'Algorithm completed! 🎉',
                'All numbers are now in the correct order. Click reset to try again!'
            );
        };

        // Reset animation state
        this.reset();
    }

    updateAlgorithmInfo() {
        const algorithm = this.findAlgorithmById(this.currentAlgorithm);
        if (!algorithm) return;

        // Update title
        document.getElementById('algorithm-title').textContent = algorithm.name;

        // Get algorithm implementation
        const implementation = this.getAlgorithmImplementation(this.currentAlgorithm);
        if (implementation) {
            // Update complexity info
            document.getElementById('time-complexity').textContent = implementation.timeComplexity.average;
            document.getElementById('space-complexity').textContent = implementation.spaceComplexity;

            // Update code
            this.codeEditor.setValue(implementation.code);

            // Update explanation
            this.updateExplanationTab(implementation);
            this.updateComplexityTab(implementation);
        }
    }

    updateExplanationTab(implementation) {
        document.getElementById('algorithm-overview').innerHTML = `<p>${implementation.description}</p>`;

        const applicationsList = document.getElementById('applications-list');
        applicationsList.innerHTML = '';
        implementation.applications.forEach(app => {
            const li = document.createElement('li');
            li.textContent = app;
            applicationsList.appendChild(li);
        });
    }

    updateComplexityTab(implementation) {
        document.getElementById('best-case').textContent = implementation.timeComplexity.best;
        document.getElementById('average-case').textContent = implementation.timeComplexity.average;
        document.getElementById('worst-case').textContent = implementation.timeComplexity.worst;
        document.getElementById('space-case').textContent = implementation.spaceComplexity;

        document.getElementById('performance-notes').innerHTML = `<p>${implementation.performanceNotes}</p>`;
    }

    getAlgorithmImplementation(algorithmId) {
        // This will be implemented by specific algorithm modules
        switch (this.currentCategory) {
            case 'sorting':
                return SortingAlgorithms.getImplementation(algorithmId);
            case 'searching':
                return SearchingAlgorithms.getImplementation(algorithmId);
            case 'pathfinding':
                return PathfindingAlgorithms.getImplementation(algorithmId);
            case 'trees':
                return TreeAlgorithms.getImplementation(algorithmId);
            case 'graphs':
                return GraphAlgorithms.getImplementation(algorithmId);
            case 'dynamic':
                return DynamicProgrammingAlgorithms.getImplementation(algorithmId);
            case 'data-structures':
                return DataStructureAlgorithms.getImplementation(algorithmId);
            default:
                return null;
        }
    }

    findAlgorithmById(id) {
        for (const category in this.algorithms) {
            const algorithm = this.algorithms[category].find(alg => alg.id === id);
            if (algorithm) return algorithm;
        }
        return null;
    }

    generateRandomData(size = null) {
        const arraySize = size || parseInt(document.getElementById('array-size').value);
        this.data = [];

        for (let i = 0; i < arraySize; i++) {
            this.data.push(Math.floor(Math.random() * 300) + 10);
        }

        document.getElementById('array-input').value = this.data.join(', ');

        if (this.visualizer && this.visualizer.setData) {
            this.visualizer.setData(this.data);
        }

        this.reset();
    }

    parseCustomInput(input) {
        try {
            const numbers = input.split(',').map(s => {
                const num = parseInt(s.trim());
                return isNaN(num) ? 0 : Math.max(1, Math.min(300, num));
            }).filter(n => n > 0);

            if (numbers.length > 0) {
                this.data = numbers;
                if (this.visualizer && this.visualizer.setData) {
                    this.visualizer.setData(this.data);
                }
                this.reset();
            }
        } catch (error) {
            console.warn('Invalid input format');
        }
    }

    togglePlayPause() {
        if (!this.animationController) {
            console.warn('Animation controller not initialized');
            return;
        }

        console.log('Toggling play/pause, current state:', {
            isPlaying: this.animationController.isPlaying,
            isPaused: this.animationController.isPaused,
            currentStep: this.animationController.currentStep
        });

        // Prevent multiple rapid toggles
        if (this.isToggling) {
            console.log('Toggle already in progress, skipping');
            return;
        }

        this.isToggling = true;
        setTimeout(() => {
            this.isToggling = false;
        }, 100);

        if (this.animationController.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.animationController) {
            console.warn('Animation controller not initialized');
            return;
        }

        console.log('Play called, current state:', {
            isPlaying: this.animationController.isPlaying,
            isPaused: this.animationController.isPaused,
            currentStep: this.animationController.currentStep
        });

        // Prevent multiple play calls
        if (this.animationController.isPlaying) {
            console.log('Animation already playing');
            return;
        }

        if (this.animationController.currentStep >= this.animationController.steps.length) {
            // If we're at the end, start over
            this.startAlgorithm();
            return;
        }

        if (this.animationController.isPaused) {
            this.animationController.resume();
        } else {
            this.animationController.start();
        }

        this.updatePlayButton();
    }

    pause() {
        if (!this.animationController) {
            console.warn('Animation controller not initialized');
            return;
        }

        // Prevent multiple pause calls
        if (!this.animationController.isPlaying) {
            console.log('Animation already paused');
            return;
        }

        console.log('Pausing animation');
        this.animationController.pause();
        this.updatePlayButton();
    }

    reset() {
        this.currentStep = 0;
        this.totalSteps = 0;
        
        // Reset stats based on current category
        if (this.currentCategory === 'sorting') {
            this.stats = { comparisons: 0, swaps: 0, accesses: 0 };
        } else {
            // For other categories, initialize different relevant stats
            this.stats = { 
                visited: 0, 
                explored: 0, 
                operations: 0,
                comparisons: 0, // Keep for tree search operations
                swaps: 0, 
                accesses: 0 
            };
        }

        if (this.animationController) {
            this.animationController.reset();
        }

        if (this.visualizer && this.visualizer.reset) {
            this.visualizer.reset();
        }

        if (this.operationBox) {
            this.operationBox.reset();
        }

        this.updatePlayButton();
        this.updateStepInfo();
        this.updateStats();

        document.getElementById('current-step-explanation').textContent = 'Click play to start the algorithm visualization.';
    }

    stepForward() {
        if (this.animationController) {
            this.animationController.stepForward();
        }
    }

    stepBack() {
        if (this.animationController) {
            this.animationController.stepBack();
        }
    }

    fastForward() {
        if (this.animationController) {
            this.animationController.fastForward();
        }
    }

    startAlgorithm() {
        if (!this.currentAlgorithm) {
            console.warn('No algorithm selected');
            return;
        }

        console.log('Starting algorithm:', this.currentAlgorithm);
        
        // Generate steps for the algorithm
        const steps = this.generateAlgorithmSteps();
        console.log('Generated steps:', steps.length);

        // Set the steps in the animation controller
        this.animationController.setSteps(steps);

        // Start the animation
        this.animationController.start();
        this.updatePlayButton();
    }

    generateAlgorithmSteps() {
        // This will be implemented by specific algorithm modules
        let steps = [];
        
        switch (this.currentCategory) {
            case 'sorting':
                steps = SortingAlgorithms.generateSteps(this.currentAlgorithm, [...this.data]);
                break;
            case 'searching':
                const searchTarget = parseInt(document.getElementById('search-target').value) || 10;
                steps = SearchingAlgorithms.generateSteps(this.currentAlgorithm, [...this.data], searchTarget);
                break;
            case 'pathfinding':
                steps = PathfindingAlgorithms.generateSteps(this.currentAlgorithm);
                break;
            case 'trees':
                steps = TreeAlgorithms.generateSteps(this.currentAlgorithm);
                break;
            case 'graphs':
                steps = GraphAlgorithms.generateSteps(this.currentAlgorithm);
                break;
            case 'dynamic':
                steps = DynamicProgrammingAlgorithms.generateSteps(this.currentAlgorithm);
                break;
            case 'data-structures':
                steps = DataStructureAlgorithms.generateSteps(this.currentAlgorithm);
                break;
            default:
                steps = [];
        }
        
        return steps;
    }

    updatePlayButton() {
        const playButton = document.getElementById('play-pause-btn');
        if (!playButton) return;

        if (this.animationController.isPlaying) {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            playButton.title = 'Pause';
        } else {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.title = 'Play';
        }
    }

    updateStepInfo() {
        document.getElementById('current-step').textContent = this.currentStep;
    }

    updateStats() {
        // Only show sorting-specific stats for sorting algorithms
        if (this.currentCategory === 'sorting') {
            document.getElementById('comparisons-count').textContent = this.stats.comparisons;
            document.getElementById('swaps-count').textContent = this.stats.swaps;
            document.getElementById('accesses-count').textContent = this.stats.accesses;
        } else {
            // For other categories, we could show different relevant metrics
            // For now, we hide the panel entirely in setCategory method
        }
    }

    updateUI() {
        this.updateStepInfo();
        this.updateStats();
        this.updatePlayButton();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });
    }

    copyCode() {
        const code = this.codeEditor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy code', 'error');
        });
    }

    handleKeyboardShortcuts(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                this.reset();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.stepBack();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.stepForward();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.fastForward();
                break;
            case 't':
            case 'T':
                e.preventDefault();
                this.toggleTheme();
                break;
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dsa-visualizer-theme', newTheme);

        // Update theme toggle icon
        const icon = document.querySelector('#theme-toggle i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    showHelpModal() {
        const modal = document.getElementById('help-modal');
        modal.classList.add('show');

        // Close modal handlers
        const closeBtn = modal.querySelector('.close-btn');
        const handleClose = () => {
            modal.classList.remove('show');
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('click', handleOutsideClick);
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleOutsideClick = (e) => {
            if (e.target === modal) handleClose();
        };

        closeBtn.addEventListener('click', handleClose);
        document.addEventListener('keydown', handleEscape);
        modal.addEventListener('click', handleOutsideClick);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getStepExplanation(step) {
        switch (step.type) {
            case 'compare':
                return `We're comparing these numbers to see which one is bigger. This helps us decide if we need to swap them.`;
            case 'swap':
                return `We need to swap these numbers because the bigger one should be on the right. This helps us sort the array.`;
            case 'mark_sorted':
                return `This number is now in its correct position! We don't need to move it anymore.`;
            case 'init':
                return `Let's start sorting! We'll compare numbers two at a time and swap them if needed.`;
            case 'complete':
                return `Great job! All the numbers are now in the correct order from smallest to biggest.`;
            default:
                return step.description || 'Processing...';
        }
    }

    generateTreeData() {
        const treeInput = document.getElementById('tree-input');
        let inputValue = treeInput ? treeInput.value : '';
        
        // Use default values if no input provided
        if (!inputValue) {
            inputValue = '50,30,70,20,40,60,80';
            if (treeInput) {
                treeInput.value = inputValue;
            }
        }
        
        try {
            const values = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            if (values.length > 0) {
                this.treeData = this.buildBST(values);
                if (this.visualizer && this.visualizer.setTree) {
                    this.visualizer.setTree(this.treeData);
                }
                this.reset();
            }
        } catch (error) {
            console.warn('Invalid tree input format');
        }
    }

    buildBST(values) {
        if (values.length === 0) return null;
        
        class TreeNode {
            constructor(value) {
                this.value = value;
                this.left = null;
                this.right = null;
            }
        }
        
        function insertNode(root, value) {
            if (!root) {
                return new TreeNode(value);
            }
            
            if (value < root.value) {
                root.left = insertNode(root.left, value);
            } else if (value > root.value) {
                root.right = insertNode(root.right, value);
            }
            // Ignore duplicates
            
            return root;
        }
        
        function convertToD3Format(node) {
            if (!node) return null;
            
            const d3Node = {
                value: node.value,
                children: []
            };
            
            // Add children in order: left first, then right
            if (node.left) {
                d3Node.children.push(convertToD3Format(node.left));
            }
            if (node.right) {
                d3Node.children.push(convertToD3Format(node.right));
            }
            
            // If no children, remove the empty children array
            if (d3Node.children.length === 0) {
                delete d3Node.children;
            }
            
            return d3Node;
        }
        
        let root = null;
        for (const value of values) {
            root = insertNode(root, value);
        }
        
        const result = convertToD3Format(root);
        console.log('Built tree structure:', result);
        return result;
    }

    generateGraphData() {
        const graphType = document.getElementById('graph-type');
        const selectedType = graphType ? graphType.value : 'sample';
        let graphData = { nodes: [], links: [] };
        
        switch (selectedType) {
            case 'sample':
                graphData = {
                    nodes: [
                        { id: 'A', label: 'A', x: 150, y: 100 },
                        { id: 'B', label: 'B', x: 350, y: 100 },
                        { id: 'C', label: 'C', x: 550, y: 100 },
                        { id: 'D', label: 'D', x: 250, y: 250 },
                        { id: 'E', label: 'E', x: 450, y: 250 },
                        { id: 'F', label: 'F', x: 350, y: 400 }
                    ],
                    links: [
                        { source: 'A', target: 'B', weight: 4 },
                        { source: 'A', target: 'D', weight: 2 },
                        { source: 'B', target: 'C', weight: 3 },
                        { source: 'B', target: 'E', weight: 1 },
                        { source: 'C', target: 'E', weight: 5 },
                        { source: 'D', target: 'E', weight: 2 },
                        { source: 'D', target: 'F', weight: 6 },
                        { source: 'E', target: 'F', weight: 1 }
                    ]
                };
                break;
            case 'grid':
                // Generate a small grid graph
                const gridSize = 4;
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        graphData.nodes.push({ 
                            id: `${i}-${j}`, 
                            label: `${i},${j}`,
                            x: j * 120 + 100,
                            y: i * 120 + 100
                        });
                    }
                }
                // Add edges
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        if (j < gridSize - 1) {
                            graphData.links.push({ 
                                source: `${i}-${j}`, 
                                target: `${i}-${j + 1}`,
                                weight: 1
                            });
                        }
                        if (i < gridSize - 1) {
                            graphData.links.push({ 
                                source: `${i}-${j}`, 
                                target: `${i + 1}-${j}`,
                                weight: 1
                            });
                        }
                    }
                }
                break;
            case 'random':
                // Generate random graph with proper positioning
                const numNodes = 6;
                const centerX = 300;
                const centerY = 250;
                const radius = 150;
                
                for (let i = 0; i < numNodes; i++) {
                    const angle = (i * 2 * Math.PI) / numNodes;
                    graphData.nodes.push({ 
                        id: String.fromCharCode(65 + i), 
                        label: String.fromCharCode(65 + i),
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle)
                    });
                }
                // Add random edges
                for (let i = 0; i < numNodes; i++) {
                    for (let j = i + 1; j < numNodes; j++) {
                        if (Math.random() < 0.4) {
                            graphData.links.push({
                                source: String.fromCharCode(65 + i),
                                target: String.fromCharCode(65 + j),
                                weight: Math.floor(Math.random() * 10) + 1
                            });
                        }
                    }
                }
                break;
        }
        
        console.log('Generated graph data:', graphData);
        this.graphData = graphData;
        if (this.visualizer && this.visualizer.setGraph) {
            this.visualizer.setGraph(graphData);
        }
        this.reset();
    }
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('dsa-visualizer-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Make DSAVisualizerApp available globally
window.DSAVisualizerApp = DSAVisualizerApp;

// Global app instance
let app; 