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

        // Show/hide search target input based on category
        const searchTargetGroup = document.getElementById('search-target-group');
        if (category === 'searching') {
            searchTargetGroup.style.display = 'block';
        } else {
            searchTargetGroup.style.display = 'none';
        }

        this.populateAlgorithmSelect();
        this.initializeVisualizer();
        this.reset();
    }

    setAlgorithm(algorithmId) {
        this.currentAlgorithm = algorithmId;
        document.getElementById('algorithm-select').value = algorithmId;

        // Initialize the appropriate visualizer
        this.initializeVisualizer();
        this.updateAlgorithmInfo();
        this.reset();
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
                break;
            case 'graphs':
                svg.style.display = 'block';
                this.visualizer = new GraphVisualizer(svg);
                break;
            case 'dynamic':
                canvas.style.display = 'block';
                this.visualizer = new DPGridVisualizer(canvas);
                break;
            case 'data-structures':
                svg.style.display = 'block';
                this.visualizer = new DataStructureVisualizer(svg);
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
        };

        this.animationController.onStatsUpdate = (stats) => {
            console.log('Stats updated:', stats);
            if (stats.comparisons) this.stats.comparisons += stats.comparisons;
            if (stats.swaps) this.stats.swaps += stats.swaps;
            if (stats.accesses) this.stats.accesses += stats.accesses;
            this.updateStats();
        };

        this.animationController.onExplanationUpdate = (explanation) => {
            console.log('Explanation updated:', explanation);
            document.getElementById('current-step-explanation').textContent = explanation;
        };

        this.animationController.onComplete = () => {
            console.log('Animation completed');
            this.updatePlayButton();
            document.getElementById('current-step-explanation').textContent = 'Algorithm completed! Click reset to run again.';
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
        this.stats = { comparisons: 0, swaps: 0, accesses: 0 };

        if (this.animationController) {
            this.animationController.reset();
        }

        if (this.visualizer && this.visualizer.reset) {
            this.visualizer.reset();
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
        document.getElementById('comparisons-count').textContent = this.stats.comparisons;
        document.getElementById('swaps-count').textContent = this.stats.swaps;
        document.getElementById('accesses-count').textContent = this.stats.accesses;
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
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('dsa-visualizer-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Make DSAVisualizerApp available globally
window.DSAVisualizerApp = DSAVisualizerApp;

// Global app instance
let app; 