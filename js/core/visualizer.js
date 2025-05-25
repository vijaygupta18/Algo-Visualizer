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

        if (!this.tree || !this.tree.value) {
            this.drawEmptyState();
            return;
        }

        try {
            console.log('Rendering tree:', this.tree);
            
            // Create tree layout
            const treeLayout = d3.tree()
                .size([this.width - 100, this.height - 100]);

            const root = d3.hierarchy(this.tree);
            console.log('D3 hierarchy created:', root);
            
            treeLayout(root);

            // Draw links first (so they appear behind nodes)
            const links = this.svg.selectAll('.link')
                .data(root.links())
                .enter()
                .append('line')
                .attr('class', 'link tree-edge')
                .attr('x1', d => d.source.x + 50)
                .attr('y1', d => d.source.y + 50)
                .attr('x2', d => d.target.x + 50)
                .attr('y2', d => d.target.y + 50);

            // Draw nodes
            const nodes = this.svg.selectAll('.node')
                .data(root.descendants())
                .enter()
                .append('g')
                .attr('class', 'node tree-node')
                .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`);

            nodes.append('circle')
                .attr('r', this.nodeRadius);

            nodes.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-family', 'monospace')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#1e293b')
                .text(d => {
                    console.log('Node data:', d.data);
                    return d.data.value;
                });

            console.log('Tree rendered successfully with', root.descendants().length, 'nodes');

        } catch (error) {
            console.error('Error rendering tree:', error);
            this.drawEmptyState();
        }
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
        // Create a sample graph with proper positioning
        this.graph = {
            nodes: [
                { id: 'A', x: 150, y: 100 },
                { id: 'B', x: 350, y: 100 },
                { id: 'C', x: 550, y: 100 },
                { id: 'D', x: 250, y: 250 },
                { id: 'E', x: 450, y: 250 },
                { id: 'F', x: 350, y: 400 }
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
        console.log('Created default graph:', this.graph);
        this.render();
    }

    setGraph(graphData) {
        this.graph = graphData;
        this.render();
    }

    render() {
        this.svg.selectAll('*').remove();

        if (!this.graph || !this.graph.nodes || this.graph.nodes.length === 0) {
            this.drawEmptyState();
            return;
        }

        try {
            console.log('Rendering graph:', this.graph);
            
            // Draw links first (so they appear behind nodes)
            const links = this.svg.selectAll('.link')
                .data(this.graph.links)
                .enter()
                .append('line')
                .attr('class', 'link graph-edge')
                .attr('x1', d => {
                    const node = this.getNodeById(d.source);
                    return node ? node.x : 0;
                })
                .attr('y1', d => {
                    const node = this.getNodeById(d.source);
                    return node ? node.y : 0;
                })
                .attr('x2', d => {
                    const node = this.getNodeById(d.target);
                    return node ? node.x : 0;
                })
                .attr('y2', d => {
                    const node = this.getNodeById(d.target);
                    return node ? node.y : 0;
                });

            // Draw link weights
            const weights = this.svg.selectAll('.weight')
                .data(this.graph.links)
                .enter()
                .append('text')
                .attr('class', 'weight')
                .attr('x', d => {
                    const source = this.getNodeById(d.source);
                    const target = this.getNodeById(d.target);
                    return source && target ? (source.x + target.x) / 2 : 0;
                })
                .attr('y', d => {
                    const source = this.getNodeById(d.source);
                    const target = this.getNodeById(d.target);
                    return source && target ? (source.y + target.y) / 2 : 0;
                })
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#64748b')
                .attr('font-family', 'monospace')
                .text(d => d.weight || '');

            // Draw nodes
            const nodes = this.svg.selectAll('.node')
                .data(this.graph.nodes)
                .enter()
                .append('g')
                .attr('class', 'node graph-node')
                .attr('transform', d => {
                    console.log('Node positioning:', d.id, 'at', d.x, d.y);
                    return `translate(${d.x || 0}, ${d.y || 0})`;
                });

            nodes.append('circle')
                .attr('r', this.nodeRadius);

            nodes.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-family', 'monospace')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#1e293b')
                .text(d => d.id || d.label || '');

            console.log('Graph rendered successfully with', this.graph.nodes.length, 'nodes and', this.graph.links.length, 'links');

        } catch (error) {
            console.error('Error rendering graph:', error);
            this.drawEmptyState();
        }
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

    drawEmptyState() {
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', '#94a3b8')
            .text('Graph will be displayed here');
    }
}

// Data Structure Visualizer for stacks, queues, etc.
class DataStructureVisualizer extends BaseVisualizer {
    constructor(svgElement) {
        super(svgElement);
        this.svg = d3.select(svgElement);
        this.width = 800;
        this.height = 600;
        this.data = [10, 20, 30]; // Initialize with sample data
        this.type = 'stack'; // stack, queue, linked-list, hash-table
        this.animations = [];
        
        this.colors = {
            default: '#3498db',
            highlight: '#e74c3c',
            new: '#2ecc71',
            removed: '#e67e22',
            pointer: '#9b59b6'
        };
        
        this.init();
        this.render(); // Render initial state
    }

    init() {
        this.svg.selectAll("*").remove();
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", `0 0 ${this.width} ${this.height}`);

        // Create groups for different elements
        this.containerGroup = this.svg.append("g").attr("class", "containers");
        this.elementGroup = this.svg.append("g").attr("class", "elements");
        this.pointerGroup = this.svg.append("g").attr("class", "pointers");
        this.labelGroup = this.svg.append("g").attr("class", "labels");
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .ds-element {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .ds-element:hover {
                transform: scale(1.05);
            }
            .ds-container {
                stroke: #2c3e50;
                stroke-width: 2;
                fill: none;
            }
            .ds-text {
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                font-weight: bold;
                text-anchor: middle;
                dominant-baseline: central;
                fill: white;
                pointer-events: none;
            }
            .ds-label {
                font-family: 'Comic Sans MS', cursive;
                font-size: 12px;
                fill: #2c3e50;
                text-anchor: middle;
            }
            .ds-pointer {
                stroke: #e74c3c;
                stroke-width: 2;
                fill: none;
                marker-end: url(#arrowhead);
            }
        `;
        document.head.appendChild(style);
        
        // Add arrow marker for pointers
        const defs = this.svg.append("defs");
        defs.append("marker")
            .attr("id", "arrowhead")
            .attr("markerWidth", 10)
            .attr("markerHeight", 7)
            .attr("refX", 9)
            .attr("refY", 3.5)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 10 3.5, 0 7")
            .attr("fill", "#e74c3c");
    }

    setData(data, type = 'stack') {
        this.data = data || [];
        this.type = type;
        this.render();
    }

    render() {
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
            case 'hash-table':
                this.renderHashTable();
                break;
            default:
                this.renderStack();
        }
    }

    renderStack() {
        const elementHeight = 50;
        const elementWidth = 100;
        const startX = this.width / 2 - elementWidth / 2;
        const startY = this.height - 100;
        
        // Clear previous elements
        this.elementGroup.selectAll("*").remove();
        this.labelGroup.selectAll("*").remove();
        
        // Draw stack container
        this.containerGroup.selectAll("*").remove();
        this.containerGroup.append("rect")
            .attr("class", "ds-container")
            .attr("x", startX - 10)
            .attr("y", startY - this.data.length * elementHeight - 10)
            .attr("width", elementWidth + 20)
            .attr("height", this.data.length * elementHeight + 20);
        
        // Draw elements
        const elements = this.elementGroup
            .selectAll(".ds-element")
            .data(this.data);

        const elementEnter = elements.enter()
            .append("g")
            .attr("class", "ds-element");

        elementEnter.append("rect")
            .attr("width", elementWidth)
            .attr("height", elementHeight - 2)
            .attr("fill", this.colors.default)
            .attr("stroke", "#2c3e50")
            .attr("stroke-width", 2);

        elementEnter.append("text")
            .attr("class", "ds-text")
            .attr("x", elementWidth / 2)
            .attr("y", elementHeight / 2)
            .text(d => d.value || d);

        // Add emoji for top element
        elementEnter.append("text")
            .attr("class", "ds-emoji")
            .attr("x", elementWidth + 15)
            .attr("y", elementHeight / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text((d, i) => i === this.data.length - 1 ? "👆" : "");

        elements.merge(elementEnter)
            .attr("transform", (d, i) => 
                `translate(${startX}, ${startY - (i + 1) * elementHeight})`);

        elements.exit().remove();
        
        // Add labels
        this.labelGroup.append("text")
            .attr("class", "ds-label")
            .attr("x", this.width / 2)
            .attr("y", 30)
            .text("📚 Stack (LIFO - Last In, First Out)")
            .style("font-size", "16px");
        
        if (this.data.length > 0) {
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", startX + elementWidth + 40)
                .attr("y", startY - this.data.length * elementHeight + elementHeight / 2)
                .text("← TOP");
        }
    }

    renderQueue() {
        const elementHeight = 50;
        const elementWidth = 80;
        const startX = 100;
        const startY = this.height / 2 - elementHeight / 2;
        
        // Clear previous elements
        this.elementGroup.selectAll("*").remove();
        this.labelGroup.selectAll("*").remove();
        this.pointerGroup.selectAll("*").remove();
        
        // Draw queue container
        this.containerGroup.selectAll("*").remove();
        this.containerGroup.append("rect")
            .attr("class", "ds-container")
            .attr("x", startX - 10)
            .attr("y", startY - 10)
            .attr("width", this.data.length * elementWidth + 20)
            .attr("height", elementHeight + 20);
        
        // Draw elements
        const elements = this.elementGroup
            .selectAll(".ds-element")
            .data(this.data);

        const elementEnter = elements.enter()
            .append("g")
            .attr("class", "ds-element");

        elementEnter.append("rect")
            .attr("width", elementWidth - 2)
            .attr("height", elementHeight)
            .attr("fill", this.colors.default)
            .attr("stroke", "#2c3e50")
            .attr("stroke-width", 2);

        elementEnter.append("text")
            .attr("class", "ds-text")
            .attr("x", elementWidth / 2)
            .attr("y", elementHeight / 2)
            .text(d => d.value || d);

        elements.merge(elementEnter)
            .attr("transform", (d, i) => 
                `translate(${startX + i * elementWidth}, ${startY})`);

        elements.exit().remove();
        
        // Add labels and pointers
        this.labelGroup.append("text")
            .attr("class", "ds-label")
            .attr("x", this.width / 2)
            .attr("y", 30)
            .text("🚶‍♂️ Queue (FIFO - First In, First Out)")
            .style("font-size", "16px");
        
        if (this.data.length > 0) {
            // Front pointer
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", startX + elementWidth / 2)
                .attr("y", startY - 20)
                .text("FRONT 👈");
            
            // Rear pointer
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", startX + (this.data.length - 1) * elementWidth + elementWidth / 2)
                .attr("y", startY + elementHeight + 30)
                .text("REAR 👈");
        }
    }

    renderLinkedList() {
        const nodeWidth = 80;
        const nodeHeight = 50;
        const nodeSpacing = 120;
        const startX = 50;
        const startY = this.height / 2 - nodeHeight / 2;
        
        // Clear previous elements
        this.elementGroup.selectAll("*").remove();
        this.labelGroup.selectAll("*").remove();
        this.pointerGroup.selectAll("*").remove();
        this.containerGroup.selectAll("*").remove();
        
        // Draw nodes
        const nodes = this.elementGroup
            .selectAll(".ds-element")
            .data(this.data);

        const nodeEnter = nodes.enter()
            .append("g")
            .attr("class", "ds-element");

        // Data part
        nodeEnter.append("rect")
            .attr("width", nodeWidth * 0.7)
            .attr("height", nodeHeight)
            .attr("fill", this.colors.default)
            .attr("stroke", "#2c3e50")
            .attr("stroke-width", 2);

        // Pointer part
        nodeEnter.append("rect")
            .attr("x", nodeWidth * 0.7)
            .attr("width", nodeWidth * 0.3)
            .attr("height", nodeHeight)
            .attr("fill", this.colors.pointer)
            .attr("stroke", "#2c3e50")
            .attr("stroke-width", 2);

        nodeEnter.append("text")
            .attr("class", "ds-text")
            .attr("x", nodeWidth * 0.35)
            .attr("y", nodeHeight / 2)
            .text(d => d.value || d);

        // Pointer arrow
        nodeEnter.append("text")
            .attr("class", "ds-text")
            .attr("x", nodeWidth * 0.85)
            .attr("y", nodeHeight / 2)
            .attr("fill", "white")
            .text("→");

        nodes.merge(nodeEnter)
            .attr("transform", (d, i) => 
                `translate(${startX + i * nodeSpacing}, ${startY})`);

        nodes.exit().remove();
        
        // Draw pointer lines
        this.pointerGroup.selectAll("*").remove();
        for (let i = 0; i < this.data.length - 1; i++) {
            this.pointerGroup.append("line")
                .attr("class", "ds-pointer")
                .attr("x1", startX + i * nodeSpacing + nodeWidth)
                .attr("y1", startY + nodeHeight / 2)
                .attr("x2", startX + (i + 1) * nodeSpacing)
                .attr("y2", startY + nodeHeight / 2);
        }
        
        // Add labels
        this.labelGroup.append("text")
            .attr("class", "ds-label")
            .attr("x", this.width / 2)
            .attr("y", 30)
            .text("🔗 Linked List")
            .style("font-size", "16px");
        
        if (this.data.length > 0) {
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", startX + nodeWidth / 2)
                .attr("y", startY - 20)
                .text("HEAD");
            
            // NULL pointer for last node
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", startX + (this.data.length - 1) * nodeSpacing + nodeWidth + 20)
                .attr("y", startY + nodeHeight / 2)
                .text("NULL");
        }
    }

    renderHashTable() {
        const bucketWidth = 80;
        const bucketHeight = 40;
        const bucketsPerRow = 8;
        const startX = 50;
        const startY = 100;
        
        // Clear previous elements
        this.elementGroup.selectAll("*").remove();
        this.labelGroup.selectAll("*").remove();
        this.containerGroup.selectAll("*").remove();
        
        // Create hash table structure (assuming 16 buckets)
        const numBuckets = 16;
        const buckets = Array(numBuckets).fill().map((_, i) => ({
            index: i,
            items: this.data.filter(item => this.hash(item.key || item) === i)
        }));
        
        // Draw buckets
        buckets.forEach((bucket, i) => {
            const row = Math.floor(i / bucketsPerRow);
            const col = i % bucketsPerRow;
            const x = startX + col * (bucketWidth + 10);
            const y = startY + row * (bucketHeight + 60);
            
            // Bucket container
            this.containerGroup.append("rect")
                .attr("class", "ds-container")
                .attr("x", x)
                .attr("y", y)
                .attr("width", bucketWidth)
                .attr("height", bucketHeight)
                .attr("fill", bucket.items.length > 0 ? "#ecf0f1" : "#f8f9fa");
            
            // Bucket index
            this.labelGroup.append("text")
                .attr("class", "ds-label")
                .attr("x", x + bucketWidth / 2)
                .attr("y", y - 5)
                .text(i.toString())
                .style("font-weight", "bold");
            
            // Items in bucket (chaining)
            bucket.items.forEach((item, itemIndex) => {
                const itemGroup = this.elementGroup.append("g")
                    .attr("class", "ds-element")
                    .attr("transform", `translate(${x + 5}, ${y + bucketHeight + 10 + itemIndex * 25})`);
                
                itemGroup.append("rect")
                    .attr("width", bucketWidth - 10)
                    .attr("height", 20)
                    .attr("fill", this.colors.default)
                    .attr("stroke", "#2c3e50")
                    .attr("stroke-width", 1);
                
                itemGroup.append("text")
                    .attr("class", "ds-text")
                    .attr("x", (bucketWidth - 10) / 2)
                    .attr("y", 12)
                    .attr("fill", "white")
                    .style("font-size", "10px")
                    .text(item.key || item);
            });
        });
        
        // Add labels
        this.labelGroup.append("text")
            .attr("class", "ds-label")
            .attr("x", this.width / 2)
            .attr("y", 30)
            .text("🗂️ Hash Table (with Chaining)")
            .style("font-size", "16px");
    }

    hash(key) {
        // Simple hash function for demonstration
        let hash = 0;
        const str = key.toString();
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
        }
        return Math.abs(hash) % 16;
    }

    highlight(index, state = 'highlight') {
        this.elementGroup.selectAll(".ds-element")
            .select("rect")
            .attr("fill", (d, i) => i === index ? this.colors[state] : this.colors.default);
    }

    push(value) {
        // Handle both direct calls and step-based calls
        const actualValue = value?.value || value;
        this.data.push(actualValue);
        this.render();
        this.highlight(this.data.length - 1, 'new');
    }

    pop() {
        if (this.data.length > 0) {
            this.highlight(this.data.length - 1, 'removed');
            setTimeout(() => {
                this.data.pop();
                this.render();
            }, 500);
        }
    }

    enqueue(value) {
        // Handle both direct calls and step-based calls
        const actualValue = value?.value || value;
        this.data.push(actualValue);
        this.render();
        this.highlight(this.data.length - 1, 'new');
    }

    dequeue() {
        if (this.data.length > 0) {
            this.highlight(0, 'removed');
            setTimeout(() => {
                this.data.shift();
                this.render();
            }, 500);
        }
    }

    peek() {
        if (this.data.length > 0) {
            // Highlight the top/front element based on data structure type
            const index = this.type === 'queue' ? 0 : this.data.length - 1;
            this.highlight(index, 'highlight');
            
            // Clear highlight after a brief moment
            setTimeout(() => {
                this.clearHighlights();
            }, 1000);
        }
    }

    insert(value, position = null) {
        if (position !== null && position >= 0 && position <= this.data.length) {
            this.data.splice(position, 0, value);
        } else {
            this.data.push(value);
        }
        this.render();
        this.highlight(position || this.data.length - 1, 'new');
    }

    remove(position) {
        if (position >= 0 && position < this.data.length) {
            this.highlight(position, 'removed');
            setTimeout(() => {
                this.data.splice(position, 1);
                this.render();
            }, 500);
        }
    }

    clearHighlights() {
        this.elementGroup.selectAll(".ds-element")
            .select("rect")
            .attr("fill", this.colors.default);
    }

    updateHighlights() {
        // Re-render to update highlights
        this.render();
    }

    // Method to update data from step information
    updateFromStep(step) {
        if (step.stack) {
            this.data = [...step.stack];
            this.type = 'stack';
        } else if (step.queue) {
            this.data = [...step.queue];
            this.type = 'queue';
        } else if (step.list) {
            this.data = [...step.list];
            this.type = 'linked-list';
        } else if (step.hashTable) {
            this.data = [...step.hashTable];
            this.type = 'hash-table';
        }
        this.render();
    }

    reset() {
        this.data = [];
        this.render();
    }

    resize() {
        const container = this.svg.node().parentElement;
        this.width = container.clientWidth || 800;
        this.height = container.clientHeight || 600;
        
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", `0 0 ${this.width} ${this.height}`);
        
        this.render();
    }
}

// Dynamic Programming Grid Visualizer
class DPGridVisualizer extends BaseVisualizer {
    constructor(canvas) {
        super(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = 8;
        this.cols = 8;
        this.cellSize = 40;
        this.grid = [];

        this.setupCanvas();
        this.initializeGrid();
        this.addSampleData(); // Add sample data for demonstration
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

    addSampleData() {
        // Add sample data for demonstration (Fibonacci-like pattern)
        for (let i = 0; i < Math.min(5, this.rows); i++) {
            for (let j = 0; j < Math.min(5, this.cols); j++) {
                if (i === 0 || j === 0) {
                    this.grid[i][j].value = 1;
                    this.grid[i][j].isCalculated = true;
                } else if (i <= 2 && j <= 2) {
                    this.grid[i][j].value = this.grid[i-1][j].value + this.grid[i][j-1].value;
                    this.grid[i][j].isCalculated = true;
                }
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