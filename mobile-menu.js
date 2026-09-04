// ============================================================
// GizmoHub - Mobile Menu
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (!menuBtn || !nav) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menu
    const toggleMenu = (open) => {
        nav.classList.toggle('mobile-open', open);
        overlay.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };
    
    menuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.contains('mobile-open');
        toggleMenu(!isOpen);
        // Toggle icon
        const icon = menuBtn.querySelector('i');
        icon.className = nav.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
    });
    
    overlay.addEventListener('click', () => {
        toggleMenu(false);
        const icon = menuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    });
    
    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('mobile-open')) {
                toggleMenu(false);
                const icon = menuBtn.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });
});