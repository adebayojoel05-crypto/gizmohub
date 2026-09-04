// ============================================================
// GizmoHub - Top Deals Page
// ============================================================

const topDealsGrid = document.getElementById('topDealsGrid');

document.addEventListener('DOMContentLoaded', () => {
    renderTopDeals();
});

function renderTopDeals() {
    if (!topDealsGrid) return;
    
    // Get products with discounts or bestseller badges
    const dealProducts = products.filter(p => p.discount >= 10 || p.badge === 'bestseller' || p.badge === 'sale');
    
    if (dealProducts.length > 0) {
        topDealsGrid.innerHTML = dealProducts.map(product => createProductCard(product)).join('');
        updateWishlistUI();
    } else {
        topDealsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-tags"></i></div>
                <h3>No Deals Available</h3>
                <p>Check back soon for exciting deals and discounts on your favorite tech products.</p>
            </div>
        `;
    }
}