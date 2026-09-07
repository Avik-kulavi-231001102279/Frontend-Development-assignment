import React, { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../services/api";

/**
 * AddStudent Component
 *
 * Handles both Add and Edit student forms inside a modal dialog.
 * Demonstrates Child → Parent data passing using callback Props.
 *
 * Props:
 *   - isOpen (boolean): Controls modal visibility
 *   - onClose (function): Callback to close the modal (child → parent)
 *   - onAddStudent (function): Callback to send new student data to App (child → parent)
 *   - onEditStudent (function): Callback to send edited student data to App (child → parent)
 *   - existingRollNumbers (array): List of existing roll numbers for duplicate validation
 *   - editingStudent (object|null): Student being edited, or null for new student
 *
 * Data Flow:
 *   App passes onAddStudent/onEditStudent callbacks → AddStudent calls them with student data
 *   This is a clear demonstration of Child-to-Parent communication via callback Props.
 */

const INITIAL_FORM_STATE = {
  name: "",
  rollNumber: "",
  department: "",
  semester: "",
  cgpa: "",
  photo: null,
};

function AddStudent({
  isOpen,
  onClose,
  onAddStudent,
  onEditStudent,
  existingRollNumbers,
  editingStudent,
}) {
  // Form data managed locally within this component
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  // Photo preview URL for instant feedback
  const [photoPreview, setPhotoPreview] = useState(null);
  // Validation errors
  const [errors, setErrors] = useState({});

  // Whether we are in edit mode
  const isEditMode = !!editingStudent;

  // Populate form when editing an existing student
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        rollNumber: editingStudent.rollNumber || "",
        department: editingStudent.department || "",
        semester: editingStudent.semester?.toString() || "",
        cgpa: editingStudent.cgpa?.toString() || "",
        photo: editingStudent.photo || null,
      });
      setPhotoPreview(editingStudent.photo || null);
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingStudent, isOpen]);

  // Handle text/select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle photo upload — read file and create Data URL for preview + storage
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select a valid image file (JPG, JPEG, or PNG).",
        }));
        return;
      }

      // Read the file as Data URL for browser storage and preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, photo: reader.result }));
        setErrors((prev) => ({ ...prev, photo: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the current photo
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Student name is required.";
    }

    // Roll Number validation
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required.";
    } else {
      const rollUpper = formData.rollNumber.trim().toUpperCase();
      // When editing, allow same roll number for the same student
      const rollNumbers = isEditMode
        ? existingRollNumbers.filter(
            (r) => r !== editingStudent.rollNumber.toUpperCase()
          )
        : existingRollNumbers;

      if (rollNumbers.includes(rollUpper)) {
        newErrors.rollNumber =
          "A student with this roll number already exists.";
      }
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Department is required.";
    }

    // Semester validation
    const semester = parseInt(formData.semester, 10);
    if (!formData.semester) {
      newErrors.semester = "Semester is required.";
    } else if (isNaN(semester) || semester < 1 || semester > 8) {
      newErrors.semester = "Semester must be between 1 and 8.";
    }

    // CGPA validation
    const cgpa = parseFloat(formData.cgpa);
    if (!formData.cgpa && formData.cgpa !== 0) {
      newErrors.cgpa = "CGPA is required.";
    } else if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      newErrors.cgpa = "CGPA must be between 0.00 and 10.00.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const studentData = {
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      department: formData.department.trim(),
      semester: parseInt(formData.semester, 10),
      cgpa: parseFloat(parseFloat(formData.cgpa).toFixed(2)),
      photo: formData.photo, // Data URL or null
    };

    try {
      if (isEditMode) {
        const updated = await updateStudent(editingStudent.id, studentData);
        onEditStudent(updated);
      } else {
        const newStudent = await createStudent(studentData);
        onAddStudent(newStudent);
      }
      resetForm();
    } catch (error) {
      if (error.errorType === "DUPLICATE_ROLL_NUMBER") {
        setErrors((prev) => ({
          ...prev,
          rollNumber: "Student data already exists!",
        }));
      } else {
        console.error("API Error:", error);
        setErrors((prev) => ({
          ...prev,
          formApiError: error.message || "An unexpected error occurred. Is the backend running?",
        }));
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setPhotoPreview(null);
    setErrors({});
  };

  // Handle cancel — reset and close
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Prevent clicks inside modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            className="modal-close-btn"
            onClick={handleCancel}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form className="add-student-form" onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div className="form-photo-section">
            <div className="photo-preview-container">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Student preview"
                  className="photo-preview"
                />
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-placeholder-icon">📷</span>
                  <span className="photo-placeholder-text">Upload Photo</span>
                </div>
              )}
            </div>
            <div className="photo-actions">
              <label className="photo-upload-btn">
                {photoPreview ? "Change Photo" : "Choose Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="photo-input-hidden"
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </button>
              )}
            </div>
            {errors.photo && (
              <span className="form-error">{errors.photo}</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            {/* Student Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-name">
                Student Name <span className="required">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student's full name"
                className={`form-input ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && (
                <span className="form-error">{errors.name}</span>
              )}
            </div>

            {/* Roll Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="roll-number">
                Roll Number <span className="required">*</span>
              </label>
              <input
                id="roll-number"
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g., BCA007"
                className={`form-input ${errors.rollNumber ? "input-error" : ""}`}
              />
              {errors.rollNumber && (
                <span className="form-error">{errors.rollNumber}</span>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-input form-select ${errors.department ? "input-error" : ""}`}
              >
                <option value="">Select Department</option>
                <option value="Computer Application">
                  Computer Application
                </option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">
                  Electronics &amp; Communication
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Business Administration">
                  Business Administration
                </option>
              </select>
              {errors.department && (
                <span className="form-error">{errors.department}</span>
              )}
            </div>

            {/* Semester & CGPA side by side */}
            <div className="form-row">
              {/* Semester */}
              <div className="form-group">
                <label className="form-label" htmlFor="semester">
                  Semester <span className="required">*</span>
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`form-input form-select ${errors.semester ? "input-error" : ""}`}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <span className="form-error">{errors.semester}</span>
                )}
              </div>

              {/* CGPA */}
              <div className="form-group">
                <label className="form-label" htmlFor="cgpa">
                  CGPA <span className="required">*</span>
                </label>
                <input
                  id="cgpa"
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="0.00 – 10.00"
                  min="0"
                  max="10"
                  step="0.01"
                  className={`form-input ${errors.cgpa ? "input-error" : ""}`}
                />
                {errors.cgpa && (
                  <span className="form-error">{errors.cgpa}</span>
                )}
              </div>
            </div>
          </div>

          {/* API Error Display */}
          {errors.formApiError && (
            <div className="form-error" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
              {errors.formApiError}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              {isEditMode ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
