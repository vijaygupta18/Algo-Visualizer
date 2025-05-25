/**
 * DSA Visualizer - Core Visualization Classes
 * Handles rendering and animation of different data structures
 */

// Base Visualizer Class
class BaseVisualizer {
    constructor(container) {
        this.container = container;
        this.data = [];
        this.highlightedElements = new Set();
        this.animationQueue = [];
        this.isAnimating = false;
    }

    setData(data) {
        this.data = [...data];
        this.render();
    }

    highlight(indices, className = 'current') {
        if (!Array.isArray(indices)) indices = [indices];
        indices.forEach(index => {
            this.highlightedElements.add({ index, className });
        });
        this.updateHighlights();
    }

    clearHighlights() {
        this.highlightedElements.clear();
        this.updateHighlights();
    }

    reset() {
        this.clearHighlights();
        this.animationQueue = [];
        this.isAnimating = false;
        this.render();
    }

    render() {
        // To be implemented by subclasses
        throw new Error('render() method must be implemented by subclass');
    }

    updateHighlights() {
        // To be implemented by subclasses
        throw new Error('updateHighlights() method must be implemented by subclass');
    }
}

// Array Visualizer for sorting and searching algorithms
class ArrayVisualizer extends BaseVisualizer {
    constructor(canvas, data = []) {
        super(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.padding = 20;
        this.barSpacing = 2;
        this.maxValue = 300;
        this.minBarHeight = 10;

        this.setupCanvas();
        if (data.length > 0) {
            this.setData(data);
        }
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        // Set canvas size
        this.canvas.width = rect.width - 40;
        this.canvas.height = rect.height - 40;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.width;
        const displayHeight = this.canvas.height;

        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';

        this.ctx.scale(dpr, dpr);
        this.canvas.width = displayWidth;
        this.canvas.height = displayHeight;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.data.length === 0) {
            this.drawEmptyState();
            return;
        }

        const availableWidth = this.canvas.width - (2 * this.padding);
        const barWidth = Math.max(8, (availableWidth - (this.data.length - 1) * this.barSpacing) / this.data.length);
        const maxBarHeight = this.canvas.height - (2 * this.padding) - 30; // Leave space for labels

        this.data.forEach((value, index) => {
            const x = this.padding + index * (barWidth + this.barSpacing);
            const normalizedHeight = (value / this.maxValue) * maxBarHeight;
            const barHeight = Math.max(this.minBarHeight, normalizedHeight);
            const y = this.canvas.height - this.padding - barHeight;

            // Determine bar color based on highlights
            let color = this.getBarColor(index);

            // Draw bar
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value label
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toString(), x + barWidth / 2, this.canvas.height - 5);

            // Draw index label
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(index.toString(), x + barWidth / 2, y - 5);
        });
    }

    getBarColor(index) {
        // Check for highlights
        for (const highlight of this.highlightedElements) {
            if (highlight.index === index) {
                switch (highlight.className) {
                    case 'comparing': return '#f59e0b';
                    case 'swapping': return '#ef4444';
                    case 'sorted': return '#10b981';
                    case 'pivot': return '#3b82f6';
                    case 'current': return '#f59e0b';
                    case 'found': return '#10b981';
                    case 'searching': return '#8b5cf6';
                    default: return '#f59e0b';
                }
            }
        }
        return '#e2e8f0'; // Default color
    }

    updateHighlights() {
        this.render();
    }

    drawEmptyState() {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Enter data or generate random array to begin',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    animateSwap(index1, index2, duration = 500) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Highlight swapping elements
                this.clearHighlights();
                this.highlight([index1, index2], 'swapping');

                if (progress >= 1) {
                    // Swap complete
                    [this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]];
                    this.render();
                    resolve();
                } else {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        });
    }

    animateComparison(index1, index2, duration = 300) {
        return new Promise(resolve => {
            this.clearHighlights();
            this.highlight([index1, index2], 'comparing');
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }
}

// Grid Visualizer for pathfinding algorithms
class GridVisualizer extends BaseVisualizer {
    constructor(canvas) {
        super(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = 20;
        this.cols = 30;
        this.cellSize = 20;
        this.grid = [];
        this.startCell = { row: 5, col: 5 };
        this.endCell = { row: 15, col: 25 };

        this.setupCanvas();
        this.initializeGrid();
        this.setupInteraction();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = Math.min(rect.width - 40, this.cols * this.cellSize);
        this.canvas.height = Math.min(rect.height - 40, this.rows * this.cellSize);

        // Recalculate cell size to fit canvas
        this.cellSize = Math.min(
            this.canvas.width / this.cols,
            this.canvas.height / this.rows
        );
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    row,
                    col,
                    isWall: false,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previous: null
                };
            }
        }
        this.render();
    }

    setupInteraction() {
        let isDrawing = false;
        let drawMode = 'wall'; // 'wall', 'start', 'end'

        this.canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            this.handleCellClick(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (isDrawing && drawMode === 'wall') {
                this.handleCellClick(e);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
    }

    handleCellClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            const cell = this.grid[row][col];

            // Don't modify start or end cells when drawing walls
            if ((row === this.startCell.row && col === this.startCell.col) ||
                (row === this.endCell.row && col === this.endCell.col)) {
                return;
            }

            cell.isWall = !cell.isWall;
            this.render();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                // Determine cell color
                let color = '#ffffff';
                if (row === this.startCell.row && col === this.startCell.col) {
                    color = '#3b82f6'; // Start cell
                } else if (row === this.endCell.row && col === this.endCell.col) {
                    color = '#ef4444'; // End cell
                } else if (cell.isWall) {
                    color = '#1e293b'; // Wall
                } else if (cell.isPath) {
                    color = '#10b981'; // Path
                } else if (cell.isVisited) {
                    color = '#f59e0b'; // Visited
                }

                // Draw cell
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

                // Draw border
                this.ctx.strokeStyle = '#e2e8f0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
            }
        }
    }

    setStart(row, col) {
        this.startCell = { row, col };
        this.render();
    }

    setEnd(row, col) {
        this.endCell = { row, col };
        this.render();
    }

    clearPath() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                cell.isVisited = false;
                cell.isPath = false;
                cell.distance = Infinity;
                cell.previous = null;
            }
        }
        this.render();
    }

    reset() {
        this.clearPath();
        // Clear walls but keep start and end
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!((row === this.startCell.row && col === this.startCell.col) ||
                    (row === this.endCell.row && col === this.endCell.col))) {
                    this.grid[row][col].isWall = false;
                }
            }
        }
        this.render();
    }

    animateVisit(row, col, duration = 100) {
        return new Promise(resolve => {
            this.grid[row][col].isVisited = true;
            this.render();
            setTimeout(resolve, duration);
        });
    }

    animatePath(path, duration = 100) {
        return new Promise(resolve => {
            let index = 0;
            const animateNext = () => {
                if (index < path.length) {
                    const { row, col } = path[index];
                    this.grid[row][col].isPath = true;
                    this.render();
                    index++;
                    setTimeout(animateNext, duration);
                } else {
                    resolve();
                }
            };
            animateNext();
        });
    }
}

