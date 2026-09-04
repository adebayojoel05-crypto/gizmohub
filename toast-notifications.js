/**
 * Toast Notifications System
 * Professional, non-intrusive notifications
 */
(function() {
    const CONTAINER_ID = 'toastContainer';
    let toasts = [];
    let counter = 0;

    const TOAST_TYPES = {
        success: { icon: 'fa-check-circle', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
        error: { icon: 'fa-times-circle', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
        warning: { icon: 'fa-exclamation-circle', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        info: { icon: 'fa-info-circle', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
    };

    function createContainer() {
        if (document.getElementById(CONTAINER_ID)) return;
        
        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    function createToast(message, options = {}) {
        const { type = 'info', duration = 4000, action = null, dismissible = true } = options;
        const config = TOAST_TYPES[type] || TOAST_TYPES.info;
        const id = ++counter;

        createContainer();
        const container = document.getElementById(CONTAINER_ID);

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = `toast-${id}`;
        toast.dataset.id = id;
        toast.innerHTML = `
            <div class="toast-icon" style="background: ${config.bg};">
                <i class="fas ${config.icon}" style="color: ${config.color};"></i>
            </div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
                ${action ? `<button class="toast-action" data-action='${JSON.stringify(action)}'>${action.label}</button>` : ''}
            </div>
            ${dismissible ? '<button class="toast-close" aria-label="Dismiss"><i class="fas fa-times"></i></button>' : ''}
            <div class="toast-progress" style="background: ${config.color};"></div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto dismiss
        if (duration > 0) {
            const progress = toast.querySelector('.toast-progress');
            if (progress) {
                progress.style.transition = `width ${duration}ms linear`;
                requestAnimationFrame(() => progress.style.width = '0%');
            }
            
            setTimeout(() => removeToast(id), duration);
        }

        // Dismiss button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => removeToast(id));
        }

        // Action button
        if (action) {
            const actionBtn = toast.querySelector('.toast-action');
            if (actionBtn && action.callback) {
                actionBtn.addEventListener('click', () => {
                    action.callback();
                    removeToast(id);
                });
            }
        }

        return id;
    }

    function removeToast(id) {
        const toast = document.getElementById(`toast-${id}`);
        if (!toast) return;

        toast.classList.remove('show');
        toast.classList.add('hide');
        
        setTimeout(() => {
            toast.remove();
            toasts = toasts.filter(t => t.id !== id);
        }, 300);
    }

    function removeAllToasts() {
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
            container.querySelectorAll('.toast').forEach(toast => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            });
        }
        toasts = [];
    }

    // Public API
    window.Toast = {
        show: (message, options) => createToast(message, options),
        success: (message, options) => createToast(message, { ...options, type: 'success' }),
        error: (message, options) => createToast(message, { ...options, type: 'error' }),
        warning: (message, options) => createToast(message, { ...options, type: 'warning' }),
        info: (message, options) => createToast(message, { ...options, type: 'info' }),
        remove: removeToast,
        removeAll: removeAllToasts
    };

    // Also expose simpler functions
    window.showToast = (message, type = 'info') => createToast(message, { type });
    window.showNotification = window.showToast;

})();
