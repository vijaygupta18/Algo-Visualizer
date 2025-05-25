/**
 * UI Controls Module
 * Handles animation controls and user interface interactions
 */

class UIControls {
    constructor(app) {
        this.app = app;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupAnimationControls();
        this.setupInputControls();
        this.setupSpeedControl();
        this.setupTabControls();
        this.setupKeyboardShortcuts();
        
        this.isInitialized = true;
    }

    setupAnimationControls() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.app.togglePlayPause();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.app.reset();
                this.updatePlayPauseButton();
            });
        }

        // Step forward button
        const stepForwardBtn = document.getElementById('step-forward-btn');
        if (stepForwardBtn) {
            stepForwardBtn.addEventListener('click', () => {
                this.app.stepForward();
            });
        }

        // Step back button
        const stepBackBtn = document.getElementById('step-back-btn');
        if (stepBackBtn) {
            stepBackBtn.addEventListener('click', () => {
                this.app.stepBack();
            });
        }

        // Fast forward button
        const fastForwardBtn = document.getElementById('fast-forward-btn');
        if (fastForwardBtn) {
            fastForwardBtn.addEventListener('click', () => {
                this.app.fastForward();
            });
        }
    }

    setupInputControls() {
        // Array input
        const arrayInput = document.getElementById('array-input');
        if (arrayInput) {
            arrayInput.addEventListener('input', (e) => {
                this.app.parseCustomInput(e.target.value);
            });

            arrayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.app.parseCustomInput(e.target.value);
                    this.app.reset();
                }
            });
        }

        // Random button
        const randomBtn = document.getElementById('random-btn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.app.generateRandomData();
            });
        }

        // Array size slider
        const arraySizeSlider = document.getElementById('array-size');
        const sizeDisplay = document.getElementById('size-display');
        
        if (arraySizeSlider && sizeDisplay) {
            arraySizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                sizeDisplay.textContent = size;
            });

            arraySizeSlider.addEventListener('change', (e) => {
                const size = parseInt(e.target.value);
                this.app.generateRandomData(size);
            });
        }
    }

    setupSpeedControl() {
        const speedSlider = document.getElementById('speed-slider');
        const speedDisplay = document.getElementById('speed-display');

        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                speedDisplay.textContent = `${speed}x`;
                
                if (this.app.animationController) {
                    this.app.animationController.setSpeed(speed);
                }
            });
        }
    }

    setupTabControls() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.app.togglePlayPause();
                    break;
                case 'r':
                    e.preventDefault();
                    this.app.reset();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.app.stepBack();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.app.stepForward();
                    break;
                case 'f':
                    e.preventDefault();
                    this.app.fastForward();
                    break;
                case 't':
                    e.preventDefault();
                    if (window.themeManager) {
                        window.themeManager.toggleTheme();
                    }
                    break;
                case 'h':
                    e.preventDefault();
                    this.showHelpModal();
                    break;
                case 'escape':
                    this.closeModals();
                    break;
            }
        });
    }

    notifyPlayPauseChange() {
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const btn = document.getElementById('play-pause-btn');
        const icon = btn?.querySelector('i');
        
        if (!btn || !icon) return;

        if (this.app.isPlaying) {
            btn.classList.remove('play');
            btn.classList.add('pause');
            icon.className = 'fas fa-pause';
            btn.title = 'Pause (Space)';
        } else {
            btn.classList.remove('pause');
            btn.classList.add('play');
            icon.className = 'fas fa-play';
            btn.title = 'Play (Space)';
        }
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

        // Trigger resize for CodeMirror if switching to code tab
        if (tabName === 'code' && this.app.codeEditor) {
            setTimeout(() => {
                this.app.codeEditor.refresh();
            }, 100);
        }
    }

    showHelpModal() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.classList.add('show');
            this.setupModalCloseHandlers(modal);
        }
    }

    setupModalCloseHandlers(modal) {
        const closeBtn = modal.querySelector('.close-btn');
        
        const handleClose = () => {
            modal.classList.remove('show');
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('click', handleOutsideClick);
            if (closeBtn) {
                closeBtn.removeEventListener('click', handleClose);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        const handleOutsideClick = (e) => {
            if (e.target === modal) {
                handleClose();
            }
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', handleClose);
        }
        document.addEventListener('keydown', handleEscape);
        modal.addEventListener('click', handleOutsideClick);
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    updateStats(stats) {
        const elements = {
            'comparisons-count': stats.comparisons || 0,
            'swaps-count': stats.swaps || 0,
            'accesses-count': stats.accesses || 0
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateStepInfo(currentStep, totalSteps) {
        const stepElement = document.getElementById('current-step');
        if (stepElement) {
            stepElement.textContent = `${currentStep}/${totalSteps}`;
        }
    }

    updateExplanation(explanation) {
        const explanationElement = document.getElementById('current-step-explanation');
        if (explanationElement && explanation) {
            explanationElement.textContent = explanation;
        }
    }

    highlightCodeLine(lineNumbers) {
        if (!this.app.codeEditor || !lineNumbers) return;

        // Clear previous highlights
        this.app.codeEditor.getAllMarks().forEach(mark => mark.clear());

        // Highlight new lines
        if (Array.isArray(lineNumbers)) {
            lineNumbers.forEach(lineNum => {
                if (lineNum >= 0 && lineNum < this.app.codeEditor.lineCount()) {
                    this.app.codeEditor.addLineClass(lineNum, 'background', 'code-line-highlight');
                }
            });
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas ${iconMap[type] || iconMap.info}"></i>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto hide
        const hideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideNotification(notification);
        });

        return notification;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text)
                .then(() => {
                    this.showNotification('Copied to clipboard!', 'success');
                })
                .catch(() => {
                    this.fallbackCopyToClipboard(text);
                });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }

        document.body.removeChild(textArea);
    }

    setupCopyCodeButton() {
        const copyBtn = document.getElementById('copy-code-btn');
        if (copyBtn && this.app.codeEditor) {
            copyBtn.addEventListener('click', () => {
                const code = this.app.codeEditor.getValue();
                this.copyToClipboard(code);
            });
        }
    }

    enableControl(controlId) {
        const control = document.getElementById(controlId);
        if (control) {
            control.disabled = false;
            control.classList.remove('disabled');
        }
    }

    disableControl(controlId) {
        const control = document.getElementById(controlId);
        if (control) {
            control.disabled = true;
            control.classList.add('disabled');
        }
    }

    setControlsState(isPlaying, currentStep, totalSteps) {
        // Enable/disable controls based on state
        if (isPlaying) {
            this.disableControl('step-forward-btn');
            this.disableControl('step-back-btn');
            this.disableControl('fast-forward-btn');
        } else {
            this.enableControl('step-forward-btn');
            this.enableControl('step-back-btn');
            this.enableControl('fast-forward-btn');
        }

        // Disable step back if at beginning
        if (currentStep === 0) {
            this.disableControl('step-back-btn');
        }

        // Disable step forward if at end
        if (currentStep >= totalSteps) {
            this.disableControl('step-forward-btn');
            this.disableControl('fast-forward-btn');
        }
    }

    destroy() {
        // Clean up event listeners if needed
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIControls;
} 