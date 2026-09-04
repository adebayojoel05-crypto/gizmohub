// ============================================================
// GizmoHub - Newsletter Form Handler
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initNewsletterForms();
});

function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput?.value;
            
            if (email && email.includes('@')) {
                // Success
                showNotification('Thanks for subscribing! Check your inbox for confirmation.');
                emailInput.value = '';
                
                // Change button temporarily
                const btn = form.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                btn.style.background = '#22c55e';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    });
}