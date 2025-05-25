/**
 * Modal Manager Module
 * Handles modal dialogs, overlays, and popup interactions
 */

class ModalManager {
    constructor() {
        this.activeModals = new Set();
        this.init();
    }

    init() {
        this.setupModalTriggers();
        this.setupGlobalKeyHandlers();
        this.setupFocusManagement();
    }

    setupModalTriggers() {
        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showModal('help-modal');
            });
        }

        // Setup close buttons for all modals
        document.querySelectorAll('.modal .close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Setup outside click to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    setupGlobalKeyHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                // Close the most recently opened modal
                const lastModal = Array.from(this.activeModals).pop();
                this.hideModal(lastModal);
            }
        });
    }

    setupFocusManagement() {
        // Trap focus within modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.activeModals.size > 0) {
                const activeModal = document.querySelector('.modal.show');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }

    showModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id "${modalId}" not found`);
            return;
        }

        // Set default options
        const config = {
            closeOnEscape: true,
            closeOnOutsideClick: true,
            trapFocus: true,
            ...options
        };

        // Store the previously focused element
        modal.dataset.previousFocus = document.activeElement?.id || '';

        // Show modal
        modal.classList.add('show');
        this.activeModals.add(modalId);

        // Focus management
        if (config.trapFocus) {
            this.focusFirstElement(modal);
        }

        // Add body class to prevent scrolling
        document.body.classList.add('modal-open');

        // Trigger custom event
        modal.dispatchEvent(new CustomEvent('modalShown', {
            detail: { modalId, config }
        }));

        return modal;
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal || !modal.classList.contains('show')) {
            return;
        }

        // Hide modal
        modal.classList.remove('show');
        this.activeModals.delete(modalId);

        // Remove body class if no modals are open
        if (this.activeModals.size === 0) {
            document.body.classList.remove('modal-open');
        }

        // Restore focus
        const previousFocusId = modal.dataset.previousFocus;
        if (previousFocusId) {
            const previousElement = document.getElementById(previousFocusId);
            if (previousElement) {
                previousElement.focus();
            }
        }

        // Trigger custom event
        modal.dispatchEvent(new CustomEvent('modalHidden', {
            detail: { modalId }
        }));
    }

    hideAllModals() {
        Array.from(this.activeModals).forEach(modalId => {
            this.hideModal(modalId);
        });
    }

    isModalOpen(modalId) {
        return this.activeModals.has(modalId);
    }

    getActiveModals() {
        return Array.from(this.activeModals);
    }

    focusFirstElement(modal) {
        const focusableElements = this.getFocusableElements(modal);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    getFocusableElements(container) {
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])'
        ];

        return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
            .filter(el => {
                return el.offsetWidth > 0 && el.offsetHeight > 0 && 
                       getComputedStyle(el).visibility !== 'hidden';
            });
    }

    trapFocus(event, modal) {
        const focusableElements = this.getFocusableElements(modal);
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Create dynamic modals
    createModal(config) {
        const {
            id,
            title,
            content,
            buttons = [],
            size = 'medium',
            closable = true
        } = config;

        // Check if modal already exists
        if (document.getElementById(id)) {
            console.warn(`Modal with id "${id}" already exists`);
            return null;
        }

        // Create modal structure
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `modal modal-${size}`;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        header.appendChild(titleElement);

        if (closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => this.hideModal(id));
            header.appendChild(closeBtn);
        }

        modalContent.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }

        modalContent.appendChild(body);

        // Footer with buttons
        if (buttons.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'modal-footer';

            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = `btn ${buttonConfig.class || 'btn-secondary'}`;
                button.textContent = buttonConfig.text;
                
                if (buttonConfig.onClick) {
                    button.addEventListener('click', (e) => {
                        buttonConfig.onClick(e, modal);
                    });
                }

                footer.appendChild(button);
            });

            modalContent.appendChild(footer);
        }

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Setup event handlers
        if (closable) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(id);
                }
            });
        }

        return modal;
    }

    // Remove dynamic modal
    removeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.hideModal(modalId);
            modal.remove();
        }
    }

    // Confirmation dialog
    showConfirmDialog(message, options = {}) {
        const config = {
            title: 'Confirm',
            message,
            confirmText: 'OK',
            cancelText: 'Cancel',
            confirmClass: 'btn-primary',
            cancelClass: 'btn-secondary',
            ...options
        };

        return new Promise((resolve) => {
            const modalId = `confirm-modal-${Date.now()}`;
            
            const modal = this.createModal({
                id: modalId,
                title: config.title,
                content: `<p>${config.message}</p>`,
                buttons: [
                    {
                        text: config.cancelText,
                        class: config.cancelClass,
                        onClick: () => {
                            this.removeModal(modalId);
                            resolve(false);
                        }
                    },
                    {
                        text: config.confirmText,
                        class: config.confirmClass,
                        onClick: () => {
                            this.removeModal(modalId);
                            resolve(true);
                        }
                    }
                ]
            });

            this.showModal(modalId);
        });
    }

    // Alert dialog
    showAlert(message, options = {}) {
        const config = {
            title: 'Alert',
            message,
            buttonText: 'OK',
            buttonClass: 'btn-primary',
            ...options
        };

        return new Promise((resolve) => {
            const modalId = `alert-modal-${Date.now()}`;
            
            const modal = this.createModal({
                id: modalId,
                title: config.title,
                content: `<p>${config.message}</p>`,
                buttons: [
                    {
                        text: config.buttonText,
                        class: config.buttonClass,
                        onClick: () => {
                            this.removeModal(modalId);
                            resolve();
                        }
                    }
                ]
            });

            this.showModal(modalId);
        });
    }

    // Input dialog
    showPrompt(message, options = {}) {
        const config = {
            title: 'Input',
            message,
            placeholder: '',
            defaultValue: '',
            confirmText: 'OK',
            cancelText: 'Cancel',
            ...options
        };

        return new Promise((resolve) => {
            const modalId = `prompt-modal-${Date.now()}`;
            
            const content = document.createElement('div');
            content.innerHTML = `
                <p>${config.message}</p>
                <input type="text" class="prompt-input" placeholder="${config.placeholder}" value="${config.defaultValue}">
            `;

            const modal = this.createModal({
                id: modalId,
                title: config.title,
                content: content,
                buttons: [
                    {
                        text: config.cancelText,
                        class: 'btn-secondary',
                        onClick: () => {
                            this.removeModal(modalId);
                            resolve(null);
                        }
                    },
                    {
                        text: config.confirmText,
                        class: 'btn-primary',
                        onClick: () => {
                            const input = modal.querySelector('.prompt-input');
                            const value = input ? input.value : '';
                            this.removeModal(modalId);
                            resolve(value);
                        }
                    }
                ]
            });

            this.showModal(modalId);
            
            // Focus the input
            const input = modal.querySelector('.prompt-input');
            if (input) {
                input.focus();
                input.select();
            }
        });
    }

    destroy() {
        this.hideAllModals();
        this.activeModals.clear();
    }
}

// Initialize modal manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
} 