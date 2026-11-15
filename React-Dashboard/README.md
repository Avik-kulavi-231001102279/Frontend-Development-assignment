# Orderly — Order Management & Analytics Dashboard

**Orderly** is a complete, modern, responsive Order Management Analytics Dashboard built with **React.js**, **Vite**, **Material UI (MUI)**, **Recharts**, and **Lucide React**. It provides store owners and operations teams with real-time sales visibility, order lifecycle management, customer intelligence, and deep financial analytics.

![Orderly Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

### 📊 Comprehensive Dashboard Overview
- **5 Real-time Summary KPI Widgets:**
  - **Total Revenue**: Recognized revenue from orders with percentage trend indicator.
  - **Total Units Sold**: Cumulative volume of products and items sold.
  - **Total Orders**: Count of matching orders with live status comparison.
  - **Customer Reach**: Distinct unique customers making purchases.
  - **Recent Orders Pipeline**: Inbound orders within the last 7 days.
- **Interactive Revenue & Sales Line Chart**: Time-series visualization with dual Y-axis, metric view toggling (All, Revenue, Sales), and custom hover tooltips.
- **Order Status Distribution Donut Chart**: Visual breakdown of orders across `Completed`, `Processing`, `Pending`, and `Cancelled` states with center count and percentage badges.
- **Recent Orders Table**: Sortable and paginated table with customer avatars, categories, amounts, status badges, and actions.

### 🔍 Powerful Multi-Dimensional Filtering & Search
- **Compound Filters**: Date range, categories, order statuses, and search query work simultaneously.
- **Date Range Filters**: Presets for *All Time*, *Last 7 Days*, *Last 30 Days*, *Last 90 Days*, and *Custom Date Range* (with native start/end date pickers).
- **Category Filter**: Filter across Electronics, Fashion, Home & Living, Beauty & Personal Care, Sports & Fitness, and Books & Stationery.
- **Order Status Filter**: Isolate Completed, Processing, Pending, or Cancelled orders.
- **Global Search**: Instant search by Order ID, customer name, customer email, product name, or category.
- **One-Click Reset**: "Reset Filters" button restores all controls to default state.
- **CSV Data Export**: Generates and downloads standard CSV files of filtered orders with UTF-8 BOM encoding for Microsoft Excel and Google Sheets.

### 📦 Order Lifecycle Management & Modal
- **Order Details Modal**: Inspect full order breakdown including:
  - Items list with unit pricing, quantities, and subtotal.
  - Customer information with avatar, phone, and contact email.
  - Shipping address and courier tracking numbers (`TRK-...`).
  - Payment details (Credit Card, PayPal, Apple Pay) and payment status.
  - Financial summary: Subtotal, shipping fee calculation, estimated tax (8%), and grand total.
  - Live status updater directly within the modal.
  - Print invoice button.
- **Quick Status Changer**: Modify order statuses (`Completed`, `Processing`, `Pending`, `Cancelled`) directly from the table action menu.

### 🎨 Premium SaaS UI / UX
- **Collapsible Sidebar**: Desktop collapsible drawer (expands to 260px or collapses to 72px icon bar) with route indicators and badge counts.
- **Mobile Responsive Drawer**: Off-canvas sliding drawer for tablets and mobile devices.
- **Dark & Light Mode**: Complete theme system with custom color palettes, smooth transitions, and persistent `localStorage` storage.
- **Interactive Notifications UI**: Bell popover with unread counter, category icons, "Mark all as read", and "Clear all" actions.
- **Live Store Status**: Animated pulse dot indicating live store connection.
- **Polished Typography**: Modern typography stack using Inter and Plus Jakarta Sans.

### 🧭 Multi-Page Navigation (React Router DOM)
- `/` or `/dashboard`: Executive overview dashboard.
- `/orders`: Dedicated order directory with status quick-filter cards and table pagination.
- `/customers`: Customer directory with lifetime value metrics, top spenders, and search.
- `/analytics`: Deep business intelligence, category revenue contributions, and margins.
- `/settings`: Store preferences, notification toggles, theme settings, and filters reset.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **UI Component Library**: Material UI (MUI v6) with Emotion
- **Charts**: Recharts v2
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Styling**: Emotion CSS-in-JS + Modern CSS Reset

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd React-Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
React-Dashboard/
├── index.html                     # HTML entry point with fonts & metadata
├── vite.config.js                 # Vite configuration
├── package.json                   # Project scripts and dependencies
├── README.md                      # Documentation
├── patch-rollup.cjs               # Cross-platform build compatibility hook
├── src/
│   ├── main.jsx                   # Application bootstrap & provider wrapping
│   ├── App.jsx                    # Route definitions and layout mapping
│   ├── index.css                  # Global styles, scrollbars, and animations
│   ├── theme/
│   │   └── theme.js               # MUI light and dark theme configurations
│   ├── context/
│   │   ├── ThemeContext.jsx       # Theme state and localStorage persistence
│   │   └── FilterContext.jsx      # Global compound filter & dataset state
│   ├── data/
│   │   ├── mockOrders.js          # Realistic orders dataset
│   │   ├── mockCustomers.js       # Customer directory dataset
│   │   └── mockNotifications.js   # Notification feed items
│   ├── utils/
│   │   ├── formatters.js          # Currency, dates, and number formatters
│   │   ├── filterUtils.js         # Compound filtering algorithm
│   │   ├── analyticsUtils.js      # Aggregations for KPI widgets and charts
│   │   └── exportUtils.js         # CSV export generator with UTF-8 BOM
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx     # Shell layout with responsive drawer
│   │   │   ├── Sidebar.jsx        # Collapsible navigation drawer
│   │   │   └── TopNavbar.jsx      # Top bar with search, notifications, theme toggle
│   │   ├── common/
│   │   │   ├── StatusBadge.jsx    # Color-coded status badge with pulse dot
│   │   │   ├── StatCard.jsx       # KPI card with trends and accent gradients
│   │   │   ├── FilterBar.jsx      # Compound filters, presets, and export
│   │   │   └── NotificationMenu.jsx # Notifications dropdown popover
│   │   ├── orders/
│   │   │   ├── OrdersTable.jsx    # Sortable, paginated orders table
│   │   │   └── OrderDetailsModal.jsx # Order inspection and status modal
│   │   └── charts/
│   │       ├── RevenueSalesChart.jsx # Recharts LineChart for revenue/sales
│   │       └── OrderStatusPieChart.jsx # Recharts Pie/Donut status chart
│   └── pages/
│       ├── DashboardPage.jsx      # Executive dashboard view
│       ├── OrdersPage.jsx         # Full orders management view
│       ├── CustomersPage.jsx      # Customer accounts directory
│       ├── AnalyticsPage.jsx      # Business intelligence & category breakdown
│       └── SettingsPage.jsx       # Store configuration & preferences
```

---

## 💡 Key Design Decisions & Highlights

1. **Reactive Derived Analytics**: All 5 KPI cards and both charts compute their metrics dynamically from the filtered orders list using `useMemo`. When any filter (category, status, date range, search) changes, the charts, widgets, and tables synchronize immediately.
2. **Accessible Theme Switching**: Light and Dark themes use semantic contrast ratios adhering to WCAG standards, custom paper styling, and persistent storage in `localStorage`.
3. **Compound Filter Architecture**: The `filterOrders` utility evaluates search strings across multiple fields (order ID, customer name, customer email, product name, and category) while concurrently enforcing strict date boundaries, status matches, and category memberships.
4. **Resilient CSV Export**: Exports include all metadata fields properly formatted and sanitized with UTF-8 BOM to prevent spreadsheet character corruptions.

---

## 📄 License
MIT License. Created for the React.js Order Management Analytics Dashboard assignment.

