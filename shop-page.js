// ============================================================
// GizmoHub - Shop Page Logic
// ============================================================

const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');

let currentFilter = 'all';
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupFilters();
    setupSort();
});

function renderProducts() {
    if (!productsGrid) return;
    
    let filtered = currentFilter === 'all' 
        ? [...products] 
        : products.filter(p => p.category === currentFilter);
    
    filtered = sortProducts(filtered);
    
    if (filtered.length > 0) {
        productsGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');
        updateWishlistUI();
    } else {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-search"></i></div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
        `;
    }
}

function sortProducts(list) {
    const sorted = [...list];
    switch (currentSort) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
        default:
            break;
    }
    return sorted;
}

function setupFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });
}

function setupSort() {
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }
}