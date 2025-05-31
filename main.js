/**
 * LyricsX Landing Page JavaScript
 * Handles clipboard functionality and theme detection
 */

document.addEventListener('DOMContentLoaded', function() {
    // Theme detection and initialization
    initializeTheme();
    
    // Clipboard functionality
    initializeClipboard();
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();
});

/**
 * Initialize theme based on user's system preference
 */
function initializeTheme() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const body = document.body;
    
    // Set theme based on system preference
    if (!prefersDarkMode) {
        body.classList.add('light-theme');
    }
    
    // Listen for changes in system theme preference
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            if (e.matches) {
                body.classList.remove('light-theme');
            } else {
                body.classList.add('light-theme');
            }
        });
    }
    
    // Update CSS custom properties for smooth gradient transitions
    updateGradientColors();
}

/**
 * Update gradient colors based on current theme
 */
function updateGradientColors() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    
    if (isLightTheme) {
        body.style.background = 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)';
    } else {
        body.style.background = 'linear-gradient(135deg, #0A0A0F 0%, #1A1B3A 100%)';
    }
}

/**
 * Initialize clipboard functionality for the Homebrew command
 */
function initializeClipboard() {
    const copyBtn = document.getElementById('copy-btn');
    const brewCommand = document.getElementById('brew-command');
    
    if (!copyBtn || !brewCommand) {
        console.warn('Clipboard elements not found');
        return;
    }
    
    copyBtn.addEventListener('click', async function() {
        try {
            // Use the modern Clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(brewCommand.value);
                showCopyFeedback(copyBtn, 'success');
            } else {
                // Fallback for older browsers or non-secure contexts
                fallbackCopyToClipboard(brewCommand.value);
                showCopyFeedback(copyBtn, 'success');
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            showCopyFeedback(copyBtn, 'error');
        }
    });
}

/**
 * Fallback clipboard function for older browsers
 * @param {string} text - Text to copy to clipboard
 */
function fallbackCopyToClipboard(text) {
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
    } catch (error) {
        throw new Error('Fallback copy failed');
    } finally {
        document.body.removeChild(textArea);
    }
}

/**
 * Show visual feedback when copying to clipboard
 * @param {HTMLElement} button - The copy button element
 * @param {string} status - 'success' or 'error'
 */
function showCopyFeedback(button, status) {
    const originalHTML = button.innerHTML;
    
    if (status === 'success') {
        button.classList.add('copied');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        button.setAttribute('aria-label', 'Copied to clipboard');
    } else {
        button.style.color = '#EF4444';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        button.setAttribute('aria-label', 'Failed to copy');
    }
    
    // Reset button after 2 seconds
    setTimeout(() => {
        button.classList.remove('copied');
        button.style.color = '';
        button.innerHTML = originalHTML;
        button.setAttribute('aria-label', 'Copy to clipboard');
    }, 2000);
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    // Add smooth scrolling behavior to any anchor links (if added in future)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Utility function to check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Add intersection observer for animation on scroll (optional enhancement)
 */
function initializeScrollAnimations() {
    if (prefersReducedMotion()) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards for scroll animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Initialize scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure CSS animations have started
    setTimeout(initializeScrollAnimations, 500);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
        updateGradientColors();
    }, 250);
});

// Export functions for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeClipboard,
        showCopyFeedback,
        fallbackCopyToClipboard
    };
}
