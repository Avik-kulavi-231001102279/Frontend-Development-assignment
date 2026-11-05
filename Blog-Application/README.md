# BlogSphere - Modern Blog Management System

![BlogSphere Banner](https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop)

A complete, modern, and professional SaaS-style Blog Management System built with **React.js**, **Vite**, **Axios**, and **JSON Server**.

---

## 🌟 Key Features

* **Modern SaaS Interface**: Minimalist design with white and dark navy primary colors, subtle blue accents, and responsive layout across Desktop, Tablet, and Mobile.
* **Dual Theme Support**: Seamless dark and light themes with smooth transitions and theme persistence.
* **Full REST CRUD**: Create, Read, Update, and Delete blogs via an asynchronous JSON Server REST backend decoupled inside `src/services/api.js`.
* **1000-Word Guardrail**: Dynamic live word counter with progressive visual warnings and client-side validation that prevents submissions exceeding 1000 words.
* **Live Previews**: Instant visual preview of featured images and responsive embeds for YouTube and Vimeo videos.
* **Search & Filter**: Real-time keyword search (title, author, content) paired with category filter pills and sorting (Latest, Oldest, Title A-Z, Title Z-A).
* **Reading Time Estimator**: Automatic reading time calculation based on ~200 words per minute.
* **Safe Deletion**: Accessible confirmation dialog modal preventing accidental post deletion.
* **Toast Notification System**: Non-intrusive floating feedback for create, update, delete, and validation events.
* **Graceful Degradation**: Offline indicators, loading skeletons, image error fallbacks, and tailored empty states.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Component architecture, Hooks, and Context API |
| **Vite 6** | Lightning-fast development server and production bundler |
| **Axios** | Promise-based HTTP client for all REST operations |
| **JSON Server** | Zero-config mock REST API persisting to `db.json` |
| **React Router DOM v6** | Declarative routing with URL search param sync |
| **Lucide React** | Clean, modern SVG icons |
| **HTML5 & CSS3** | Custom modular CSS variables and responsive design |

---

## 📁 Project Structure

```
BlogSphere/
├── db.json                     # Mock REST API database (8 sample posts)
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
├── index.html                  # HTML entry point with Google Fonts
├── README.md                   # Project documentation
│
└── src/
    ├── main.jsx                # Application root entry point
    ├── App.jsx                 # Routing and Layout wrapper
    │
    ├── components/             # Reusable UI components
    │   ├── Navbar.jsx          # Sticky navigation with theme toggle & mobile drawer
    │   ├── Footer.jsx          # SaaS footer with links and newsletter
    │   ├── BlogCard.jsx        # Responsive card with image, badges & metadata
    │   ├── SearchBar.jsx       # Search input with clear trigger
    │   ├── CategoryFilter.jsx  # Category pills with count badges
    │   ├── VideoPlayer.jsx     # YouTube/Vimeo embed and video player
    │   ├── Loading.jsx         # Card skeletons and spinners
    │   ├── EmptyState.jsx      # Empty search/database illustrations
    │   ├── ConfirmDialog.jsx   # Delete confirmation modal
    │   └── Toast.jsx           # Notification toast alerts
    │
    ├── pages/                  # Page routes
    │   ├── Home.jsx            # Landing page with hero, featured post & categories
    │   ├── Blogs.jsx           # All blogs with search, filters & sort
    │   ├── BlogDetails.jsx     # Full blog reading view with video & actions
    │   ├── CreateBlog.jsx      # Blog creation form with live word counter
    │   ├── EditBlog.jsx        # Blog edit form pre-populated from API
    │   └── About.jsx           # System architecture and technical overview
    │
    ├── context/                # Global React contexts
    │   ├── ThemeContext.jsx    # Dark/Light mode theme state
    │   └── ToastContext.jsx    # Toast notification queue
    │
    ├── hooks/
    │   └── useBlogs.js         # Custom hook for fetching and managing blogs
    │
    ├── services/
    │   └── api.js              # Reusable Axios REST API client
    │
    ├── utils/
    │   └── helpers.js          # Reading time, word count, date formatting
    │
    └── styles/                 # Modular CSS architecture
        ├── global.css          # Theme tokens, CSS reset, typography, buttons
        ├── navbar.css          # Navbar and footer styles
        ├── home.css            # Hero, highlights, and CTA styles
        ├── blogs.css           # Grid, toolbar, and card styles
        ├── forms.css           # Form controls, word counter & media previews
        ├── details.css         # Article layout, typography & author bio
        └── components.css      # Dialogs, toasts, skeletons & empty states
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Mock REST API (JSON Server)
In a separate terminal window, start JSON Server on port 3000:
```bash
npm run server
```
The REST API will be accessible at `http://localhost:3000/blogs`.

### 4. Start the Vite Frontend Development Server
In your main terminal, start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Running Both Concurrently
Alternatively, run both the backend mock server and frontend simultaneously with a single command:
```bash
npm run dev:all
```

---

## 📡 REST API Endpoints

The application interacts with JSON Server via standard REST endpoints configured at `http://localhost:3000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/blogs` | Retrieve all blog posts |
| `GET` | `/blogs/:id` | Retrieve a single blog post by its unique ID |
| `POST` | `/blogs` | Create and persist a new blog post |
| `PUT` | `/blogs/:id` | Update an existing blog post |
| `DELETE` | `/blogs/:id` | Permanently delete a blog post |

---

## 🏗️ Production Build

To build the application for production deployment:
```bash
npm run build
```
The optimized bundle will be generated inside the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 📝 License
Created for Academic and Professional Demonstration.

