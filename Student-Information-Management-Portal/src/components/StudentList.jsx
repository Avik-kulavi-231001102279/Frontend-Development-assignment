import React from "react";
import StudentCard from "./StudentCard";
function StudentList({ students, onEdit, onDelete, onAddClick, isEmpty }) {
  // Empty state — no students have been added yet
  if (isEmpty) {
    return (
      <div className="empty-state fade-in-up">
        <div className="empty-state-illustration">
          <span className="empty-state-icon-large">🎓</span>
          <div className="empty-state-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>
        <h3 className="empty-state-title">No Students Added Yet</h3>
        <p className="empty-state-message">
          Start building your student directory by adding your first student.
        </p>
        <button className="btn btn-add btn-empty-add" onClick={onAddClick}>
          <span className="btn-add-icon">+</span> Add Your First Student
        </button>
      </div>
    );
  }

  // Search returned no results
  if (students.length === 0) {
    return (
      <div className="empty-state fade-in-up">
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">No Students Found</h3>
        <p className="empty-state-message">
          No student matches your search.
          <br />
          Try another name or roll number.
        </p>
      </div>
    );
  }

  return (
    <div className="student-grid">
      {students.map((student, index) => (
        // Each StudentCard receives one student's data + callbacks through Props
        <div
          className="card-animate"
          key={student.id}
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <StudentCard
            student={student}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default StudentList;
