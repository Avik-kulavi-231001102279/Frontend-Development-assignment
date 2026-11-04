# SpendWise – Personal Expense & Income Tracker

**SpendWise** is a modern, responsive, high-performance Personal Finance Management Single Page Application (SPA) built with React.js, Vite, and Redux Toolkit. Designed like a premier SaaS financial dashboard, SpendWise helps users track daily income and expenses, monitor monthly budget utilization thresholds, manage transaction categories, and analyze cashflow trends with interactive Recharts visualizations.

---

## 🌟 Key Features

### 1. Financial Dashboard
- **Dynamic Summary Cards**:
  - **Total Balance**: Real-time calculation (`All Income - All Expenses`).
  - **Total Income**: Cumulative sum of all earnings.
  - **Total Expenses**: Cumulative sum of all expenditures.
  - **Monthly Savings**: Current month cashflow surplus/deficit (`Current Month Income - Current Month Expenses`).
  - **Secondary Metrics**: Today's Expenses, Total Transaction Count, Top Spending Category, and Monthly Budget Usage Gauge.
- **Interactive Recharts Data Visualizations**:
  - **Expense by Category (Donut/Pie Chart)**: Category-wise breakdown with dynamic tooltips and percentages.
  - **Income vs Expense (Dual Bar Chart)**: Six-month comparative analysis of income inflows vs expense outflows.
  - **Daily Expense Trend (Area Chart)**: Day-by-day cashflow monitoring for the active calendar month.
- **Recent Activities**: Instant view of the latest 5 transactions with quick navigation to the complete ledger.

### 2. Transaction Management (Full CRUD)
- **Comprehensive Transaction Modal**:
  - Title, amount, transaction type (**Income / Expense**), category selector, date picker, payment method, and notes/descriptions.
  - Category options automatically switch according to the selected type (Income vs Expense).
  - Supported Payment Methods: **UPI, Credit Card, Debit Card, Bank Transfer, Cash, Other**.
- **Edit & Delete Operations**:
  - In-place editing of transaction details.
  - Safe deletion protected by an accessible **Confirmation Modal**.
- **Search & Multi-Dimensional Filtering**:
  - Real-time text search (matches title, description, and category).
  - Type Filter (All / Income / Expense).
  - Category Filter.
  - Payment Method Filter.
  - Custom Date Range (Start Date to End Date).
  - Sorting (Latest First, Oldest First, Highest Amount, Lowest Amount).
  - One-click **Clear Filters** reset.

### 3. Category Management
- **Default Categories**:
  - **Default Expenses**: Food & Dining, Shopping, Transportation, Education, Healthcare, Entertainment, Bills & Utilities, Rent, Travel, Others.
  - **Default Income**: Salary, Freelancing, Business, Investment, Gift, Other Income.
- **Custom Category Creation**: Add and edit custom categories with color palettes.
- **Safe Deletion Protection**: Cannot delete categories that are actively linked to transactions, protecting data integrity.
- **Usage Statistics**: Live counter and total monetary volume displayed per category.

### 4. Budget Management
- Set and adjust monthly spending targets.
- Real-time progress bar reflecting current-month expenditure percentage.
- **Threshold Warnings**:
  - Visual warning alert when spending reaches **80%** of budget.
  - Critical warning banner when spending **exceeds 100%**.
- Real-time remaining budget calculations and category-level monthly distribution.

### 5. Analytics & Financial Reports
- Flexible timeframe filtering: **All Time, This Month, Last Month, This Year**.
- Core analytics: Total Income, Total Expenses, Net Savings, Savings Rate (%), Average Daily Expense, and Top Category.
- Category breakdown pie chart, monthly comparison bar chart, and daily cashflow line chart.

### 6. CSV Export
- Clean CSV generation compliant with RFC 4180.
- Automatic escaping of quotes, commas, and line breaks.
- Exports filtered sets, monthly records, or the entire transaction ledger with timestamped filenames (`spendwise-transactions-YYYY-MM.csv`).

### 7. Settings & Persistence
- **Theme Switcher**: Smooth toggle between Light and Dark mode.
- **Multi-Currency Engine**:
  - Indian Rupee (`INR ₹`) – Default
  - US Dollar (`USD $`)
  - Euro (`EUR €`)
  - British Pound (`GBP £`)
  - Currency formatters adapt dynamically across all cards, tables, tooltips, and charts.
- **LocalStorage Persistence**:
  - Zero external database required.
  - Reusable storage service with corrupted data fallback and default seeding.
  - Options to **Load Sample Data**, **Clear All Transactions**, or **Factory Reset**.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 18** | Declarative Component-Based User Interface |
