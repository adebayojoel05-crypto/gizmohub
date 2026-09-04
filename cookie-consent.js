/**
 * Cookie Consent Banner
 * Displays a GDPR-compliant cookie consent banner
 */
(function() {
    const COOKIE_KEY = 'gizmohub_cookies_accepted';
    const CONSENT_TYPES = {
        necessary: { label: 'Necessary', description: 'Essential for the website to function', checked: true, disabled: true },
        analytics: { label: 'Analytics', description: 'Help us understand how visitors interact', checked: false },
        marketing: { label: 'Marketing', description: 'Used to deliver personalized ads', checked: false }
    };

    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookieBanner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-icon">
                    <i class="fas fa-cookie-bite"></i>
                </div>
                <div class="cookie-text">
                    <h3>We value your privacy</h3>
                    <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn cookie-settings" id="cookieSettings">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                    <button class="cookie-btn cookie-accept" id="cookieAccept">
                        Accept All
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        return banner;
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-settings-modal';
        modal.id = 'cookieSettingsModal';
        modal.innerHTML = `
            <div class="cookie-settings-overlay"></div>
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h3><i class="fas fa-shield-halved"></i> Cookie Preferences</h3>
                    <button class="cookie-settings-close" id="closeCookieSettings">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cookie-settings-body">
                    <p class="cookie-intro">Manage your cookie preferences below. Necessary cookies cannot be disabled as they are required for the website to function.</p>
                    ${Object.entries(CONSENT_TYPES).map(([key, val]) => `
                        <div class="cookie-option ${val.disabled ? 'disabled' : ''}">
                            <label class="cookie-option-info">
                                <input type="checkbox" data-cookie-type="${key}" ${val.checked ? 'checked' : ''} ${val.disabled ? 'disabled' : ''}>
                                <span class="cookie-option-label">${val.label}</span>
                                <span class="cookie-option-desc">${val.description}</span>
                            </label>
                            <div class="cookie-toggle">
                                <div class="toggle-track ${val.checked ? 'active' : ''}">
                                    <div class="toggle-thumb"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cookie-settings-footer">
                    <button class="btn btn-primary" id="saveCookieSettings">
                        Save Preferences
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function showBanner() {
        const banner = document.getElementById('cookieBanner') || createBanner();
        banner.classList.add('show');
    }

    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    function openSettings() {
        const modal = document.getElementById('cookieSettingsModal') || createSettingsModal();
        modal.classList.add('show');
        bindSettingsEvents(modal);
    }

    function closeSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function bindSettingsEvents(modal) {
        const toggles = modal.querySelectorAll('.toggle-track');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        const closeBtn = modal.querySelector('#closeCookieSettings');
        const saveBtn = modal.querySelector('#saveCookieSettings');
        const overlay = modal.querySelector('.cookie-settings-overlay');

        toggles.forEach((toggle, index) => {
            toggle.addEventListener('click', () => {
                const checkbox = checkboxes[index];
                if (!checkbox.disabled) {
                    checkbox.checked = !checkbox.checked;
                    toggle.classList.toggle('active', checkbox.checked);
                }
            });
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const toggle = checkbox.closest('.cookie-option').querySelector('.toggle-track');
                toggle.classList.toggle('active', checkbox.checked);
            });
        });

        closeBtn?.addEventListener('click', closeSettings);
        overlay?.addEventListener('click', closeSettings);
        
        saveBtn?.addEventListener('click', () => {
            const preferences = {};
            checkboxes.forEach(cb => {
                preferences[cb.dataset.cookieType] = cb.checked;
            });
            localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences));
            closeSettings();
            hideBanner();
            showNotification('Cookie preferences saved');
        });
    }

    function acceptAll() {
        const preferences = {};
        Object.keys(CONSENT_TYPES).forEach(key => {
            preferences[key] = true;
        });
        localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences));
        hideBanner();
        showNotification('All cookies accepted');
    }

    function showNotification(message) {
        const existing = document.querySelector('.cookie-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        requestAnimationFrame(() => notification.classList.add('show'));
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function init() {
        const accepted = localStorage.getItem(COOKIE_KEY);
        if (!accepted) {
            setTimeout(showBanner, 1500);
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('#cookieSettings') || e.target.closest('[data-cookie-settings]')) {
                e.preventDefault();
                openSettings();
            }
            if (e.target.closest('#cookieAccept') || e.target.closest('[data-cookie-accept]')) {
                e.preventDefault();
                acceptAll();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