// Tree Visualizer for tree algorithms
class TreeVisualizer extends BaseVisualizer {
    constructor(svg) {
        super(svg);
        this.svg = d3.select(svg);
        this.width = 800;
        this.height = 600;
        this.nodeRadius = 25;
        this.tree = null;

        this.setupSVG();
    }

    setupSVG() {
        const container = this.svg.node().parentElement;
        const rect = container.getBoundingClientRect();

        this.width = rect.width - 40;
        this.height = rect.height - 40;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    }

    setTree(treeData) {
        this.tree = treeData;
        this.render();
    }

    render() {
        this.svg.selectAll('*').remove();

        if (!this.tree) {
            this.drawEmptyState();
            return;
        }

        // Create tree layout
        const treeLayout = d3.tree()
            .size([this.width - 100, this.height - 100]);

        const root = d3.hierarchy(this.tree);
        treeLayout(root);

        // Draw links
        this.svg.selectAll('.link')
            .data(root.links())
            .enter()
            .append('line')
            .attr('class', 'link tree-edge')
            .attr('x1', d => d.source.x + 50)
            .attr('y1', d => d.source.y + 50)
            .attr('x2', d => d.target.x + 50)
            .attr('y2', d => d.target.y + 50)
            .attr('stroke', '#cbd5e1')
            .attr('stroke-width', 2);

        // Draw nodes
        const nodes = this.svg.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node tree-node')
            .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`);

        nodes.append('circle')
            .attr('r', this.nodeRadius)
            .attr('fill', '#e2e8f0')
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 2);

        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-family', 'monospace')
            .attr('font-size', '14px')
            .attr('fill', '#1e293b')
            .text(d => d.data.value);
    }

    drawEmptyState() {
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', '#94a3b8')
            .text('Tree will be displayed here');
    }

    highlightNode(nodeId, className = 'current') {
        this.svg.selectAll('.node')
            .filter(d => d.data.id === nodeId)
            .select('circle')
            .classed(className, true);
    }

    clearHighlights() {
        this.svg.selectAll('.node circle')
            .attr('class', '');
        this.svg.selectAll('.link')
            .attr('class', 'link tree-edge');
    }

    animateTraversal(nodeId, duration = 500) {
        return new Promise(resolve => {
            this.highlightNode(nodeId, 'visiting');
            setTimeout(() => {
                this.highlightNode(nodeId, 'visited');
                resolve();
            }, duration);
        });
    }
}

// Graph Visualizer for graph algorithms
class GraphVisualizer extends BaseVisualizer {
    constructor(svg) {
        super(svg);
        this.svg = d3.select(svg);
        this.width = 800;
        this.height = 600;
        this.nodeRadius = 20;
        this.graph = { nodes: [], links: [] };

        this.setupSVG();
        this.createDefaultGraph();
    }

    setupSVG() {
        const container = this.svg.node().parentElement;
        const rect = container.getBoundingClientRect();

        this.width = rect.width - 40;
        this.height = rect.height - 40;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    }

    createDefaultGraph() {
        // Create a sample graph
        this.graph = {
            nodes: [
                { id: 'A', x: 100, y: 100 },
                { id: 'B', x: 300, y: 100 },
                { id: 'C', x: 500, y: 100 },
                { id: 'D', x: 200, y: 250 },
                { id: 'E', x: 400, y: 250 },
                { id: 'F', x: 300, y: 400 }
            ],
            links: [
                { source: 'A', target: 'B', weight: 4 },
                { source: 'A', target: 'D', weight: 2 },
                { source: 'B', target: 'C', weight: 3 },
                { source: 'B', target: 'E', weight: 1 },
                { source: 'C', target: 'E', weight: 5 },
                { source: 'D', target: 'E', weight: 2 },
                { source: 'D', target: 'F', weight: 4 },
                { source: 'E', target: 'F', weight: 1 }
            ]
        };
        this.render();
    }

    setGraph(graphData) {
        this.graph = graphData;
        this.render();
    }

    render() {
        this.svg.selectAll('*').remove();

        // Draw links
        this.svg.selectAll('.link')
            .data(this.graph.links)
            .enter()
            .append('line')
            .attr('class', 'link graph-edge')
            .attr('x1', d => this.getNodeById(d.source).x)
            .attr('y1', d => this.getNodeById(d.source).y)
            .attr('x2', d => this.getNodeById(d.target).x)
            .attr('y2', d => this.getNodeById(d.target).y)
            .attr('stroke', '#cbd5e1')
            .attr('stroke-width', 2);

        // Draw link weights
        this.svg.selectAll('.weight')
            .data(this.graph.links)
            .enter()
            .append('text')
            .attr('class', 'weight')
            .attr('x', d => (this.getNodeById(d.source).x + this.getNodeById(d.target).x) / 2)
            .attr('y', d => (this.getNodeById(d.source).y + this.getNodeById(d.target).y) / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .attr('font-family', 'monospace')
            .text(d => d.weight);

        // Draw nodes
        const nodes = this.svg.selectAll('.node')
            .data(this.graph.nodes)
            .enter()
            .append('g')
            .attr('class', 'node graph-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        nodes.append('circle')
            .attr('r', this.nodeRadius)
            .attr('fill', '#e2e8f0')
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 2);

        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-family', 'monospace')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1e293b')
            .text(d => d.id);
    }

    getNodeById(id) {
        return this.graph.nodes.find(node => node.id === id);
    }

    highlightNode(nodeId, className = 'current') {
        this.svg.selectAll('.node')
            .filter(d => d.id === nodeId)
            .select('circle')
            .classed(className, true);
    }

    highlightEdge(sourceId, targetId, className = 'active') {
        this.svg.selectAll('.link')
            .filter(d =>
                (d.source === sourceId && d.target === targetId) ||
                (d.source === targetId && d.target === sourceId)
            )
            .classed(className, true);
    }

    clearHighlights() {
        this.svg.selectAll('.node circle')
            .attr('class', '');
        this.svg.selectAll('.link')
            .attr('class', 'link graph-edge');
    }

    animateNodeVisit(nodeId, duration = 500) {
        return new Promise(resolve => {
            this.highlightNode(nodeId, 'exploring');
            setTimeout(() => {
                this.highlightNode(nodeId, 'processed');
                resolve();
            }, duration);
        });
    }
}

// Data Structure Visualizer for stacks, queues, etc.
class DataStructureVisualizer extends BaseVisualizer {
    constructor(svg) {
        super(svg);
        this.svg = d3.select(svg);
        this.width = 800;
        this.height = 600;
        this.structure = [];
        this.type = 'stack'; // 'stack', 'queue', 'linked-list'

        this.setupSVG();
    }

    setupSVG() {
        const container = this.svg.node().parentElement;
        const rect = container.getBoundingClientRect();

        this.width = rect.width - 40;
        this.height = rect.height - 40;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    }

    setStructureType(type) {
        this.type = type;
        this.structure = [];
        this.render();
    }

    setData(data) {
        this.structure = [...data];
        this.render();
    }

    render() {
        this.svg.selectAll('*').remove();

        switch (this.type) {
            case 'stack':
                this.renderStack();
                break;
            case 'queue':
                this.renderQueue();
                break;
            case 'linked-list':
                this.renderLinkedList();
                break;
        }
    }

    renderStack() {
        const itemHeight = 40;
        const itemWidth = 100;
        const startX = this.width / 2 - itemWidth / 2;
        const startY = this.height - 50;

        this.structure.forEach((item, index) => {
            const y = startY - (index * itemHeight);

            // Draw stack item
            const group = this.svg.append('g')
                .attr('class', 'stack-item')
                .attr('transform', `translate(${startX}, ${y})`);

            group.append('rect')
                .attr('width', itemWidth)
                .attr('height', itemHeight - 2)
                .attr('fill', '#e2e8f0')
                .attr('stroke', '#94a3b8')
                .attr('stroke-width', 2)
                .attr('rx', 4);

            group.append('text')
                .attr('x', itemWidth / 2)
                .attr('y', itemHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-family', 'monospace')
                .attr('font-size', '14px')
                .attr('fill', '#1e293b')
                .text(item);
        });

        // Draw stack label
        this.svg.append('text')
            .attr('x', startX + itemWidth / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1e293b')
            .text('Stack');
    }

    renderQueue() {
        const itemHeight = 40;
        const itemWidth = 60;
        const startX = 50;
        const startY = this.height / 2 - itemHeight / 2;

        this.structure.forEach((item, index) => {
            const x = startX + (index * itemWidth);

            // Draw queue item
            const group = this.svg.append('g')
                .attr('class', 'queue-item')
                .attr('transform', `translate(${x}, ${startY})`);

            group.append('rect')
                .attr('width', itemWidth - 2)
                .attr('height', itemHeight)
                .attr('fill', '#e2e8f0')
                .attr('stroke', '#94a3b8')
                .attr('stroke-width', 2)
                .attr('rx', 4);

            group.append('text')
                .attr('x', (itemWidth - 2) / 2)
                .attr('y', itemHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-family', 'monospace')
                .attr('font-size', '14px')
                .attr('fill', '#1e293b')
                .text(item);
        });

        // Draw queue labels
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1e293b')
            .text('Queue');

        if (this.structure.length > 0) {
            // Front pointer
            this.svg.append('text')
                .attr('x', startX + itemWidth / 2)
                .attr('y', startY - 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#3b82f6')
                .text('Front');

            // Rear pointer
            this.svg.append('text')
                .attr('x', startX + (this.structure.length - 1) * itemWidth + itemWidth / 2)
                .attr('y', startY + itemHeight + 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#ef4444')
                .text('Rear');
        }
    }

    renderLinkedList() {
        const nodeWidth = 80;
        const nodeHeight = 40;
        const nodeSpacing = 120;
        const startX = 50;
        const startY = this.height / 2 - nodeHeight / 2;

        this.structure.forEach((item, index) => {
            const x = startX + (index * nodeSpacing);

            // Draw node
            const group = this.svg.append('g')
                .attr('class', 'list-node')
                .attr('transform', `translate(${x}, ${startY})`);

            // Data part
            group.append('rect')
                .attr('width', nodeWidth * 0.7)
                .attr('height', nodeHeight)
                .attr('fill', '#e2e8f0')
                .attr('stroke', '#94a3b8')
                .attr('stroke-width', 2)
                .attr('rx', 4);

            // Pointer part
            group.append('rect')
                .attr('x', nodeWidth * 0.7)
                .attr('width', nodeWidth * 0.3)
                .attr('height', nodeHeight)
                .attr('fill', '#f1f5f9')
                .attr('stroke', '#94a3b8')
                .attr('stroke-width', 2)
                .attr('rx', 4);

            // Data text
            group.append('text')
                .attr('x', (nodeWidth * 0.7) / 2)
                .attr('y', nodeHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-family', 'monospace')
                .attr('font-size', '14px')
                .attr('fill', '#1e293b')
                .text(item);

            // Pointer arrow
            if (index < this.structure.length - 1) {
                group.append('line')
                    .attr('x1', nodeWidth)
                    .attr('y1', nodeHeight / 2)
                    .attr('x2', nodeSpacing - 10)
                    .attr('y2', nodeHeight / 2)
                    .attr('stroke', '#64748b')
                    .attr('stroke-width', 2)
                    .attr('marker-end', 'url(#arrowhead)');
            } else {
                // Null pointer
                group.append('text')
                    .attr('x', nodeWidth * 0.85)
                    .attr('y', nodeHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('font-family', 'monospace')
                    .attr('font-size', '10px')
                    .attr('fill', '#ef4444')
                    .text('∅');
            }
        });

        // Define arrow marker
        const defs = this.svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 7)
            .attr('refX', 9)
            .attr('refY', 3.5)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3.5, 0 7')
            .attr('fill', '#64748b');

        // Draw title
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1e293b')
            .text('Linked List');
    }

    push(item) {
        this.structure.push(item);
        this.render();
    }

    pop() {
        const item = this.structure.pop();
        this.render();
        return item;
    }

    enqueue(item) {
        this.structure.push(item);
        this.render();
    }

    dequeue() {
        const item = this.structure.shift();
        this.render();
        return item;
    }

    reset() {
        this.structure = [];
        this.render();
    }
}

// Dynamic Programming Grid Visualizer
class DPGridVisualizer extends BaseVisualizer {
    constructor(canvas) {
        super(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = 10;
        this.cols = 10;
        this.cellSize = 40;
        this.grid = [];

        this.setupCanvas();
        this.initializeGrid();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = Math.min(rect.width - 40, this.cols * this.cellSize);
        this.canvas.height = Math.min(rect.height - 40, this.rows * this.cellSize);

        // Recalculate cell size to fit canvas
        this.cellSize = Math.min(
            this.canvas.width / this.cols,
            this.canvas.height / this.rows
        );
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    value: null,
                    isCalculated: false,
                    isOptimal: false
                };
            }
        }
        this.render();
    }

    setDimensions(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.initializeGrid();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                // Determine cell color
                let color = '#ffffff';
                if (cell.isOptimal) {
                    color = '#3b82f6';
                } else if (cell.isCalculated) {
                    color = '#10b981';
                } else if (cell.value !== null) {
                    color = '#f59e0b';
                }

                // Draw cell
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

                // Draw border
                this.ctx.strokeStyle = '#e2e8f0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                // Draw value
                if (cell.value !== null) {
                    this.ctx.fillStyle = color === '#ffffff' ? '#1e293b' : '#ffffff';
                    this.ctx.font = '12px monospace';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(
                        cell.value.toString(),
                        x + this.cellSize / 2,
                        y + this.cellSize / 2 + 4
                    );
                }
            }
        }
    }

    setValue(row, col, value) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.grid[row][col].value = value;
            this.grid[row][col].isCalculated = true;
            this.render();
        }
    }

    markOptimal(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.grid[row][col].isOptimal = true;
            this.render();
        }
    }

    reset() {
        this.initializeGrid();
    }

    animateCalculation(row, col, value, duration = 500) {
        return new Promise(resolve => {
            // Highlight cell being calculated
            const x = col * this.cellSize;
            const y = row * this.cellSize;

            this.ctx.fillStyle = '#f59e0b';
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
            this.ctx.strokeStyle = '#e2e8f0';
            this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

            setTimeout(() => {
                this.setValue(row, col, value);
                resolve();
            }, duration);
        });
    }
} 