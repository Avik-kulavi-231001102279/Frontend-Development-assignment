import React from "react";
const DEFAULT_PHOTO = "/images/default-student.jpg";

function StudentCard({ student, onEdit, onDelete }) {
  // Determine which photo to display: uploaded photo or default avatar
  const photoSrc = student.photo || DEFAULT_PHOTO;

  // Determine CGPA badge color based on value
  const getCgpaBadgeClass = (cgpa) => {
    if (cgpa >= 9.0) return "cgpa-badge cgpa-excellent";
    if (cgpa >= 8.0) return "cgpa-badge cgpa-great";
    if (cgpa >= 7.0) return "cgpa-badge cgpa-good";
    return "cgpa-badge cgpa-average";
  };

  return (
    <div className="student-card">
      {/* Student Photo Section */}
      <div className="card-photo-section">
        <img
          src={photoSrc}
          alt={`${student.name}'s photo`}
          className="card-photo"
          onError={(e) => {
            e.target.src = DEFAULT_PHOTO;
          }}
        />
        {/* Card Action Buttons — Edit & Delete */}
        <div className="card-actions-overlay">
          <button
            className="card-action-btn card-edit-btn"
            onClick={() => onEdit(student)}
            title="Edit Student"
            aria-label={`Edit ${student.name}`}
          >
            ✏️
          </button>
          <button
            className="card-action-btn card-delete-btn"
            onClick={() => onDelete(student)}
            title="Delete Student"
            aria-label={`Delete ${student.name}`}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Student Info Section */}
      <div className="card-info-section">
        <h3 className="card-name">{student.name}</h3>
        <p className="card-roll">{student.rollNumber}</p>

        <div className="card-details">
          <div className="card-detail-row">
            <span className="detail-label">Department</span>
            <span className="detail-value">{student.department}</span>
          </div>
          <div className="card-detail-row">
            <span className="detail-label">Semester</span>
            <span className="detail-value">{student.semester}</span>
          </div>
        </div>

        {/* CGPA highlighted badge */}
        <div className="card-cgpa-section">
          <span className={getCgpaBadgeClass(student.cgpa)}>
            {student.cgpa.toFixed(2)} CGPA
          </span>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
