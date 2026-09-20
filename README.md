# React Development Assignments

A collection of **7 React.js assignments** covering the fundamentals of React development, including JSX, reusable components, Props, State Management, API Integration, Context API, React Router, Authentication, and Protected Routes.

These projects were developed as part of **Frontend Development / React Development coursework**.

---

## 📚 Assignments Overview

| Assignment   | Project                        | Main Concepts                                   |
| ------------ | ------------------------------ | ----------------------------------------------- |
| Assignment 1 | Personal Portfolio             | React Environment, JSX, Components, CSS         |
| Assignment 2 | Student Information Management | Props, Reusable Components, Data Passing        |
| Assignment 3 | Farm Employee Directory        | useState, Events, Conditional Rendering         |
| Assignment 4 | Weather Dashboard              | API, Fetch, Async/Await, useEffect              |
| Assignment 5 | Online Shopping Cart           | useReducer, Context API, State Management       |
| Assignment 6 | Task Manager                   | React Router, Nested Routes, Dynamic Routes     |
| Assignment 7 | Authentication System          | Local Storage, Route Protection, Authentication |

---

# 🚀 Assignment 1: React Environment Setup and Personal Portfolio

## 📌 Problem Statement

Develop a simple personal portfolio webpage using React.

## 🎯 Prerequisites

* Installation of React Development Environment
* JSX
* Reusable Components
* React Project Structure

## ✨ Requirements

* Header
* Footer
* Navigation Bar
* About Me
* Education
* Skills
* Contact Information
* Minimum 6 components
* Responsive Design
* External CSS
* JSX only

## 🧩 Main Concepts

* React Components
* JSX
* Component Reusability
* Props
* Responsive CSS
* React Project Structure

## 🛠️ Technologies

* React.js
* JavaScript
* JSX
* CSS
* Vite

---

# 🎓 Assignment 2: Student Information Management using Props

## 📌 Problem Statement

Create a student information portal where each student card displays important student details.

## 🎯 Prerequisites

* Props
* Component Reusability
* Data Passing

## ✨ Requirements

Each student card displays:

* Student Name
* Roll Number
* Department
* Semester
* CGPA
* Photo

## 🧩 Components

* App
* Header
* Student List
* Student Card
* Footer

## ✨ Features

* Student information displayed through reusable components
* Data passed using Props
* Student cards generated dynamically
* CGPA-based sorting
* Responsive user interface

## 🛠️ Technologies

* React.js
* JSX
* JavaScript
* CSS
* Props

---

# 👨‍🌾 Assignment 3: Farm Employee Directory using State and Events

## 📌 Problem Statement

Build an Employee Directory to maintain employee information of a farm.

## 🎯 Prerequisites

* `useState()`
* Event Handling
* Conditional Rendering

## 👤 Employee Information

Each employee contains:

* Name
* Employee ID
* Department Name
* Gender
* Phone Number
* Local Address
* Permanent Address

## ✨ Features

* Add Employee
* Edit Employee
* Delete Employee
* Search Employee
* Employee Count
* Department Filter
* Employee Information Management
* Form Validation
* Responsive Design

## 🧩 Main Concepts

* React State
* Event Handling
* Controlled Forms
* Conditional Rendering
* Array Operations
* Reusable Components

## 🛠️ Technologies

* React.js
* JavaScript
* JSX
* CSS

---

# 🌦️ Assignment 4: Weather Dashboard using API

## 📌 Problem Statement

Develop a weather application using the OpenWeatherMap API.

## 🎯 Prerequisites

* API Integration
* Fetch API
* Async/Await
* `useEffect()`

## 🌤️ Weather Information

The dashboard displays:

* Temperature
* Humidity
* Wind Speed
* Weather Icon
* Sunrise Time
* Sunset Time

## ✨ Features

* Search Weather by City
* Weather API Integration
* Loading Spinner
* Error Handling
* Current Weather Information
* Responsive Dashboard
* Dynamic Weather UI

## 🔌 API

The application uses the **OpenWeatherMap API** to retrieve weather information.

## 🧩 Main Concepts

* REST API
* Fetch
* Async/Await
* `useEffect()`
* API Response Handling
* Loading State
* Error State

## 🛠️ Technologies

* React.js
* OpenWeatherMap API
* JavaScript
* JSX
* CSS
* Vite

---

# 🛒 Assignment 5: Online Shopping Cart

## 📌 Problem Statement

Create an online shopping cart using React state management concepts.

