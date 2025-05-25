/**
 * Theme Manager Module
 * Handles light/dark theme switching and persistence
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'dsa-visualizer-theme';
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.setupSystemThemeDetection();
        this.applyTheme(this.currentTheme);
    }

    loadSavedTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem(this.storageKey);
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Check system preference
            this.currentTheme = this.getSystemTheme();
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setupSystemThemeDetection() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem(this.storageKey)) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme, false); // Don't save to localStorage
                }
            });
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    setTheme(theme, saveToStorage = true) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        
        if (saveToStorage) {
            localStorage.setItem(this.storageKey, theme);
        }
        
        this.updateThemeToggleIcon();
        this.notifyThemeChange(theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };
        
        metaThemeColor.content = colors[theme] || colors.light;
    }

    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            themeToggle.title = `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} theme`;
        }
    }

    notifyThemeChange(theme) {
        // Update CodeMirror theme if it exists
        if (window.app && window.app.codeEditor) {
            const cmTheme = theme === 'dark' ? 'monokai' : 'default';
            window.app.codeEditor.setOption('theme', cmTheme);
        }
        
        // Notify other components
        if (window.app && window.app.visualizer) {
            // Re-render visualizations to apply new theme colors
            if (typeof window.app.visualizer.render === 'function') {
                window.app.visualizer.render();
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    isLightTheme() {
        return this.currentTheme === 'light';
    }

    // Get theme-aware colors for visualizations
    getThemeColors() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        return {
            primary: computedStyle.getPropertyValue('--primary-color').trim(),
            secondary: computedStyle.getPropertyValue('--secondary-color').trim(),
            accent: computedStyle.getPropertyValue('--accent-color').trim(),
            success: computedStyle.getPropertyValue('--success-color').trim(),
            warning: computedStyle.getPropertyValue('--warning-color').trim(),
            error: computedStyle.getPropertyValue('--error-color').trim(),
            bgPrimary: computedStyle.getPropertyValue('--bg-primary').trim(),
            bgSecondary: computedStyle.getPropertyValue('--bg-secondary').trim(),
            bgTertiary: computedStyle.getPropertyValue('--bg-tertiary').trim(),
            textPrimary: computedStyle.getPropertyValue('--text-primary').trim(),
            textSecondary: computedStyle.getPropertyValue('--text-secondary').trim(),
            borderColor: computedStyle.getPropertyValue('--border-color').trim()
        };
    }

    // Preset theme configurations
    getPresetThemes() {
        return {
            light: {
                name: 'Light',
                description: 'Clean light theme for better visibility',
                colors: {
                    primary: '#2563eb',
                    background: '#ffffff',
                    text: '#1e293b'
                }
            },
            dark: {
                name: 'Dark',
                description: 'Easy on the eyes dark theme',
                colors: {
                    primary: '#3b82f6',
                    background: '#0f172a',
                    text: '#f1f5f9'
                }
            },
            auto: {
                name: 'Auto',
                description: 'Follows system preference',
                colors: null // Dynamic based on system
            }
        };
    }

    // Apply custom theme (for future extensibility)
    applyCustomTheme(themeConfig) {
        if (!themeConfig || !themeConfig.colors) return;
        
        const root = document.documentElement;
        
        Object.entries(themeConfig.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
        
        this.notifyThemeChange('custom');
    }

    // Reset to default theme
    resetTheme() {
        localStorage.removeItem(this.storageKey);
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme, false);
    }

    // Export current theme settings
    exportTheme() {
        return {
            theme: this.currentTheme,
            colors: this.getThemeColors(),
            timestamp: new Date().toISOString()
        };
    }

    // Animation preferences
    respectsReducedMotion() {
        return window.matchMedia && 
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // High contrast mode detection
    prefersHighContrast() {
        return window.matchMedia && 
               window.matchMedia('(prefers-contrast: high)').matches;
    }

    // Apply accessibility preferences
    applyAccessibilityPreferences() {
        const root = document.documentElement;
        
        if (this.respectsReducedMotion()) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }
        
        if (this.prefersHighContrast()) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
    }

    destroy() {
        // Clean up event listeners if needed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.removeEventListener('click', this.toggleTheme);
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} 