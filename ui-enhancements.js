// ============================================================
// GizmoHub - UI Enhancements
// Scroll to top, scroll progress, lazy enhancements
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollToTop();
    initScrollProgress();
});

// ============================================================
// Scroll To Top Button
// ============================================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
    
    // Show/hide based on scroll position
    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// Scroll Progress Indicator
// ============================================================
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = percent + '%';
    };
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// ============================================================
// Header shadow on scroll
// ============================================================
const header = document.querySelector('.header');
if (header) {
    const updateHeader = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader();
}

// ============================================================
// Intersection Observer for fade-in animations
// ============================================================
const animatedElements = document.querySelectorAll('.section, .category-card, .product-card, .featured-card, .testimonial-card, .blog-card');
if ('IntersectionObserver' in window) {
    animatedElements.forEach(el => {
        el.classList.add('fade-in-ready');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => observer.observe(el));
}