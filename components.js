// ============================================================
// GizmoHub - Components JavaScript
// Search, Auth Modal, Catalog
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initAuth();
});

// ============================================================
// Search Functionality
// ============================================================
function initSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchClose = document.getElementById('searchClose');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchResults = document.getElementById('searchResults');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchNoResults = document.getElementById('searchNoResults');
    const searchTags = document.querySelectorAll('.search-tag');

    let isSearchOpen = false;

    // Open search on click
    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
        btn.addEventListener('click', openSearch);
    });

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape' && isSearchOpen) {
            closeSearch();
        }
    });

    function openSearch() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
        isSearchOpen = true;
    }

    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isSearchOpen = false;
        resetSearch();
    }

    function resetSearch() {
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchSuggestions.style.display = 'block';
        searchEmpty.style.display = 'flex';
        searchNoResults.style.display = 'none';
    }

    // Event listeners
    searchClose?.addEventListener('click', closeSearch);
    searchOverlay?.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });

    searchClear?.addEventListener('click', () => {
        searchInput.value = '';
        resetSearch();
        searchInput.focus();
    });

    // Search input handler
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length === 0) {
            resetSearch();
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Search tags click
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const text = tag.textContent;
            searchInput.value = text;
            performSearch(text);
        });
    });

    function performSearch(query) {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );

        searchSuggestions.style.display = 'none';
        searchEmpty.style.display = 'none';

        if (filtered.length > 0) {
            searchNoResults.style.display = 'none';
            searchResults.style.display = 'block';
            searchResults.innerHTML = `
                <div class="search-section-title">${filtered.length} Result${filtered.length > 1 ? 's' : ''}</div>
                <div class="search-results-grid">
                    ${filtered.slice(0, 6).map(product => `
                        <a href="#" class="search-result-item" data-id="${product.id}">
                            <div class="result-image">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="result-info">
                                <span class="result-category">${product.category}</span>
                                <h4 class="result-name">${product.name}</h4>
                                <div class="result-price">
                                    <span class="price-current">$${product.price}</span>
                                    ${product.originalPrice > product.price ? 
                                        `<span class="price-original">$${product.originalPrice}</span>` : ''}
                                </div>
                            </div>
                            <button class="result-add" aria-label="Add to cart" onclick="event.preventDefault(); addToCart(${product.id});">
                                <i class="fas fa-plus"></i>
                            </button>
                        </a>
                    `).join('')}
                </div>
                ${filtered.length > 6 ? `<div class="search-more">View all ${filtered.length} results</div>` : ''}
            `;
        } else {
            searchResults.style.display = 'none';
            searchNoResults.style.display = 'flex';
        }
    }
}

// ============================================================
// Auth Modal Functionality
// ============================================================
function initAuth() {
    const authOverlay = document.getElementById('authOverlay');
    const authClose = document.getElementById('authClose');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form-container');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const signupFormEl = document.getElementById('signupFormEl');
    const signinFormEl = document.getElementById('signinFormEl');
    const passwordStrength = document.getElementById('passwordStrength');

    let isAuthOpen = false;

    // Open auth modal
    document.querySelectorAll('[data-auth-trigger]').forEach(btn => {
        btn.addEventListener('click', openAuth);
    });

    function openAuth(tab = 'signin') {
        authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isAuthOpen = true;
        switchAuthTab(tab);
    }

    function closeAuth() {
        authOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isAuthOpen = false;
    }

    // Event listeners
    authClose?.addEventListener('click', closeAuth);
    authOverlay?.addEventListener('click', (e) => {
        if (e.target === authOverlay) closeAuth();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isAuthOpen) closeAuth();
    });

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    function switchAuthTab(tabName) {
        authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        authForms.forEach(f => f.classList.toggle('active', f.id === `${tabName}Form`));
    }

    // Password visibility toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('i');
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    });

    // Password strength indicator
    const signupPassword = document.getElementById('signupPassword');
    signupPassword?.addEventListener('input', (e) => {
        const strength = calculatePasswordStrength(e.target.value);
        updatePasswordStrength(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    }

    function updatePasswordStrength(strength) {
        if (!passwordStrength) return;
        const bars = passwordStrength.querySelectorAll('.strength-bar span');
        const text = passwordStrength.querySelector('.strength-text');
        const levels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

        bars.forEach((bar, i) => {
            bar.style.backgroundColor = i < strength ? colors[strength - 1] : 'var(--border-color)';
        });
        
        text.textContent = strength > 0 ? levels[strength - 1] : 'Password strength';
        text.style.color = strength > 0 ? colors[strength - 1] : 'var(--text-muted)';
    }

    // Form submissions
    signinFormEl?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Welcome back! Login successful.');
        closeAuth();
    });

    signupFormEl?.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if (password !== confirm) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        showNotification('Account created successfully! Welcome to GizmoHub.');
        closeAuth();
    });
}

// ============================================================
// Notification Helper
// ============================================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 24px;
                right: 24px;
                padding: 14px 24px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                z-index: 2000;
                animation: slideDown 0.3s ease;
            }
            .notification-success { background: #22c55e; color: white; }
            .notification-error { background: #ef4444; color: white; }
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Expose functions globally
window.openSearch = () => {
    document.getElementById('searchOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
};

window.openAuth = (tab) => {
    document.getElementById('authOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
};
