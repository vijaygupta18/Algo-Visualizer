/**
 * Utility Helper Functions
 * Common utility functions used throughout the DSA Visualizer
 */

class Helpers {
    // Array utilities
    static generateRandomArray(size = 20, min = 10, max = 300) {
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return array;
    }

    static generateSortedArray(size = 20, min = 10, max = 300) {
        const array = this.generateRandomArray(size, min, max);
        return array.sort((a, b) => a - b);
    }

    static generateReverseSortedArray(size = 20, min = 10, max = 300) {
        const array = this.generateRandomArray(size, min, max);
        return array.sort((a, b) => b - a);
    }

    static generateNearlySortedArray(size = 20, min = 10, max = 300) {
        const array = this.generateSortedArray(size, min, max);
        // Swap a few random elements
        const swaps = Math.floor(size * 0.1); // 10% of elements
        for (let i = 0; i < swaps; i++) {
            const idx1 = Math.floor(Math.random() * size);
            const idx2 = Math.floor(Math.random() * size);
            [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
        }
        return array;
    }

    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static parseArrayInput(input) {
        try {
            const numbers = input
                .split(/[,\s]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0)
                .map(s => {
                    const num = parseFloat(s);
                    if (isNaN(num)) throw new Error(`Invalid number: ${s}`);
                    return Math.max(1, Math.min(1000, Math.floor(num))); // Clamp between 1-1000
                });
            
            if (numbers.length === 0) {
                throw new Error('No valid numbers found');
            }
            
            return numbers;
        } catch (error) {
            throw new Error(`Invalid input: ${error.message}`);
        }
    }

    // String utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    static kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    static formatAlgorithmName(algorithmId) {
        return algorithmId
            .split('-')
            .map(word => this.capitalize(word))
            .join(' ');
    }

    // Time utilities
    static formatTime(milliseconds) {
        if (milliseconds < 1000) {
            return `${milliseconds}ms`;
        } else if (milliseconds < 60000) {
            return `${(milliseconds / 1000).toFixed(1)}s`;
        } else {
            const minutes = Math.floor(milliseconds / 60000);
            const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
            return `${minutes}m ${seconds}s`;
        }
    }

    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // DOM utilities
    static createElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    static removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static scrollToElement(element, behavior = 'smooth') {
        element.scrollIntoView({ behavior, block: 'center' });
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static interpolateColor(color1, color2, factor) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
        
        return this.rgbToHex(r, g, b);
    }

    static getContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    // Math utilities
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Validation utilities
    static isValidNumber(value) {
        return !isNaN(value) && isFinite(value);
    }

    static isValidArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
    }

    static isValidArraySize(size) {
        return this.isValidNumber(size) && size >= 1 && size <= 1000;
    }

    // Local storage utilities
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }

    static removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
            return false;
        }
    }

    // URL utilities
    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    static setQueryParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }

    static removeQueryParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }

    // Performance utilities
    static measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    static createPerformanceMarker(name) {
        if (performance.mark) {
            performance.mark(name);
        }
    }

    static measureBetweenMarkers(startMark, endMark, measureName) {
        if (performance.measure) {
            performance.measure(measureName, startMark, endMark);
        }
    }

    // Animation utilities
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static easeIn(t) {
        return t * t;
    }

    static easeOut(t) {
        return t * (2 - t);
    }

    static animate(duration, callback, easing = this.easeInOut) {
        const start = performance.now();
        
        function frame(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            
            callback(easedProgress, progress);
            
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }
        
        requestAnimationFrame(frame);
    }

    // Error handling utilities
    static createError(message, type = 'Error') {
        const error = new Error(message);
        error.name = type;
        return error;
    }

    static handleError(error, context = '') {
        console.error(`Error${context ? ` in ${context}` : ''}:`, error);
        
        // You could extend this to send errors to a logging service
        if (window.app && window.app.showNotification) {
            window.app.showNotification(
                `An error occurred${context ? ` in ${context}` : ''}: ${error.message}`,
                'error'
            );
        }
    }

    // Deep clone utility
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    // Object utilities
    static isEmpty(obj) {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    static pick(obj, keys) {
        const result = {};
        keys.forEach(key => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });
        return result;
    }

    static omit(obj, keys) {
        const result = { ...obj };
        keys.forEach(key => {
            delete result[key];
        });
        return result;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}

// Make available globally
window.Helpers = Helpers; 