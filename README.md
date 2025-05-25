# DSA Visualizer 🚀

An interactive, comprehensive Data Structures and Algorithms visualizer built with vanilla JavaScript. Explore sorting algorithms, searching techniques, pathfinding algorithms, tree operations, graph algorithms, dynamic programming, and data structures through beautiful, step-by-step animations.

![DSA Visualizer](https://img.shields.io/badge/DSA-Visualizer-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?style=for-the-badge)

## ✨ Features

### 🎯 Algorithm Categories
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
- **Searching Algorithms**: Linear Search, Binary Search, Jump Search, Interpolation Search
- **Pathfinding Algorithms**: Dijkstra's Algorithm, A* Search, BFS Pathfinding, DFS Pathfinding
- **Tree Algorithms**: BST Insertion, BST Search, Inorder/Preorder/Postorder/Level-order Traversals
- **Graph Algorithms**: BFS, DFS, Topological Sort, Strongly Connected Components
- **Dynamic Programming**: Fibonacci, 0/1 Knapsack, LCS, Edit Distance, Coin Change
- **Data Structures**: Stack Operations, Queue Operations, Linked List, Hash Table

### 🎮 Interactive Controls
- **Play/Pause**: Control animation playback
- **Step-by-step**: Move forward/backward through algorithm steps
- **Speed Control**: Adjust animation speed (1x to 10x)
- **Reset**: Return to initial state
- **Fast Forward**: Skip to the end

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Code Viewer**: Syntax-highlighted code with real-time line highlighting
- **Explanations**: Step-by-step explanations and algorithm overviews
- **Complexity Analysis**: Time and space complexity for all cases
- **Statistics**: Real-time tracking of comparisons, swaps, and array accesses

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause animation
- `R` - Reset algorithm
- `←/→` - Step backward/forward
- `F` - Fast forward
- `T` - Toggle theme
- `H` - Show help modal
- `Esc` - Close modals

### 🎨 Visualization Features
- **Smooth Animations**: CSS-powered animations with easing functions
- **Color-coded Elements**: Different colors for comparing, swapping, sorted elements
- **Multiple Visualizers**: Canvas for arrays, SVG for trees/graphs, grids for pathfinding
- **Real-time Updates**: Live code highlighting and step explanations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for CORS compliance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-visualizer.git
   cd dsa-visualizer
   ```

2. **Start a local server**
   
   **Using Python:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Using Node.js:**
   ```bash
   npx serve .
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Quick Start Guide

1. **Choose a Category**: Click on any algorithm category in the top navigation
2. **Select Algorithm**: Pick a specific algorithm from the dropdown
3. **Input Data**: Enter custom numbers or generate random data
4. **Start Visualization**: Click the play button to begin
5. **Explore**: Use controls to step through the algorithm at your own pace

## 📁 Project Structure

```
dsa-visualizer/
├── index.html                 # Main HTML file
├── styles/
│   ├── main.css              # Core styles and layout
│   ├── components.css        # UI component styles
│   └── animations.css        # Animation definitions
├── js/
│   ├── core/
│   │   ├── app.js           # Main application controller
│   │   ├── visualizer.js    # Visualization engine
│   │   └── animation.js     # Animation controller
│   ├── algorithms/
│   │   ├── sorting.js       # Sorting algorithms
│   │   ├── searching.js     # Searching algorithms
│   │   ├── pathfinding.js   # Pathfinding algorithms
│   │   ├── trees.js         # Tree algorithms
│   │   ├── graphs.js        # Graph algorithms
│   │   ├── dynamic-programming.js # DP algorithms
│   │   └── data-structures.js     # Data structure operations
│   ├── ui/
│   │   ├── controls.js      # UI controls and interactions
│   │   ├── theme.js         # Theme management
│   │   └── modal.js         # Modal dialogs
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   └── main.js              # Application entry point
└── README.md
```

## 🏗️ Architecture

### Core Components

1. **DSAVisualizerApp**: Main application controller that coordinates all modules
2. **Visualizer Classes**: Specialized visualizers for different data structures
   - `ArrayVisualizer`: For sorting and searching algorithms
   - `GridVisualizer`: For pathfinding algorithms
   - `TreeVisualizer`: For tree operations
   - `GraphVisualizer`: For graph algorithms
   - `DataStructureVisualizer`: For stacks, queues, linked lists
   - `DPGridVisualizer`: For dynamic programming problems

3. **AnimationController**: Manages step-by-step execution and timing
4. **UI Modules**: Handle user interactions, theming, and modals
5. **Algorithm Implementations**: Pure algorithm logic with step generation

### Design Patterns

- **Module Pattern**: Each component is self-contained with clear interfaces
- **Observer Pattern**: Components communicate through events and callbacks
- **Strategy Pattern**: Different visualizers for different algorithm types
- **Factory Pattern**: Dynamic creation of visualizers based on algorithm category

## 🎨 Customization

### Adding New Algorithms

1. **Create Algorithm Implementation**
   ```javascript
   static newAlgorithm(data) {
       const steps = [];
       // Algorithm logic with step generation
       return { steps, complexity, code, explanation, applications };
   }
   ```

2. **Add to Algorithm Registry**
   ```javascript
   static getImplementation(algorithmId) {
       const implementations = {
           'new-algorithm': this.newAlgorithm,
           // ... existing algorithms
       };
       return implementations[algorithmId];
   }
   ```

3. **Update UI Configuration**
   ```javascript
   this.algorithms = {
       category: [
           { id: 'new-algorithm', name: 'New Algorithm', category: 'category' }
       ]
   };
   ```

### Theming

The application uses CSS custom properties for theming:

```css
:root {
    --primary-color: #2563eb;
    --bg-primary: #ffffff;
    --text-primary: #1e293b;
    /* ... more variables */
}

[data-theme="dark"] {
    --primary-color: #3b82f6;
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
    /* ... dark theme overrides */
}
```

## 🔧 Development

### Code Style
- ES6+ JavaScript with modern features
- Modular architecture with clear separation of concerns
- Comprehensive error handling and logging
- Accessibility-first design

### Performance Optimizations
- Efficient rendering with requestAnimationFrame
- Debounced input handling
- Lazy loading of algorithm implementations
- Memory-conscious data structures

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📚 Educational Value

### Learning Objectives
- **Algorithm Understanding**: Step-by-step visualization helps understand how algorithms work
- **Complexity Analysis**: Visual representation of time and space complexity
- **Code Reading**: Syntax-highlighted code with real-time execution tracking
- **Interactive Learning**: Hands-on exploration with custom inputs

### Use Cases
- **Students**: Learning data structures and algorithms
- **Educators**: Teaching algorithm concepts with visual aids
- **Developers**: Refreshing knowledge or exploring new algorithms
- **Interview Prep**: Understanding algorithm behavior and complexity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Add comprehensive documentation for new features
- Include algorithm complexity analysis
- Test across different browsers and devices
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **D3.js**: For powerful SVG manipulation
- **CodeMirror**: For syntax highlighting and code editing
- **Font Awesome**: For beautiful icons
- **Algorithm Implementations**: Based on classic computer science textbooks and research

## 🐛 Known Issues

- Large datasets (>100 elements) may cause performance issues
- Some animations may not work smoothly on older devices
- Mobile touch interactions could be improved

## 🔮 Future Enhancements

- [ ] More algorithm categories (String algorithms, Number theory)
- [ ] Algorithm comparison mode
- [ ] Export animations as GIF/video
- [ ] Quiz mode for testing understanding
- [ ] Algorithm complexity visualization
- [ ] Multi-language support
- [ ] Collaborative features
- [ ] Algorithm performance benchmarking

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/dsa-visualizer/issues) page
2. Create a new issue with detailed description
3. Join our [Discussions](https://github.com/yourusername/dsa-visualizer/discussions)

---

**Made with ❤️ for the programming community**

*Happy Learning! 🎓* 