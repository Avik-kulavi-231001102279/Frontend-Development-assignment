import React from "react";

/**
 * Footer Component
 *
 * Displays the bottom section of the Student Information Portal.
 * Shows copyright and portal description.
 * This component receives no props — it is purely presentational.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          &copy; 2026 Student Information Portal
        </p>
        <p className="footer-tagline">
          Student Information Management System
        </p>
      </div>
    </footer>
  );
}

export default Footer;
