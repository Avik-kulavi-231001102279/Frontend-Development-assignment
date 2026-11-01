import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Attendify - Add / Edit Student Modal Dialog
 */
export const StudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  student = null,
  existingStudents = [],
  departments = [],
  loading = false,
}) => {
  const isEditMode = Boolean(student && student.id);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    email: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id || '',
        name: student.name || '',
        department: student.department || 'Computer Science',
        semester: student.semester || 4,
        section: student.section || 'A',
        email: student.email || '',
        status: student.status || 'Active',
      });
      setErrors({});
    } else {
      setFormData({
        id: '',
        name: '',
        department: departments[0] || 'Computer Science',
        semester: 4,
        section: 'A',
        email: '',
        status: 'Active',
      });
      setErrors({});
    }
  }, [student, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Student ID is required.';
    } else if (!isEditMode) {
      const duplicate = existingStudents.some(
        (s) => s.id.toLowerCase() === formData.id.trim().toLowerCase()
      );
      if (duplicate) {
        newErrors.id = `Student ID "${formData.id}" is already registered.`;
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full Student Name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.department) {
      newErrors.department = 'Department selection is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-hover)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isEditMode ? <Save size={20} /> : <UserPlus size={20} />}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {isEditMode ? 'Edit Student Record' : 'Register New Student'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Student ID *
              </label>
              <input
                type="text"
                disabled={isEditMode}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. STU025"
                style={{
                  width: '100%',
                  borderColor: errors.id ? '#EF4444' : undefined,
                  backgroundColor: isEditMode ? 'var(--bg-hover)' : undefined,
                  cursor: isEditMode ? 'not-allowed' : undefined,
                }}
              />
              {errors.id && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.id}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Liam Patel"
                style={{
                  width: '100%',
                  borderColor: errors.name ? '#EF4444' : undefined,
                }}
              />
              {errors.name && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.name}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '0.35rem',
                color: 'var(--text-secondary)',
              }}
            >
              Institutional Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. student@attendify.edu"
              style={{
                width: '100%',
                borderColor: errors.email ? '#EF4444' : undefined,
              }}
            />
            {errors.email && (
              <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                style={{ width: '100%' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '0.35rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '0.35rem',
                color: 'var(--text-secondary)',
              }}
            >
              Academic Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="Active">Active Student</option>
              <option value="Inactive">Inactive / Suspended</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? 'Update Student' : 'Register Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