| **Vite 6** | Ultra-Fast Bundler and Development Server |
| **Redux Toolkit (RTK)** | Centralized State Management (`createSlice`, `createAsyncThunk`, `createSelector`) |
| **React Redux** | Official React bindings for Redux store |
| **React Router DOM 6** | Client-Side SPA Routing (`BrowserRouter`, `Routes`, `Route`) |
| **Recharts** | Composable SVG Charts (PieChart, BarChart, AreaChart, Tooltips) |
| **Tailwind CSS** | Modern utility-first responsive styling with Dark Mode |
| **Lucide React** | Consistent, modern financial and navigational iconography |
| **LocalStorage API** | Browser persistent offline data storage |
| **UUID (v4)** | Collision-proof unique identifiers for transactions |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── store.js                        # Redux store configuration
│   ├── rootReducer.js                  # Combined root reducer
│   └── middleware/
│       └── loggerMiddleware.js         # Custom action & state diff logger
├── features/
│   ├── transactions/
│   │   ├── transactionSlice.js         # CRUD thunks & extraReducers
│   │   └── transactionSelectors.js     # Memoized financial metrics selectors
│   ├── categories/
│   │   └── categorySlice.js            # Category state & validation
│   ├── budget/
│   │   └── budgetSlice.js              # Monthly budget state & updates
│   ├── settings/
│   │   └── settingsSlice.js            # Theme, currency, profile state
│   └── filters/
│       └── filterSlice.js              # Search, filter & sorting parameters
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx                 # Collapsible & responsive drawer
│   │   ├── Header.jsx                  # Dynamic title, search, date & theme toggle
│   │   └── MainLayout.jsx              # App shell & global toast listener
│   ├── dashboard/
│   │   ├── SummaryCard.jsx             # Metric card with icons & trends
│   │   └── RecentTransactions.jsx      # Latest 5 records list
│   ├── transactions/
│   │   ├── TransactionForm.jsx         # Form with validation & type-dependent categories
│   │   ├── TransactionTable.jsx        # Desktop table & mobile cards with actions
│   │   ├── TransactionFilters.jsx      # Filter toolbar with CSV export trigger
│   │   └── TransactionModal.jsx        # Add/Edit modal wrapper
│   ├── charts/
│   │   ├── ExpensePieChart.jsx         # Category distribution donut
│   │   ├── IncomeExpenseBarChart.jsx   # Monthly dual-bar chart
│   │   └── ExpenseLineChart.jsx        # Daily trend area chart
│   └── common/
│       ├── Modal.jsx                   # Reusable modal with backdrop & ESC handler
│       ├── ConfirmDialog.jsx           # Deletion confirmation dialog
│       ├── Toast.jsx                   # Toast notifications with auto-dismiss
│       ├── EmptyState.jsx              # Clean fallback view for empty lists
│       └── Loading.jsx                 # Loading spinner component
├── pages/
│   ├── Dashboard.jsx                   # Primary financial dashboard
│   ├── Transactions.jsx                # Full transaction management view
│   ├── Categories.jsx                  # Category organization & management
│   ├── Analytics.jsx                   # Detailed reporting & analytics
│   ├── Budget.jsx                      # Monthly budget allocation & alerts
│   └── Settings.jsx                    # Appearance, currency, & data reset
├── services/
│   └── storageService.js               # Safe LocalStorage persistence service
├── utils/
│   ├── calculations.js                 # Financial math & chart data aggregation
│   ├── exportCSV.js                    # RFC 4180 CSV export utility
│   ├── formatCurrency.js               # Multi-currency internationalization
│   └── dateUtils.js                    # Date formatting & month range helpers
├── hooks/
│   └── useTheme.js                     # Dark/Light class synchronization hook
├── App.jsx                             # Route definitions & startup dispatchers
├── main.jsx                            # React root & Redux Provider
└── index.css                           # Tailwind directives & scrollbar styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18+ recommended)
- npm or pnpm

### Installation
1. Clone or navigate to the project directory:
   ```bash
   cd Expense-Tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### Production Build
To create a production-optimized build:
```bash
npm run build
```
Preview the built artifacts:
```bash
npm run preview
```

---

## 🌐 Deployment on Vercel

The application is pre-configured for seamless single-page application routing on Vercel via the included `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:
1. Push this repository to GitHub or GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. The framework preset will automatically detect **Vite**.
4. Click **Deploy**.

