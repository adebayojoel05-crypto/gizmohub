// ============================================================
// GizmoHub - Cart Drawer
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initCartDrawer();
});

function initCartDrawer() {
    // Create drawer if it doesn't exist
    if (!document.getElementById('cartDrawer')) {
        const drawer = document.createElement('div');
        drawer.id = 'cartDrawer';
        drawer.className = 'cart-drawer';
        drawer.innerHTML = `
            <div class="cart-drawer-overlay"></div>
            <div class="cart-drawer-content">
                <div class="cart-drawer-header">
                    <h3><i class="fas fa-shopping-bag"></i> Your Cart <span id="cartCount">(0)</span></h3>
                    <button class="cart-drawer-close" aria-label="Close cart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-drawer-body" id="cartBody">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your cart is empty</p>
                        <span>Add items to get started</span>
                    </div>
                </div>
                <div class="cart-drawer-footer">
                    <div class="cart-subtotal">
                        <span>Subtotal</span>
                        <span id="cartSubtotal">$0.00</span>
                    </div>
                    <p class="cart-shipping-note">Shipping and taxes calculated at checkout</p>
                    <button class="btn btn-primary btn-lg btn-full" onclick="goToCheckout()">
                        Checkout <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="btn btn-outline btn-full" onclick="viewCart()">
                        View Cart
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        // Event listeners
        drawer.querySelector('.cart-drawer-close').addEventListener('click', closeCartDrawer);
        drawer.querySelector('.cart-drawer-overlay').addEventListener('click', closeCartDrawer);
    }

    // Open drawer when cart icon is clicked
    document.querySelectorAll('.cart-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartDrawer();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCartDrawer() {
    const body = document.getElementById('cartBody');
    const countEl = document.getElementById('cartCount');
    const subtotalEl = document.getElementById('cartSubtotal');
    
    if (!body) return;
    
    const cart = JSON.parse(localStorage.getItem('gizmoCart')) || [];
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.textContent = `(${totalItems})`;
    
    // Update subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    if (cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <span>Add items to get started</span>
            </div>
        `;
        return;
    }
    
    body.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price} × ${item.quantity}</p>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button onclick="updateCartItem(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItem(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCartDrawer(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartItem(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('gizmoCart')) || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        localStorage.setItem('gizmoCart', JSON.stringify(cart));
        updateCartDrawer();
        updateCartBadge();
    }
}

function removeFromCartDrawer(productId) {
    let cart = JSON.parse(localStorage.getItem('gizmoCart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('gizmoCart', JSON.stringify(cart));
    updateCartDrawer();
    updateCartBadge();
    showNotification('Item removed from cart');
}

function goToCheckout() {
    showNotification('Checkout coming soon!');
}

function viewCart() {
    window.location.href = 'shop.html';
}

// Update cart drawer when items are added
const originalAddToCart = window.addToCart;
window.addToCart = function(productId) {
    if (originalAddToCart) {
        originalAddToCart(productId);
    } else {
        // Fallback if original not available
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem('gizmoCart')) || [];
        const existing = cart.find(item => item.id === productId);
        
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('gizmoCart', JSON.stringify(cart));
    }
    updateCartDrawer();
    updateCartBadge();
};

// Expose globally
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.updateCartDrawer = updateCartDrawer;