/**
 * Theme Toggle - Dark/Light Mode
 * Per better-ui: suppress transitions during theme swap
 */
(function() {
    const THEME_KEY = 'gizmohub_theme';
    const THEMES = {
        dark: 'dark',
        light: 'light'
    };

    function getTheme() {
        return localStorage.getItem(THEME_KEY) || THEMES.dark;
    }

    function setTheme(theme) {
        // Per better-ui: Suppress transitions on theme switch
        const style = document.createElement('style');
        style.id = 'theme-transition-override';
        style.appendChild(document.createTextNode('*,*::before,*::after{transition:none !important}'));
        document.head.appendChild(style);

        // Force reflow
        document.documentElement.offsetHeight;

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        updateToggleIcon(theme);

        // Restore transitions on next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                style.remove();
            });
        });
    }

    function updateToggleIcon(theme) {
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                if (theme === THEMES.light) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    toggle.setAttribute('aria-label', 'Switch to dark mode');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    toggle.setAttribute('aria-label', 'Switch to light mode');
                }
            }
        });
    }

    function toggleTheme() {
        const current = getTheme();
        const next = current === THEMES.dark ? THEMES.light : THEMES.dark;
        setTheme(next);
        
        if (window.Toast) {
            window.Toast.info(`Switched to ${next} mode`, { duration: 2000 });
        }
    }

    function createToggle() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = '<i class="fas fa-sun"></i>';
        button.addEventListener('click', toggleTheme);
        return button;
    }

    function init() {
        // Apply saved theme
        const theme = getTheme();
        document.documentElement.setAttribute('data-theme', theme);

        // Create and insert theme toggle button into header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            const existing = headerActions.querySelector('.theme-toggle');
            if (!existing) {
                const toggle = createToggle();
                // Insert before cart icon
                const cartIcon = headerActions.querySelector('.cart-icon');
                if (cartIcon) {
                    headerActions.insertBefore(toggle, cartIcon);
                } else {
                    headerActions.appendChild(toggle);
                }
            }
            updateToggleIcon(theme);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
