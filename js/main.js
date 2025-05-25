/**
 * DSA Visualizer - Main Application Entry Point
 * Initializes and coordinates all application modules
 */

// Global application state
window.app = null;
window.uiControls = null;

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApplication();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showFallbackError();
    }
});

function initializeApplication() {
    console.log('🚀 Initializing DSA Visualizer...');

    // Check for required dependencies
    if (!checkDependencies()) {
        showDependencyError();
        return;
    }

    // Initialize theme first (before any UI rendering)
    if (window.themeManager) {
        console.log('✅ Theme manager initialized');
    }

    // Initialize modal manager
    if (window.modalManager) {
        console.log('✅ Modal manager initialized');
    }

    // Initialize main application
    window.app = new DSAVisualizerApp();
    console.log('✅ Main application initialized');

    // Initialize UI controls
    window.uiControls = new UIControls(window.app);
    console.log('✅ UI controls initialized');

    // Setup global error handling
    setupErrorHandling();

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Setup accessibility features
    setupAccessibility();

    // Setup keyboard shortcuts help
    setupKeyboardShortcuts();

    // Initialize with default algorithm
    initializeDefaultState();

    console.log('🎉 DSA Visualizer initialized successfully!');
    
    // Show welcome message for first-time users
    showWelcomeMessage();
}

function checkDependencies() {
    const requiredGlobals = [
        'CodeMirror',
        'd3',
        'SortingAlgorithms',
        'SearchingAlgorithms',
        'PathfindingAlgorithms',
        'TreeAlgorithms',
        'GraphAlgorithms',
        'DynamicProgrammingAlgorithms',
        'DataStructureAlgorithms'
    ];

    const missing = requiredGlobals.filter(dep => !window[dep]);
    
    if (missing.length > 0) {
        console.error('Missing dependencies:', missing);
        return false;
    }

    return true;
}

function showDependencyError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'dependency-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h2>⚠️ Loading Error</h2>
            <p>Some required components failed to load. Please refresh the page.</p>
            <button onclick="window.location.reload()" class="btn btn-primary">
                Refresh Page
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

