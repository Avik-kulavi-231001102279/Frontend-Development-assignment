import React, { useState, useEffect } from 'react';
import { X, BookPlus, Save } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Attendify - Add / Edit Subject Modal Dialog
 */
export const SubjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  subject = null,
  existingSubjects = [],
  departments = [],
  loading = false,
}) => {
  const isEditMode = Boolean(subject && subject.id);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science',
    semester: 4,
    section: 'A',
    creditUnits: 4,
    instructor: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subject) {
      setFormData({
        code: subject.code || '',
        name: subject.name || '',
        department: subject.department || 'Computer Science',
        semester: subject.semester || 4,
        section: subject.section || 'A',
        creditUnits: subject.creditUnits || 4,
        instructor: subject.instructor || '',
      });
      setErrors({});
    } else {
      setFormData({
        code: '',
        name: '',
        department: departments[0] || 'Computer Science',
        semester: 4,
        section: 'A',
        creditUnits: 4,
        instructor: '',
      });
      setErrors({});
    }
  }, [subject, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Subject Code is required.';
    } else {
      const codeDuplicate = existingSubjects.some(
        (s) =>
          s.id !== (subject?.id || '') &&
          s.code.toLowerCase() === formData.code.trim().toLowerCase() &&
          s.section.toUpperCase() === formData.section.toUpperCase()
      );
      if (codeDuplicate) {
        newErrors.code = `Subject code "${formData.code}" is already assigned to Section ${formData.section}.`;
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Subject Name is required.';
    }

    if (!formData.creditUnits || formData.creditUnits < 1) {
      newErrors.creditUnits = 'Credits must be at least 1.';
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
          maxWidth: '520px',
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
            <div style={{ color: 'var(--brand-primary)', display: 'flex' }}>
              {isEditMode ? <Save size={20} /> : <BookPlus size={20} />}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              {isEditMode ? 'Edit Academic Subject' : 'Add Academic Subject'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
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
                Subject Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS401"
                style={{
                  width: '100%',
                  borderColor: errors.code ? '#EF4444' : undefined,
                }}
              />
              {errors.code && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.code}
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
                Subject Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Database Management Systems"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
                Credit Units *
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.creditUnits}
                onChange={(e) => setFormData({ ...formData, creditUnits: e.target.value })}
                style={{
                  width: '100%',
                  borderColor: errors.creditUnits ? '#EF4444' : undefined,
                }}
              />
              {errors.creditUnits && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.creditUnits}
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
                Faculty Instructor (Optional)
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="e.g. Dr. Aris Thorne"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? 'Update Subject' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
