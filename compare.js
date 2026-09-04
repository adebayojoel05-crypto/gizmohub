/**
 * Product Comparison Feature
 * Allows users to compare up to 4 products side by side
 */
(function() {
    const COMPARE_KEY = 'gizmohub_compare';
    const MAX_COMPARE = 4;

    function getCompareList() {
        try {
            return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCompareList(list) {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    }

    function addToCompare(productId) {
        const list = getCompareList();
        const product = window.products?.find(p => p.id === productId);
        
        if (!product) return false;
        
        if (list.includes(productId)) {
            Toast.info(`${product.name} removed from comparison`);
            removeFromCompare(productId);
            return false;
        }
        
        if (list.length >= MAX_COMPARE) {
            Toast.warning(`Maximum ${MAX_COMPARE} products can be compared`);
            return false;
        }
        
        list.push(productId);
        saveCompareList(list);
        updateCompareUI();
        Toast.success(`${product.name} added to comparison`);
        return true;
    }

    function removeFromCompare(productId) {
        let list = getCompareList();
        list = list.filter(id => id !== productId);
        saveCompareList(list);
        updateCompareUI();
    }

    function clearCompare() {
        saveCompareList([]);
        updateCompareUI();
        closeCompareModal();
        Toast.info('Comparison cleared');
    }

    function updateCompareUI() {
        const list = getCompareList();
        const badge = document.getElementById('compareBadge');
        const compareBtn = document.getElementById('compareBtn');
        
        if (badge) {
            badge.textContent = list.length;
            badge.style.display = list.length > 0 ? 'flex' : 'none';
        }
        
        if (compareBtn) {
            compareBtn.style.display = list.length >= 2 ? 'inline-flex' : 'none';
        }
    }

    function openCompareModal() {
        const list = getCompareList();
        if (list.length < 2) {
            Toast.warning('Add at least 2 products to compare');
            return;
        }
        
        const products = list.map(id => window.products?.find(p => p.id === id)).filter(Boolean);
        
        // Create modal if not exists
        let modal = document.getElementById('compareModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'compareModal';
            modal.className = 'compare-modal';
            modal.innerHTML = `
                <div class="compare-overlay"></div>
                <div class="compare-content">
                    <div class="compare-header">
                        <h2><i class="fas fa-balance-scale"></i> Compare Products</h2>
                        <div class="compare-actions">
                            <button class="compare-clear" id="clearCompare">
                                <i class="fas fa-trash"></i> Clear All
                            </button>
                            <button class="compare-close" id="closeCompare">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="compare-body" id="compareBody">
                        <!-- Products will be rendered here -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Event listeners
            modal.querySelector('.compare-overlay').addEventListener('click', closeCompareModal);
            modal.querySelector('#closeCompare').addEventListener('click', closeCompareModal);
            modal.querySelector('#clearCompare').addEventListener('click', clearCompare);
        }
        
        // Render products
        const body = modal.querySelector('#compareBody');
        body.innerHTML = renderCompareTable(products);
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeCompareModal() {
        const modal = document.getElementById('compareModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    function renderCompareTable(products) {
        const specs = [
            { key: 'price', label: 'Price', format: v => `$${v.toLocaleString()}` },
            { key: 'rating', label: 'Rating', format: v => `${v} ⭐` },
            { key: 'reviews', label: 'Reviews', format: v => v.toLocaleString() },
            { key: 'display', label: 'Display' },
            { key: 'processor', label: 'Processor' },
            { key: 'camera', label: 'Camera' },
            { key: 'battery', label: 'Battery' },
            { key: 'storage', label: 'Storage' }
        ];
        
        return `
            <div class="compare-table">
                <div class="compare-row compare-header-row">
                    <div class="compare-cell compare-feature">Feature</div>
                    ${products.map(p => `
                        <div class="compare-cell compare-product">
                            <button class="compare-remove" data-id="${p.id}">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200x200/1f2444/666?text=${encodeURIComponent(p.name)}'">
                            <h3>${p.name}</h3>
                            <span class="compare-price">$${p.price.toLocaleString()}</span>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id}); closeCompareModal();">
                                <i class="fas fa-shopping-bag"></i> Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
                ${specs.map(spec => `
                    <div class="compare-row">
                        <div class="compare-cell compare-feature">${spec.label}</div>
                        ${products.map(p => {
                            let value = p[spec.key] || p.description?.split(',')[0] || '-';
                            if (spec.format && typeof value === 'number') {
                                value = spec.format(value);
                            }
                            return `<div class="compare-cell">${value}</div>`;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function init() {
        // Add compare buttons to product cards
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.compare-btn');
            if (btn) {
                e.preventDefault();
                const productId = parseInt(btn.dataset.productId);
                addToCompare(productId);
            }
            
            // Remove buttons in compare modal
            const removeBtn = e.target.closest('.compare-remove');
            if (removeBtn) {
                const id = parseInt(removeBtn.dataset.id);
                removeFromCompare(id);
                openCompareModal(); // Refresh modal
            }
        });
        
        // Compare button in header or page
        document.addEventListener('click', (e) => {
            if (e.target.closest('#compareBtn') || e.target.closest('[data-compare-trigger]')) {
                e.preventDefault();
                openCompareModal();
            }
        });
        
        // Initial UI update
        updateCompareUI();
    }

    // Expose functions globally
    window.addToCompare = addToCompare;
    window.removeFromCompare = removeFromCompare;
    window.openCompareModal = openCompareModal;
    window.closeCompareModal = closeCompareModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
