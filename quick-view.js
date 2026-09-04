// ============================================================
// GizmoHub - Quick View Modal
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initQuickView();
});

function initQuickView() {
    // Create modal if it doesn't exist
    if (!document.getElementById('quickViewModal')) {
        const modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-overlay"></div>
            <div class="quick-view-content">
                <button class="quick-view-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="quick-view-inner">
                    <div class="quick-view-image">
                        <img src="" alt="" id="qvImage">
                        <span class="quick-view-badge" id="qvBadge"></span>
                    </div>
                    <div class="quick-view-info">
                        <span class="quick-view-category" id="qvCategory"></span>
                        <h2 class="quick-view-title" id="qvTitle"></h2>
                        <div class="quick-view-rating" id="qvRating"></div>
                        <div class="quick-view-price" id="qvPrice"></div>
                        <p class="quick-view-description" id="qvDescription"></p>
                        <div class="quick-view-specs" id="qvSpecs"></div>
                        <div class="quick-view-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn qty-minus" onclick="updateQty(-1)"><i class="fas fa-minus"></i></button>
                                <input type="number" id="qvQuantity" value="1" min="1" max="99">
                                <button class="qty-btn qty-plus" onclick="updateQty(1)"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="btn btn-primary btn-lg" id="qvAddCart" onclick="qvAddToCart()">
                                <i class="fas fa-shopping-bag"></i> Add to Cart
                            </button>
                        </div>
                        <div class="quick-view-features">
                            <div class="feature-item"><i class="fas fa-truck"></i> Free Shipping</div>
                            <div class="feature-item"><i class="fas fa-undo"></i> 30-Day Returns</div>
                            <div class="feature-item"><i class="fas fa-shield-alt"></i> 2 Year Warranty</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close handlers
        modal.querySelector('.quick-view-close').addEventListener('click', closeQuickView);
        modal.querySelector('.quick-view-overlay').addEventListener('click', closeQuickView);
    }

    // Attach click handlers to quick view buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-btn');
        if (btn) {
            const card = btn.closest('.product-card');
            if (card) {
                const productId = parseInt(card.dataset.id);
                openQuickView(productId);
            }
        }
    });
}

let currentQVProduct = null;

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentQVProduct = product;
    const modal = document.getElementById('quickViewModal');
    
    // Fill in product data
    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvImage').alt = product.name;
    document.getElementById('qvCategory').textContent = product.category;
    document.getElementById('qvTitle').textContent = product.name;
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvQuantity').value = 1;
    
    // Badge
    const badgeEl = document.getElementById('qvBadge');
    if (product.badge) {
        badgeEl.textContent = product.badge;
        badgeEl.className = `quick-view-badge badge-${product.badge}`;
        badgeEl.style.display = 'block';
    } else {
        badgeEl.style.display = 'none';
    }
    
    // Rating
    const fullStars = Math.floor(product.rating);
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += i < fullStars ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    document.getElementById('qvRating').innerHTML = `
        <span class="stars">${starsHTML}</span>
        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
    `;
    
    // Price
    let priceHTML = `<span class="price-current">$${product.price}</span>`;
    if (product.originalPrice > product.price) {
        priceHTML += `<span class="price-original">$${product.originalPrice}</span>`;
        priceHTML += `<span class="price-discount">Save ${product.discount}%</span>`;
    }
    document.getElementById('qvPrice').innerHTML = priceHTML;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    currentQVProduct = null;
}

function updateQty(delta) {
    const input = document.getElementById('qvQuantity');
    let value = parseInt(input.value) + delta;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    input.value = value;
}

function qvAddToCart() {
    if (!currentQVProduct) return;
    
    const qty = parseInt(document.getElementById('qvQuantity').value) || 1;
    
    for (let i = 0; i < qty; i++) {
        addToCart(currentQVProduct.id);
    }
    
    closeQuickView();
}

// Expose globally
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.updateQty = updateQty;
window.qvAddToCart = qvAddToCart;