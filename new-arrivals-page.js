// ============================================================
// GizmoHub - New Arrivals Page
// ============================================================

const newArrivalsGrid = document.getElementById('newArrivalsGrid');

document.addEventListener('DOMContentLoaded', () => {
    renderNewArrivals();
});

function renderNewArrivals() {
    if (!newArrivalsGrid) return;
    
    const newProducts = products.filter(p => p.isNew);
    
    if (newProducts.length > 0) {
        newArrivalsGrid.innerHTML = newProducts.map(product => createProductCard(product)).join('');
        updateWishlistUI();
    } else {
        newArrivalsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-box-open"></i></div>
                <h3>No New Arrivals Yet</h3>
                <p>We're constantly updating our inventory. Check back soon for the latest tech.</p>
            </div>
        `;
    }
}