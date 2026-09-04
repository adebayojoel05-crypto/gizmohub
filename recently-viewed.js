/**
 * Recently Viewed Products
 * Tracks and displays recently viewed products
 */
(function() {
    const STORAGE_KEY = 'gizmohub_recently_viewed';
    const MAX_ITEMS = 8;

    function getRecentlyViewed() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveRecentlyViewed(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function addToRecentlyViewed(product) {
        let items = getRecentlyViewed();
        
        // Remove if already exists
        items = items.filter(item => item.id !== product.id);
        
        // Add to beginning
        items.unshift({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
        });
        
        // Limit to max items
        items = items.slice(0, MAX_ITEMS);
        
        saveRecentlyViewed(items);
        return items;
    }

    function createRecentlyViewedSection() {
        const section = document.createElement('section');
        section.className = 'recently-viewed';
        section.id = 'recentlyViewedSection';
        section.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-history"></i> Recently Viewed</h2>
                </div>
                <div class="recently-viewed-grid" id="recentlyViewedGrid">
                    <!-- Products will be inserted here -->
                </div>
            </div>
        `;
        return section;
    }

    function renderRecentlyViewed() {
        const items = getRecentlyViewed();
        const section = document.getElementById('recentlyViewedSection');
        const grid = document.getElementById('recentlyViewedGrid');
        
        if (!grid || items.length === 0) return;
        
        grid.innerHTML = items.map(item => `
            <a href="shop.html?product=${item.id}" class="recently-item">
                <div class="recently-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100/1f2444/666?text=${encodeURIComponent(item.name)}'">
                </div>
                <div class="recently-info">
                    <h4>${item.name}</h4>
                    <span class="recently-price">$${item.price.toLocaleString()}</span>
                </div>
            </a>
        `).join('');
    }

    function init() {
        // Track when a product is viewed from quick view
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('.quick-btn');
            if (quickViewBtn) {
                const productId = parseInt(quickViewBtn.dataset.productId);
                const product = window.products?.find(p => p.id === productId);
                if (product) {
                    addToRecentlyViewed(product);
                    setTimeout(renderRecentlyViewed, 500);
                }
            }
        });

        // Add recently viewed section after featured products on home page
        if (window.location.pathname.includes('index') || window.location.pathname === '/') {
            const featured = document.querySelector('.featured-products');
            if (featured) {
                const section = createRecentlyViewedSection();
                featured.parentNode.insertBefore(section, featured.nextSibling);
                
                // Render after a short delay to ensure products are loaded
                setTimeout(renderRecentlyViewed, 1000);
            }
        }
    }

    // Expose for external use
    window.addToRecentlyViewed = addToRecentlyViewed;
    window.getRecentlyViewed = getRecentlyViewed;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
