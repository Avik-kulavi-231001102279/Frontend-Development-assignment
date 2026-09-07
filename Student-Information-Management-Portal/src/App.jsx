import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import { fetchStudents, deleteStudent } from "./services/api";
import "./styles/App.css";

const THEME_KEY = "studentPortal_theme";
function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (error) {
    console.warn("Failed to load theme from LocalStorage:", error);
  }
  return "light";
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn("Failed to save theme to LocalStorage:", error);
  }
}

function App() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [darkMode, setDarkMode] = useState(() => loadTheme() === "dark");

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [darkMode]);

  // Fetch students from backend on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    loadStudents();
  }, []);
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) {
      return { total: 0, highest: "0.00", average: "0.00" };
    }
    const cgpas = students.map((s) => s.cgpa);
    const highest = Math.max(...cgpas).toFixed(2);
    const average = (cgpas.reduce((sum, c) => sum + c, 0) / total).toFixed(2);
    return { total, highest, average };
  }, [students]);

  //Filtered & Sorted students (derived never mutates original) 
  const displayedStudents = useMemo(() => {
    let result = students;

    // 1. Filter by search query (case-insensitive, name or roll number)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = students.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.rollNumber.toLowerCase().includes(query)
      );
    }

    // 2. Sort by CGPA (sorted copy — original state untouched)
    if (sortOrder === "high-to-low") {
      result = [...result].sort((a, b) => b.cgpa - a.cgpa);
    } else if (sortOrder === "low-to-high") {
      result = [...result].sort((a, b) => a.cgpa - b.cgpa);
    }

    return result;
  }, [students, searchQuery, sortOrder]);


  /** Add Student — callback passed to AddStudent (Child → Parent) */
  const handleAddStudent = async (newStudent) => {
    // The AddStudent component handles the actual API call now so it can handle errors
    // We just update the local state with the returned saved student
    setStudents((prev) => [newStudent, ...prev]);
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  /** Edit Student — callback passed to AddStudent (Child → Parent) */
  const handleEditStudent = async (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  /** Open Edit modal — triggered from StudentCard (Child → Parent) */
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  /** Open Delete confirmation — triggered from StudentCard (Child → Parent) */
  const handleDeleteClick = (student) => {
    setDeleteConfirm(student);
  };

  /** Confirm Delete */
  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteStudent(deleteConfirm.id);
        setStudents((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  /** Cancel Delete */
  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  /** Open Add modal */
  const openAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  /** Close modal */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  /** Toggle dark/light mode */
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Collect existing roll numbers for duplicate validation
  const existingRollNumbers = useMemo(
    () => students.map((s) => s.rollNumber.toUpperCase()),
    [students]
  );

  return (
    <div className="app">
      {/* Header — receives theme state + toggle callback */}
      <Header darkMode={darkMode} onToggleTheme={toggleTheme} />

      <main className="main-dashboard">
        <div className="dashboard-container fade-in-up">
          {/* ── Dashboard Statistics ───────────────────────────────────── */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon stat-icon-students">👨‍🎓</div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-highest">🏆</div>
              <div className="stat-info">
                <span className="stat-value">{stats.highest}</span>
                <span className="stat-label">Highest CGPA</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-average">📊</div>
              <div className="stat-info">
                <span className="stat-value">{stats.average}</span>
                <span className="stat-label">Average CGPA</span>
              </div>
            </div>
          </section>

          {/* ── Student Management Controls ────────────────────────────── */}
          <section className="controls-section">
            <div className="controls-left">
              {/* Search */}
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by student name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Default Order</option>
                <option value="high-to-low">CGPA: High to Low</option>
                <option value="low-to-high">CGPA: Low to High</option>
              </select>
            </div>

            {/* Add Student Button */}
            <button className="btn btn-add" onClick={openAddModal}>
              <span className="btn-add-icon">+</span> Add Student
            </button>
          </section>

          {/* ── Student List ──────────────────────────────────────────── */}
          <section className="students-section">
            <StudentList
              students={displayedStudents}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onAddClick={openAddModal}
              isEmpty={students.length === 0}
            />
          </section>
        </div>
      </main>

      {/* ── Add/Edit Student Modal ─────────────────────────────────────── */}
      <AddStudent
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddStudent={handleAddStudent}
        onEditStudent={handleEditStudent}
        existingRollNumbers={existingRollNumbers}
        editingStudent={editingStudent}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div
            className="delete-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-dialog-icon">⚠️</div>
            <h3 className="delete-dialog-title">Delete Student?</h3>
            <p className="delete-dialog-message">
              Are you sure you want to delete{" "}
              <strong>{deleteConfirm.name}</strong> ({deleteConfirm.rollNumber}
              )? This action cannot be undone.
            </p>
            <div className="delete-dialog-actions">
              <button
                className="btn btn-cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-delete"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer — presentational component */}
      <Footer />
    </div>
  );
}

export default App;
