# Attendify — Student Attendance Management System

> **Tagline:** Smart Attendance. Accurate Records. Better Management.

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Storage](https://img.shields.io/badge/Storage-HTML5_LocalStorage-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![Vitest](https://img.shields.io/badge/Tests-Vitest_%2B_RTL-FCC72B?logo=vitest&logoColor=black)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Overview

**Attendify** is an enterprise-grade academic Student Attendance Management System engineered as a pure, high-performance **Frontend-Only Application** powered by **React 18**, **Vite**, **Redux Toolkit**, and **HTML5 LocalStorage**. 

The application demonstrates advanced React design patterns, Redux architecture, asynchronous mock API service layers, memoized Reselect selectors, interactive Recharts visualizations, and strict academic attendance calculation policies without requiring any external database or backend server.

---

## 2. Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 | Declarative component hierarchy and hooks |
| **Build Tool** | Vite 8 | Instant Hot Module Replacement (HMR) and optimized rollup bundle |
| **Language** | JavaScript (ES6+, JSX) | Modern client-side logic and standards |
| **State Management** | Redux Toolkit | Centralized store with 5 slices, custom middleware, and memoized selectors |
| **React Redux** | React Redux 9 | `useSelector` and `useDispatch` state bindings |
| **Routing** | React Router DOM 7 | Client-side navigation (`/dashboard`, `/students`, `/subjects`, `/attendance`, `/reports`, `/analytics`, `/settings`) |
| **Visualizations** | Recharts 3 | Responsive interactive charts (Area, Donut, Bar) |
| **Icons** | Lucide React | Semantic iconography (strictly zero emojis used) |
| **Styling** | Custom CSS & CSS Variables | Deep navy (#0F172A), light/dark modes, glassmorphism, responsive cards |
| **Persistence** | HTML5 LocalStorage | Debounced serialization engine (`attendify_state_v1`) |
| **Mock API** | Custom Asynchronous Service Layer | Simulated network requests with Promises and duplicate validation |
| **Testing** | Vitest + React Testing Library | 40 automated unit, reducer, selector, thunk, and component tests |

---

## 3. Pure Frontend Architecture

Attendify operates entirely in the browser with no external server or database dependencies:
1. **Synchronous Hydration on Load**: Application state hydrates from `localStorage` under `attendify_state_v1`. If absent, realistic academic seed data (24 students, 6 subjects, 7 days of attendance) is initialized.
2. **Asynchronous Mock API Service Layer**: `mockStudentApi.js`, `mockSubjectApi.js`, and `mockAttendanceApi.js` simulate asynchronous REST requests with delay timers, error rejections, and duplicate checks.
3. **Reactive Store Persistence**: Any Redux store state mutation automatically triggers debounced serialization to LocalStorage.
4. **Resilient Reset**: Full "Reset Demo Data" option in Settings immediately restores the clean initial state.

---

## 4. Attendance Calculation Policy

Attendify implements a strictly verified, centralized academic attendance calculation formula located in `src/utils/attendanceCalculations.js`:

### Formula
$$\text{Countable Sessions} = \text{Present (P)} + \text{Absent (A)}$$
$$\text{Attendance Percentage} = \left( \frac{\text{Present (P)}}{\text{Countable Sessions}} \right) \times 100$$

### Rules & Exclusions
* **Present (P)**: Contributes to both the numerator and denominator.
* **Absent (A)**: Contributes only to the denominator.
* **Internship Placed (PL)**: Approved internship placement. Strictly **excluded** from countable sessions (neither numerator nor denominator) so students are not penalized.
* **Official Engagement (E)**: Authorized academic/institutional engagement. Strictly **excluded** from countable sessions.
* **Late Arrival**: Tracked as an attribute of **Present**. Late students are counted as Present in all attendance percentage calculations.
* **Zero Countable Sessions Safety**: When countable sessions equal zero (e.g. newly registered students or only PL/E records), the percentage returns `null` and displays as **`N/A`**.
* **Low-Attendance Threshold**: Default threshold is **45%** (configurable via Settings). Students with `N/A` are strictly excluded from low-attendance warnings.

---

## 5. Core Application Modules

### 1. Executive Dashboard (`/dashboard`)
* **8 Live Summary Cards**: Total Enrolled Students, Total Present Students, Total Absent Students, Total Internship Placed, Total Official Engagement, Total Late Students, Overall Attendance Percentage, and Students Below Threshold.
* **5 Recharts Visualizations**:
  - Attendance Status Distribution Donut Chart
  - Daily Attendance Trend Area Chart
  - Subject-wise Attendance Percentage Bar Chart
  - Department-wise Attendance Comparison Chart
  - Monthly Attendance Overview Chart
* **Active Alert Lists**: Immediate notifications for students below compliance threshold.

### 2. Student Management (`/students`)
* Add, Edit, Delete, Activate/Deactivate student records.
* Form validation with duplicate Student ID detection.
* Multi-criteria filters: Search query, Department, Semester, Section, Active/Inactive status.
* Sortable and paginated directory table.
* **Student Profile Modal**: Deep-dive attendance profile with personal information, categorized session counts, overall percentage, course breakdown, and chronological daily history.

### 3. Subject Management (`/subjects`)
* Course catalog management with Code, Title, Department, Semester, Section, and Credit Units.
* Duplicate Subject Code and Section collision prevention.
* Filter by Department, Semester, and Section.

### 4. Classroom Attendance Operations (`/attendance`)
* Interactive classroom session selector: Date picker, Subject, Semester, and Section.
* "Load Class Students" filter dynamically displaying registered active cohort.
* 4-Way Status Controls: **P** (Present), **A** (Absent), **PL** (Internship Placed), **E** (Official Engagement).
* Late Arrival tracking with arrival time picker and visual badge.
* Batch operations: **Mark All Present**, **Mark All Absent**, **Reset Unsaved Changes**.
* Duplicate prevention via compound key `studentId_subjectId_date`.
* Confirmation modal dialog before committing session to Redux and LocalStorage.

### 5. Attendance Reports & Audits (`/reports`)
* Presets: All Records, Daily Report (Today), Monthly Overview, Custom Date Range.
* Multi-criteria filtering by student, course, department, semester, section, status, and date range.
* Live summary KPI strip: Total records, Present, Absent, PL, E, Late, and Effective Rate.
* **RFC 4180-Compliant CSV Export**: With formula injection protection (`'`, `=`, `+`, `-`, `@`), quote escaping, UTF-8 BOM encoding, and direct browser Blob download.

### 6. System Settings (`/settings`)
* **Attendance Policy**: Minimum threshold slider (10% - 100%) with live preview of affected students.
* **Appearance**: Instant toggle between Light Mode and Dark Mode.
* **Storage Diagnostics**: Live LocalStorage key name, byte size, KB usage, and entity counts.
* **Restore Seed Demo Data**: One-click factory reset with confirmation dialog.

---

## 6. Project Structure

```text
Attendify/
├── public/
├── src/
│   ├── api/
│   │   ├── mockStudentApi.js           # Asynchronous student API simulation
│   │   ├── mockAttendanceApi.js        # Asynchronous attendance session API simulation
│   │   └── mockSubjectApi.js           # Asynchronous course catalog API simulation
│   ├── app/
│   │   ├── store.js                    # Redux Toolkit store with persistence subscriber
│   │   ├── hooks.js                    # Typed useAppDispatch and useAppSelector hooks
│   │   └── middleware/
│   │       └── loggerMiddleware.js     # Redux action logger with PII sanitization
│   ├── components/
│   │   ├── common/
│   │   │   ├── ChartCard.jsx           # Reusable wrapper for Recharts with empty states
│   │   │   ├── ConfirmationDialog.jsx  # Accessible modal confirmation
│   │   │   ├── EmptyState.jsx          # Visual empty dataset placeholder
│   │   │   ├── LoadingSkeleton.jsx     # Pulse loading placeholder
│   │   │   ├── Pagination.jsx          # Table pagination bar
│   │   │   ├── StatusBadge.jsx         # P/A/PL/E color-coded status badges
│   │   │   ├── SummaryCard.jsx         # Metric card with badge, icon, and subtext
│   │   │   └── ToastNotification.jsx   # Success/Error/Info alert toast
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx           # Main scaffold container
│   │   │   ├── Sidebar.jsx             # Collapsible navigation drawer
│   │   │   └── Topbar.jsx              # Header with date, threshold badge, and title
│   │   ├── students/
│   │   │   ├── StudentFormModal.jsx    # Add/Edit student form with validation
│   │   │   ├── StudentProfileModal.jsx # Detailed student attendance profile modal
│   │   │   └── StudentTable.jsx        # Sortable, paginated student directory table
│   │   ├── subjects/
│   │   │   ├── SubjectFormModal.jsx    # Add/Edit subject form with validation
│   │   │   └── SubjectTable.jsx        # Filterable academic courses table
│   │   └── attendance/
│   │       ├── AttendanceSessionSelector.jsx # Session selection controls
│   │       ├── AttendanceStatusButton.jsx    # 4-way P/A/PL/E status toggles
│   │       ├── AttendanceTable.jsx           # Classroom attendance grid
│   │       └── LateTimeModal.jsx             # Late arrival time entry modal
│   ├── data/
│   │   └── seedData.js                 # Seed dataset: 24 students, 6 subjects, multi-day records
│   ├── features/
│   │   ├── attendance/
│   │   │   └── attendanceSlice.js      # Attendance records, session batch thunk, reducers
│   │   ├── filters/
│   │   │   └── filtersSlice.js         # Student, session, report, and subject filter state
│   │   ├── preferences/
│   │   │   └── preferencesSlice.js     # Attendance threshold, theme, view preferences
│   │   ├── students/
│   │   │   └── studentsSlice.js        # Student roster state, async thunks
│   │   └── subjects/
│   │       └── subjectsSlice.js        # Course catalog state and actions
│   ├── pages/
│   │   ├── AttendancePage.jsx          # Session marking, batch actions, and session stats
│   │   ├── DashboardPage.jsx           # Executive overview, Recharts charts, risk banner
│   │   ├── ReportsPage.jsx             # Daily/monthly auditing, sorting, and CSV export
│   │   ├── SettingsPage.jsx            # Threshold configuration and demo data reset
│   │   ├── StudentsPage.jsx            # Student roster, search, pagination, active toggle
│   │   ├── SubjectsPage.jsx            # Course catalog, credit hours, instructor details
│   │   └── AnalyticsPage.jsx           # Visual charts, trend progression, department comparison
│   ├── selectors/
│   │   ├── attendanceSelectors.js      # Individual student stats map, threshold filters
│   │   ├── dashboardSelectors.js       # Recharts datasets, executive metrics, recent feed
│   │   ├── reportSelectors.js          # Filtered audit records, CSV export mappings
│   │   └── studentSelectors.js         # Search/filter students, session eligible roster
│   ├── test/
│   │   └── setup.js                    # Jest-DOM matchers setup for Vitest
│   ├── utils/
│   │   ├── attendanceCalculations.js   # Pure calculation policy, formula, status configs
│   │   ├── csvExport.js                # RFC 4180 generator and formula injection sanitizer
│   │   ├── dateUtils.js                # Canonical YYYY-MM-DD date utilities
│   │   └── storage.js                  # LocalStorage schema serialization & recovery
│   ├── App.jsx                         # React Router routes and initial async data dispatch
│   ├── index.css                       # Design system, responsive rules, status colors
│   └── main.jsx                        # React root entry with Provider and BrowserRouter
├── tests/
│   ├── asyncThunks.test.js             # Async thunk dispatch, success, and error tests
│   ├── calculations.test.js            # Pure formula, zero-denominator, and PL/E exclusion tests
│   ├── components.test.jsx             # UI component, modal validation, and CSV tests
│   ├── reducers.test.js                # State mutations, duplicate prevention, batch actions
│   └── selectors.test.js               # Memoized selectors, search, and dashboard tests
├── package.json
├── vite.config.js
└── README.md
```

---

## 7. Setup & Execution Instructions

### Prerequisites
* Node.js (version 18 or higher)
* npm (version 9 or higher)

### Installation
Directly inside the root repository:
```bash
npm install
```

### Running Locally (Development Mode)
Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Running Automated Tests
Execute the Vitest test suite:
```bash
npm run test
```
*Current test suite status: 40 tests passed across 5 test suites with 0 failures.*

### Building Production Bundle
Create the optimized production build:
```bash
npm run build
```
The output will be generated in `dist/`.

---

## 8. Verified Test Matrix

| Test Suite | Tests | Status | Key Coverage |
| :--- | :--- | :--- | :--- |
| `tests/calculations.test.js` | 7 | Passed | Strict formula, zero-session `N/A`, PL/E exclusion, Late counted as Present, threshold boundaries |
| `tests/reducers.test.js` | 11 | Passed | Add/update/delete student & subject, duplicate prevention, batch mark all present/absent |
| `tests/selectors.test.js` | 7 | Passed | Multi-criteria search, threshold alerts, profile breakdowns, executive summary derivation |
| `tests/asyncThunks.test.js` | 7 | Passed | Pending, fulfilled, rejected states, mock API validation |
| `tests/components.test.jsx` | 8 | Passed | Status Badges, StatsCard, ConfirmationModal, 4-status buttons, CSV formula injection protection |

---

## 9. Design Standards

* **Strictly Zero Emojis**: Every indicator, alert, badge, and button uses vector icons from `lucide-react`.
* **Theme Modes**: Full support for crisp Light Mode and high-contrast Dark Mode (`#0F172A`).
* **Accessible & Responsive**: Desktop, tablet, and mobile adaptable with collapsible sidebar navigation.