## 🎯 Prerequisites

* `useReducer()`
* Context API
* State Management

## ✨ Features

* Product List
* Add to Cart
* Remove Item
* Quantity Update
* Grand Total
* Coupon Code
* Percentage-based Discount
* GST Calculation
* Cart Summary
* Dynamic Price Calculation

## 💰 Price Calculation

The cart calculates:

```text
Subtotal
    ↓
Coupon Discount
    ↓
Discounted Price
    ↓
GST
    ↓
Grand Total
```

## 🧩 Main Concepts

* `useReducer()`
* Context API
* Global State
* Cart State Management
* Reducer Actions
* Dynamic Calculations

## 🛠️ Technologies

* React.js
* JavaScript
* JSX
* Context API
* useReducer
* CSS

---

# 📋 Assignment 6: Task Manager with Routing

## 📌 Problem Statement

Build a single-page Task Manager application using React.

The application allows users to create, view, update, complete, filter, and delete tasks.

## 🎯 Prerequisites

* React Router
* Nested Routes
* Dynamic Routes

## 📝 Task Fields

Each task contains:

* Task Header
* Task Description
* Priority

  * High
  * Medium
  * Low
* Category

  * Academic
  * Personal
* Raised Date and Time
* Due Date
* Status

  * Raised
  * Pending
  * Closed

## 📄 Pages

* Dashboard
* Tasks
* Add Task
* Task Details
* Completed Tasks

## ✨ Features

* Create Tasks
* View Tasks
* Edit Tasks
* Delete Tasks
* Complete Tasks
* Task Filtering
* Priority Management
* Category Management
* Automatic Raised Date and Time
* Due Date Management
* Task Status Management
* URL Parameters
* Dynamic Routes
* Navigation
* Protected Route
* Responsive Design

## 🧩 Main Concepts

* React Router
* Nested Routes
* Dynamic Routes
* URL Parameters
* Navigation
* Protected Routes
* State Management
* Reusable Components

## 🛠️ Technologies

* React.js
* React Router
* JavaScript
* JSX
* CSS
* Vite

---

# 🔐 Assignment 7: Authentication System

## 📌 Problem Statement

Implement an authentication system integrated with the Task Manager application from Assignment 6.

## 🎯 Prerequisites

* Local Storage
* Route Protection

## ✨ Features

### 🔑 Authentication

* Login
* Logout
* Registration
* Username Validation
* Password Validation

### 🛡️ Protected Routes

* Protected Dashboard
* Authentication-based Navigation
* Unauthorized Access Prevention

### 💾 Remember User

The system provides a **Remember User** functionality to maintain the user's authentication state.

### 🎫 JWT Token Simulation

The project simulates JWT-based authentication validation on the frontend for educational purposes.

### 🔒 Password Validation

* Password Required
* Password Strength Detection
* Password Strength Indicator
* Validation Feedback

## 🧩 Main Concepts

* Authentication
* Context API
* Protected Routes
* Local Storage
* JWT Token Simulation
* Form Validation
* Password Strength
* Route Protection

## 🛠️ Technologies

* React.js
* React Router
* JavaScript
* JSX
* Context API
* CSS
* Vite

---

# 📂 General Project Structure

Each assignment is maintained as an independent React project.

```text
Frontend-Development-Assignments/
│
├── Personal-Portfolio/
│
├── Student-Information-Management-Portal/
│
├── Farm-Employee-Directory-Management-System/
│
├── Weather-Dashboard/
│
├── Online-Shopping-Cart/
│
├── Smart-Task-Manager/
│
└── Authentication-System/
```
---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Avik-kulavi-231001102279/Frontend-Development-assignment.git
```

## 2. Open the Project

```bash
cd Frontend-Development-Assignments
```

## 3. Navigate to an Assignment

Example:

```bash
cd Personal-Portfolio
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

For projects that require external APIs or backend services, create a `.env` file in the appropriate project.

> Never commit API keys, passwords, tokens, or other sensitive credentials to GitHub.

---

# 👨‍💻 Author

**Avik Kulavi**

BCA — Techno India University, Kolkata

**GitHub:**
https://github.com/Avik-kulavi-231001102279

**Portfolio:**
personal-portfolio-flame-omega-85.vercel.app

---

# 📌 Note

These projects were created for educational and academic purposes to demonstrate different concepts of modern React.js development.

Each assignment focuses on a specific set of React concepts and progressively builds knowledge from basic components to routing, state management, API integration, and authentication.
