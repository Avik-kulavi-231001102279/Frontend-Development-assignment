import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BookPlus,
  BookOpen,
  Search,
  Filter,
  RefreshCw,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SubjectTable } from '../components/subjects/SubjectTable';
import { SubjectModal } from '../components/subjects/SubjectModal';

import {
  addSubject,
  updateSubject,
  deleteSubject,
} from '../features/subjects/subjectsSlice';
import { selectUniqueDepartments } from '../selectors/studentSelectors';

/**
 * Attendify - Academic Subject & Course Management Page
 */
export const SubjectsPage = () => {
  const dispatch = useDispatch();

  const subjects = useSelector((state) => state.subjects.items || []);
  const loading = useSelector((state) => state.subjects.loading);
  const studentDepartments = useSelector(selectUniqueDepartments);

  // Derive unique departments, semesters, sections from subjects
  const departments = useMemo(() => {
    const list = new Set([...studentDepartments, ...subjects.map((s) => s.department)]);
    return Array.from(list).filter(Boolean).sort();
  }, [studentDepartments, subjects]);

  const semesters = useMemo(() => {
    const list = new Set(subjects.map((s) => s.semester));
    return Array.from(list).sort((a, b) => a - b);
  }, [subjects]);

  const sections = useMemo(() => {
    const list = new Set(subjects.map((s) => s.section));
    return Array.from(list).sort();
  }, [subjects]);

  // Local filter states for subjects
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    section: '',
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Stats calculations
  const totalCredits = useMemo(() => {
    return subjects.reduce((sum, s) => sum + (Number(s.creditUnits) || 0), 0);
  }, [subjects]);

  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject(sub);
    setModalOpen(true);
  };

  const handleSaveSubject = async (subjectData) => {
    if (editingSubject) {
      await dispatch(updateSubject({ id: editingSubject.id, subjectData })).unwrap();
    } else {
      await dispatch(addSubject(subjectData)).unwrap();
    }
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteCandidate) {
      await dispatch(deleteSubject(deleteCandidate.id));
      setDeleteCandidate(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Academic Subjects
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0 0',
            }}
          >
            Configure curriculum courses, subject codes, faculty instructors, and section assignments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={BookPlus}
            onClick={handleOpenAddModal}
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* Subject Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Subjects
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {subjects.length}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Credit Units
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalCredits}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Academic Sections
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {sections.length > 0 ? sections.join(', ') : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card
        title="Search & Filter Subjects"
        icon={Filter}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() =>
              setFilters({ search: '', department: '', semester: '', section: '' })
            }
          >
            Reset Filters
          </Button>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search by code (e.g. CS301) or title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          {/* Department */}
          <div>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            >
              <option value="">All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            >
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Subject Table */}
      <SubjectTable
        subjects={subjects}
        onEditSubject={handleOpenEditModal}
        onDeleteSubject={(sub) => setDeleteCandidate(sub)}
        departments={departments}
        semesters={semesters}
        sections={sections}
        filters={filters}
        onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
      />

      {/* Add / Edit Subject Modal */}
      <SubjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSaveSubject}
        subject={editingSubject}
        existingSubjects={subjects}
        departments={departments}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteCandidate)}
        title="Delete Subject"
        message={`Are you sure you want to permanently delete "${deleteCandidate?.code} - ${deleteCandidate?.name}"? Attendance records linked to this subject will also be affected.`}
        confirmText="Delete Subject"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
};

export default SubjectsPage;
