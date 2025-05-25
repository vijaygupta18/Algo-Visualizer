class OperationBox {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.totalSteps = 0;
        this.operationHistory = [];
        
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="operation-box">
                <div class="operation-header">
                    <h3>What's Happening?</h3>
                    <div class="step-counter">Step <span id="current-step">0</span> of <span id="total-steps">0</span></div>
                </div>
                <div class="operation-content">
                    <div class="current-operation">
                        <div class="operation-title">Current Operation</div>
                        <div class="operation-description" id="current-operation-desc">Click play to start!</div>
                    </div>
                    <div class="operation-details">
                        <div class="operation-title">Why This Step?</div>
                        <div class="operation-explanation" id="operation-explanation">Waiting to start...</div>
                    </div>
                    <div class="operation-stats">
                        <div class="stat-item">
                            <span class="stat-label">Comparisons:</span>
                            <span class="stat-value" id="comparisons-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Swaps:</span>
                            <span class="stat-value" id="swaps-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Array Accesses:</span>
                            <span class="stat-value" id="accesses-count">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .operation-box {
                background: var(--bg-secondary);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin: 20px 0;
                font-family: 'Arial', sans-serif;
            }

            .operation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid var(--border-color);
            }

            .operation-header h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.2em;
            }

            .step-counter {
                background: var(--accent-color);
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9em;
            }

            .operation-content {
                display: grid;
                gap: 15px;
            }

            .current-operation, .operation-details {
                background: var(--bg-primary);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }

            .operation-title {
                font-weight: bold;
                color: var(--text-primary);
                margin-bottom: 8px;
                font-size: 1.1em;
            }

            .operation-description, .operation-explanation {
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .operation-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                background: var(--bg-primary);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }

            .stat-item {
                text-align: center;
            }

            .stat-label {
                display: block;
                font-size: 0.9em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }

            .stat-value {
                font-size: 1.2em;
                font-weight: bold;
                color: var(--accent-color);
            }

            @media (max-width: 768px) {
                .operation-stats {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    updateStep(step, total) {
        this.currentStep = step;
        this.totalSteps = total;
        
        document.getElementById('current-step').textContent = step;
        document.getElementById('total-steps').textContent = total;
    }

    updateOperation(description, explanation) {
        document.getElementById('current-operation-desc').textContent = description;
        document.getElementById('operation-explanation').textContent = explanation;
        
        // Add to history
        this.operationHistory.push({
            step: this.currentStep,
            description,
            explanation
        });
    }

    updateStats(stats) {
        if (stats.comparisons !== undefined) {
            document.getElementById('comparisons-count').textContent = stats.comparisons;
        }
        if (stats.swaps !== undefined) {
            document.getElementById('swaps-count').textContent = stats.swaps;
        }
        if (stats.accesses !== undefined) {
            document.getElementById('accesses-count').textContent = stats.accesses;
        }
    }

    reset() {
        this.currentStep = 0;
        this.totalSteps = 0;
        this.operationHistory = [];
        
        document.getElementById('current-step').textContent = '0';
        document.getElementById('total-steps').textContent = '0';
        document.getElementById('current-operation-desc').textContent = 'Click play to start!';
        document.getElementById('operation-explanation').textContent = 'Waiting to start...';
        document.getElementById('comparisons-count').textContent = '0';
        document.getElementById('swaps-count').textContent = '0';
        document.getElementById('accesses-count').textContent = '0';
    }
} 