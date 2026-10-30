# 🛍️ ShopSphere – Modern E-Commerce Platform

> **Tagline**: *Smart Shopping. Seamless Experience.*

A complete, professional, portfolio-grade E-Commerce Web Application built with **React.js** and **Redux Toolkit**. Designed to demonstrate end-to-end practical mastery of Redux Toolkit state management, asynchronous thunks, entity adapters, memoized selectors, custom middlewares, and state persistence.

---

## 🌟 Key Highlights & Academic Objectives

- **100% Real Redux Toolkit Implementation**: Uses `@reduxjs/toolkit` for all global application state. No Context API substitutes.
- **Normalized Data Architecture**: Implements `createEntityAdapter()` for normalized product caching, CRUD operations (`setAll`, `addOne`, `updateOne`, `removeOne`), and fast selectors.
- **Asynchronous Data Integration**: Live REST API integration using [Fake Store API](https://fakestoreapi.com/) with graceful fallback and retry mechanisms.
- **Multi-Step Checkout Workflow**: Realistic 5-step checkout (Cart Review ➔ Shipping Information ➔ Simulated Payment Method ➔ Order Review ➔ Instant Order Confirmation).
- **Persistent State**: Shopping cart, authentication session, theme preference, currency, and complete order history survive browser refresh using safe `LocalStorage` synchronization.
- **Automated Test Coverage**: 48 comprehensive unit tests powered by **Vitest** and **React Testing Library** covering reducers, selectors, async thunks, and middlewares.
- **Rich Aesthetics**: Responsive modern design with Dark Mode & Light Mode, smooth glassmorphism, toast notifications, shimmer loading skeletons, and interactive states.

---

## 🏗️ Redux Toolkit Architecture

### 1. `configureStore()`
Located in [`src/app/store.js`](file:///d:/Frontend-Development-Assignments/Smart-Shopping/src/app/store.js):
- Centralizes application reducers:
  - `productReducer` (`products`)
  - `cartReducer` (`cart`)
  - `authReducer` (`auth`)
  - `orderReducer` (`orders`)
  - `preferenceReducer` (`preferences`)
- Custom middlewares attached: `loggerMiddleware` and `persistenceMiddleware`.

### 2. `createEntityAdapter()`
Located in [`src/features/products/productAdapter.js`](file:///d:/Frontend-Development-Assignments/Smart-Shopping/src/features/products/productAdapter.js):
- Normalizes product entities by `product.id`.
- Adapter methods used: `setAll`, `addOne`, `updateOne`, `removeOne`, `upsertOne`, `upsertMany`.
- Built-in adapter selectors: `selectAll`, `selectById`, `selectIds`, `selectEntities`, `selectTotal`.

### 3. `createAsyncThunk()`
Asynchronous operations handling lifecycle actions (`pending`, `fulfilled`, `rejected`):
- `fetchProducts`: Fetches inventory from Fake Store API.
- `fetchProductById`: Retrieves product details by ID.
- `fetchCategories`: Retrieves dynamic category list.
- `fetchProductsByCategory`: Queries products by specific department.
- `simulateLogin`: Simulated user authentication with credential validation.
- `simulateRegistration`: New user profile setup.
- `placeOrder`: Creates order with unique ID, clears active cart, and logs to order history.

### 4. `extraReducers`
Every async thunk explicitly updates slice state through the builder callback:
- **Pending**: Triggers shimmer loading skeletons and spinners.
- **Fulfilled**: Updates normalized entities or sets active session.
- **Rejected**: Captures meaningful error strings and exposes retry actions.

### 5. Memoized Selectors with `createSelector()`
High-performance derived data calculations:
- `selectFilteredProducts`: Efficiently filters by category, price range, min rating, and keyword search simultaneously.
- `selectFilteredAndSortedProducts`: Sorts filtered lists (Price: Low to High, High to Low, Rating, Alphabetical).
- `selectCartSubtotal`: Calculates $\sum (\text{price} \times \text{quantity})$.
- `selectCartDiscount`: Calculates dynamic discounts for coupons like `WELCOME10` (10%) and `SHOPSPHERE20` (20%).
- `selectCartTax`: Calculates 5% tax on taxable subtotal.
- `selectCartShipping`: Computes standard shipping or free shipping threshold ($100+).
- `selectCartFinalTotal`: Formula: $\text{Final Total} = \text{Subtotal} - \text{Discount} + \text{Tax} + \text{Shipping}$.

### 6. Custom Middlewares
- [`loggerMiddleware.js`](file:///d:/Frontend-Development-Assignments/Smart-Shopping/src/middleware/loggerMiddleware.js):
  - Categorizes actions (`[CART ACTIVITY]`, `[AUTH ACTIVITY]`, `[CHECKOUT ACTIVITY]`).
  - Logs previous state, action payload, and next state in browser console groups.
  - Automatically redacts sensitive fields (passwords, card numbers).
- [`persistenceMiddleware.js`](file:///d:/Frontend-Development-Assignments/Smart-Shopping/src/middleware/persistenceMiddleware.js):
  - Automatically serializes cart, auth session, theme preferences, and order history to `LocalStorage`.

---

## 📱 Application Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home Page** | Hero section, featured categories, trending items, best sellers, new arrivals, promotional coupon codes, and newsletter subscription. |
| `/shop` | **Shop / All Products** | Full inventory with category filter, price slider, rating filter, sort dropdown, and grid/list view switcher. |
| `/category/:categoryName` | **Category Page** | Dynamically loaded categories (Electronics, Jewelry, Men's Clothing, Women's Clothing) with tailored category banners. |
| `/product/:id` | **Product Details** | High-res imagery, rating reviews, quantity selector, Add to Cart, Buy Now, stock status, and related products carousel. |
| `/search` | **Search Results** | Live search term query matching title and description with filter integration. |
| `/cart` | **Shopping Cart** | Cart items list, line pricing, quantity controls, coupon code validation, and dynamic cost breakdown. |
| `/login` | **Login Page** | Simulated user login with one-click demo credentials and intended destination redirect. |
| `/register` | **Registration Page** | Account registration with validation. |
| `/profile` | **User Profile** *(Protected)* | User information, address book, editable contact details, and order tracking links. |
| `/checkout` | **Multi-Step Checkout** *(Protected)* | 5-step workflow (Cart Review ➔ Shipping ➔ Payment ➔ Review ➔ Place Order). |
| `/order-confirmation/:orderId` | **Order Confirmation** | Celebration confetti, generated order ID, purchase summary, and delivery tracking. |
| `/orders` | **Order History** *(Protected)* | Past orders list, status badges (Confirmed, Processing, Shipped, Delivered), and cancellation simulator. |

---

## 🧪 Testing Suite (Vitest & React Testing Library)

All **48 unit tests** pass with 100% success rate:

```bash
npm run test
```

### Test Coverage Summary:
- `tests/cartSlice.test.js`: 10 tests (initial state, adding products, duplicate prevention by quantity increment, quantity updates, invalid quantities handling, item removal, cart clearing, coupon validation, coupon removal).
- `tests/cartSelectors.test.js`: 7 tests (item counts, subtotal, percentage & fixed discounts, min-order limits, 5% tax calculation, free shipping thresholds, final total formula).
- `tests/productSlice.test.js`: 6 tests (normalized entity state, adapter CRUD operations `addOne`, `updateOne`, `removeOne`, filter/sort reducers, `extraReducers` for pending/fulfilled/rejected).
- `tests/productSelectors.test.js`: 9 tests (adapter selectors, category filter, price range slider, min rating, keyword search, price & rating sorting, category lookup).
- `tests/authSlice.test.js`: 5 tests (simulated login lifecycle, registration, logout, profile update, auth selectors).
- `tests/asyncThunks.test.js`: 6 tests (API fetching, product by ID, categories, order placement with automatic cart clearing, valid and invalid demo login).
- `tests/middleware.test.js`: 5 tests (action forwarding, sensitive data sanitization, LocalStorage synchronization for cart, orders, and preferences).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone or navigate to the repository directory
cd Smart-Shopping

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Building for Production
```bash
npm run build
```

### Running Test Suite
```bash
npm run test
```

---

## 🔑 Demo Credentials for Testing
For convenient grading and testing, the application includes pre-configured demo accounts accessible directly on the Login page:
- **Email**: `demo@shopsphere.com`
- **Password**: `password123`
*(Or click the one-click demo credentials button on the `/login` screen)*

---

## 🏷️ Available Demo Coupons
Test the dynamic coupon calculation on the Cart page:
- `WELCOME10`: 10% off your entire order.
- `SHOPSPHERE20`: 20% off orders over $50.
- `SAVE15`: $15 off orders over $60.
- `FREESHIP`: Free express shipping on any order over $30.
