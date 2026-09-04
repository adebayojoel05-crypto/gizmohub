// ============================================================
// GizmoHub - Contact Page
// ============================================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        
        showNotification(`Thanks ${name}! We'll get back to you soon.`);
        contactForm.reset();
    });
}