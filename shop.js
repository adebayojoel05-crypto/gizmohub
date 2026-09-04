// ============================================================
// GizmoHub - Shared Utility Functions
// ============================================================

// State
let cart = JSON.parse(localStorage.getItem('gizmoCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('gizmoWishlist')) || [];

// DOM Elements
const cartBadge = document.querySelector('.cart-badge');

// ============================================================
// Cart Functions
// ============================================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        Toast.info(`${product.name} quantity updated`);
    } else {
        cart.push({ ...product, quantity: 1 });
        Toast.success(`${product.name} added to cart!`, {
            duration: 5000,
            action: {
                label: 'View Cart',
                callback: () => openCartDrawer && openCartDrawer()
            }
        });
    }
    
    saveCart();
    updateCartBadge();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    Toast.info('Item removed from cart');
}

function updateCartBadge() {
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function saveCart() {
    localStorage.setItem('gizmoCart', JSON.stringify(cart));
}

// ============================================================
// Wishlist Functions
// ============================================================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const product = products.find(p => p.id === productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        Toast.info(`${product?.name || 'Item'} removed from wishlist`);
    } else {
        wishlist.push(productId);
        Toast.success(`${product?.name || 'Item'} added to wishlist!`);
    }
    
    saveWishlist();
    updateWishlistUI();
}

function saveWishlist() {
    localStorage.setItem('gizmoWishlist', JSON.stringify(wishlist));
}

function updateWishlistUI() {
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            const icon = btn.querySelector('i');
            if (wishlist.includes(id)) {
                icon.className = 'fas fa-heart';
                btn.style.color = '#ef4444';
            } else {
                icon.className = 'far fa-heart';
                btn.style.color = '';
            }
        }
    });
}

// ============================================================
// Product Card Creator
// ============================================================
function createProductCard(product) {
    const badgeHTML = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge}</span>` : '';
    
    const discountHTML = product.discount > 0 ? 
        `<span class="product-discount">-${product.discount}%</span>` : '';
    
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (hasHalfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
    
    // Truncate description to ~100 characters
    const shortDesc = product.description.length > 100 
        ? product.description.substring(0, 100) + '...' 
        : product.description;
    
    // Map category to fallback icon
    const categoryIcons = {
        phones: 'fa-mobile-alt',
        audio: 'fa-headphones',
        watches: 'fa-clock',
        chargers: 'fa-bolt',
        drones: 'fa-helicopter',
        accessories: 'fa-shield-alt'
    };
    const fallbackIcon = categoryIcons[product.category] || 'fa-mobile-alt';
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${badgeHTML}
                ${discountHTML}
                <img src="${product.image}" alt="${product.name}" loading="lazy" 
                     onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-image-fallback" style="display:none;">
                    <i class="fas ${fallbackIcon}"></i>
                    <span>${product.name}</span>
                </div>
                <button class="product-wishlist" aria-label="Add to wishlist" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
                <div class="product-quick-actions">
                    <button class="quick-btn" aria-label="Quick view">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="product-hover-info">
                    <p>${shortDesc}</p>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="rating-stars">${starsHTML}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="price-original">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function createListProduct(product) {
    return `
        <div class="list-product" data-id="${product.id}">
            <div class="list-product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="list-product-info">
                <h4 class="list-product-title">${product.name}</h4>
                <span class="list-product-category">${product.category}</span>
                <div class="list-product-price">$${product.price}</div>
            </div>
        </div>
    `;
}

// ============================================================
// Notifications (use new Toast system)
// ============================================================
// Backward-compatible wrapper for the new Toast API
function showNotification(message) {
    if (window.Toast) {
        window.Toast.success(message);
    }
}

// ============================================================
// Initialize on page load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateWishlistUI();
});
