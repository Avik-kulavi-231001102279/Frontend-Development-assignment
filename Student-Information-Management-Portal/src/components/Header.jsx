import React from "react";
function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-icon">🎓</div>
          <div>
            <h1 className="header-title">Student Information Portal</h1>
            <p className="header-subtitle">
              Student Information Management System
            </p>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="theme-toggle-icon">
            {darkMode ? "☀️" : "🌙"}
          </span>
          <span className="theme-toggle-label">
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
