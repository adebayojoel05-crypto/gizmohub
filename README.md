# GizmoHub

A modern, professional e-commerce platform for phones and accessories, built with vanilla HTML, CSS, and JavaScript.

## Features

### Pages
- **Home** - Hero section, featured products, categories, brands, testimonials
- **Shop** - All products with filtering and search
- **Categories** - Browse by category with visual previews
- **New Arrivals** - Latest products
- **Top Deals** - Discounted products
- **Blog** - Tech news, reviews, and guides
- **Contact** - Contact form and information

### Core Features
- Shopping cart with slide-out drawer
- Wishlist functionality
- User authentication modal (Sign In / Sign Up)
- Advanced search modal with live results
- Quick view product details
- Cookie consent banner (GDPR-compliant)
- Recently viewed products tracking
- Toast notifications
- Newsletter subscription

### Design Principles
- **Dark theme** with blue accent (#0066ff)
- **Inter font** family for clean typography
- **Mobile-responsive** layout
- **Accessibility-first** with keyboard navigation and reduced motion support
- **Layered shadows** instead of borders for depth
- **Concentric border radius** for nested elements
- **Specific transitions** (no `transition: all`)
- **Image outlines** for consistent depth

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + K` | Open search |
| `Esc` | Close any open modal |
| `Enter` | Submit forms / add to cart |

## File Structure

```
├── *.html (7 pages)
├── style.css (main stylesheet)
├── data.js (product data)
├── shop.js (cart/wishlist logic)
├── components.js (search & auth modals)
├── quick-view.js (quick view modal)
├── cart-drawer.js (cart drawer)
├── cookie-consent.js (cookie banner)
├── recently-viewed.js (tracking)
├── toast-notifications.js (toast system)
├── mobile-menu.js (mobile nav)
├── newsletter.js (newsletter form)
└── ui-enhancements.js (UI polish)
```

## Script Loading Order

```html
data.js → shop.js → components.js → quick-view.js → 
cart-drawer.js → ui-enhancements.js → mobile-menu.js → 
newsletter.js → cookie-consent.js → recently-viewed.js → 
toast-notifications.js
```

## Getting Started

1. Open `index.html` in a modern browser
2. Browse products, add to cart, test interactions
3. Try keyboard shortcuts: `Ctrl+K` for search

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

© 2024 GizmoHub. All rights reserved.