function showFallbackError() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: system-ui, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            text-align: center;
            padding: 2rem;
        ">
            <div>
                <h1 style="color: #ef4444; margin-bottom: 1rem;">
                    ⚠️ Application Error
                </h1>
                <p style="margin-bottom: 2rem; max-width: 500px;">
                    The DSA Visualizer failed to initialize. This might be due to a 
                    browser compatibility issue or a network problem.
                </p>
                <button 
                    onclick="window.location.reload()" 
                    style="
                        background: #2563eb;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                    "
                >
                    Refresh Page
                </button>
            </div>
        </div>
    `;
}

function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        if (window.uiControls) {
            window.uiControls.showNotification(
                'An unexpected error occurred. Please refresh the page if problems persist.',
                'error'
            );
        }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        if (window.uiControls) {
            window.uiControls.showNotification(
                'A background operation failed. The application should continue to work normally.',
                'warning'
            );
        }
    });
}

function setupPerformanceMonitoring() {
    // Monitor performance for large datasets
    if (window.app) {
        const originalGenerateSteps = window.app.generateAlgorithmSteps;
        
        window.app.generateAlgorithmSteps = function() {
            const start = performance.now();
            const result = originalGenerateSteps.call(this);
            const end = performance.now();
            
            const duration = end - start;
            if (duration > 1000) { // More than 1 second
                console.warn(`Algorithm step generation took ${duration.toFixed(2)}ms`);
                
                if (window.uiControls) {
                    window.uiControls.showNotification(
                        'Large dataset detected. Animation may be slower than usual.',
                        'info'
                    );
                }
            }
            
            return result;
        };
    }
}

function setupAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main-content';
        main.setAttribute('role', 'main');
    }

    // Announce algorithm changes to screen readers
    if (window.app) {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        // Override algorithm change to announce it
        const originalSetAlgorithm = window.app.setAlgorithm;
        window.app.setAlgorithm = function(algorithmId) {
            originalSetAlgorithm.call(this, algorithmId);
            
            const algorithm = this.findAlgorithmById(algorithmId);
            if (algorithm) {
                announcer.textContent = `Algorithm changed to ${algorithm.name}`;
            }
        };
    }
}

function setupKeyboardShortcuts() {
    // Add keyboard shortcut indicators to buttons
    const shortcuts = {
        'play-pause-btn': 'Space',
        'reset-btn': 'R',
        'step-back-btn': '←',
        'step-forward-btn': '→',
        'fast-forward-btn': 'F',
        'theme-toggle': 'T',
        'help-btn': 'H'
    };

    Object.entries(shortcuts).forEach(([id, key]) => {
        const element = document.getElementById(id);
        if (element) {
            const currentTitle = element.title || '';
            element.title = currentTitle + (currentTitle ? ' ' : '') + `(${key})`;
        }
    });
}

function initializeDefaultState() {
    if (!window.app) return;

    // Set default category and algorithm
    window.app.setCategory('sorting');
    
    // Generate initial random data
    window.app.generateRandomData();
    
    // Update UI to reflect initial state
    window.app.updateUI();
}

function showWelcomeMessage() {
    const hasVisited = Helpers.loadFromLocalStorage('dsa-visualizer-visited', false);
    
    if (!hasVisited && window.modalManager) {
        // Mark as visited
        Helpers.saveToLocalStorage('dsa-visualizer-visited', true);
        
        // Show welcome modal after a short delay
        setTimeout(() => {
            const welcomeModal = window.modalManager.createModal({
                id: 'welcome-modal',
                title: '👋 Welcome to DSA Visualizer!',
                content: `
                    <div class="welcome-content">
                        <p>Explore data structures and algorithms through interactive visualizations.</p>
                        
                        <h4>Quick Start:</h4>
                        <ol>
                            <li>Choose an algorithm category from the top navigation</li>
                            <li>Select a specific algorithm from the dropdown</li>
                            <li>Click <strong>Play</strong> to start the visualization</li>
                            <li>Use the controls to step through the algorithm</li>
                        </ol>
                        
                        <h4>Keyboard Shortcuts:</h4>
                        <ul>
                            <li><kbd>Space</kbd> - Play/Pause</li>
                            <li><kbd>R</kbd> - Reset</li>
                            <li><kbd>←/→</kbd> - Step backward/forward</li>
                            <li><kbd>T</kbd> - Toggle theme</li>
                            <li><kbd>H</kbd> - Show help</li>
                        </ul>
                        
                        <p><em>Press <kbd>H</kbd> anytime to see the help guide.</em></p>
                    </div>
                `,
                buttons: [
                    {
                        text: 'Get Started',
                        class: 'btn-primary',
                        onClick: () => {
                            window.modalManager.removeModal('welcome-modal');
                        }
                    }
                ],
                size: 'large'
            });
            
            window.modalManager.showModal('welcome-modal');
        }, 1000);
    }
}

// Utility functions for debugging and development
window.DSAVisualizer = {
    // Get current application state
    getState() {
        return {
            category: window.app?.currentCategory,
            algorithm: window.app?.currentAlgorithm,
            isPlaying: window.app?.isPlaying,
            currentStep: window.app?.currentStep,
            totalSteps: window.app?.totalSteps,
            data: window.app?.data,
            theme: window.themeManager?.getCurrentTheme()
        };
    },

    // Reset application to initial state
    reset() {
        if (window.app) {
            window.app.reset();
            window.app.generateRandomData();
        }
    },

    // Export current visualization state
    exportState() {
        const state = this.getState();
        const blob = new Blob([JSON.stringify(state, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dsa-visualizer-state-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },

    // Performance diagnostics
    diagnose() {
        console.group('DSA Visualizer Diagnostics');
        console.log('Application State:', this.getState());
        console.log('Performance Timing:', performance.timing);
        console.log('Memory Usage:', performance.memory);
        console.log('Active Event Listeners:', getEventListeners(document));
        console.groupEnd();
    }
};

// Development helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected');
    
    // Add development tools to global scope
    window.dev = {
        app: () => window.app,
        ui: () => window.uiControls,
        theme: () => window.themeManager,
        modal: () => window.modalManager,
        helpers: () => window.Helpers,
        state: () => window.DSAVisualizer.getState(),
        diagnose: () => window.DSAVisualizer.diagnose()
    };
    
    console.log('🛠️ Development tools available via window.dev');
} 