import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  UserPlus,
  Users,
  Search,
  Filter,
  RefreshCw,
  GraduationCap,
  Download,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { StudentTable } from '../components/students/StudentTable';
import { StudentModal } from '../components/students/StudentModal';
import { StudentProfileModal } from '../components/students/StudentProfileModal';

import {
  addStudent,
  updateStudent,
  deleteStudent,
  setSelectedStudent,
} from '../features/students/studentsSlice';
import {
  setSearchFilter,
  setDepartmentFilter,
  setSemesterFilter,
  setSectionFilter,
  setStatusFilter,
  resetFilters,
} from '../features/filters/filtersSlice';

import {
  selectAllStudents,
  selectFilteredStudents,
  selectTotalStudentsCount,
  selectActiveStudentsCount,
  selectUniqueDepartments,
  selectUniqueSemesters,
  selectUniqueSections,
  selectStudentLoading,
} from '../selectors/studentSelectors';
import {
  selectAllStudentsAttendanceStats,
  selectStudentAttendanceProfile,
} from '../selectors/attendanceSelectors';

/**
 * Attendify - Student Directory & Management Page
 */
export const StudentsPage = () => {
  const dispatch = useDispatch();

  const allStudents = useSelector(selectAllStudents);
  const filteredStudents = useSelector(selectFilteredStudents);
  const totalCount = useSelector(selectTotalStudentsCount);
  const activeCount = useSelector(selectActiveStudentsCount);
  const departments = useSelector(selectUniqueDepartments);
  const semesters = useSelector(selectUniqueSemesters);
  const sections = useSelector(selectUniqueSections);
  const loading = useSelector(selectStudentLoading);
  const studentStatsMap = useSelector(selectAllStudentsAttendanceStats);
  const filters = useSelector((state) => state.filters);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [statusToggleCandidate, setStatusToggleCandidate] = useState(null);
  const [viewingProfileId, setViewingProfileId] = useState(null);

  // Profile data selector for viewing profile modal
  const profileSelector = viewingProfileId
    ? selectStudentAttendanceProfile(viewingProfileId)
    : () => null;
  const currentProfile = useSelector(profileSelector);

  // Handle Add Student
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  // Handle Edit Student
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  // Handle Save Student (Add / Edit)
  const handleSaveStudent = async (studentData) => {
    if (editingStudent) {
      await dispatch(updateStudent({ id: editingStudent.id, studentData })).unwrap();
    } else {
      await dispatch(addStudent(studentData)).unwrap();
    }
    setModalOpen(false);
    setEditingStudent(null);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (deleteCandidate) {
      await dispatch(deleteStudent(deleteCandidate.id));
      setDeleteCandidate(null);
    }
  };

  // Handle Status Toggle (Active <-> Inactive)
  const handleConfirmStatusToggle = async () => {
    if (statusToggleCandidate) {
      const newStatus = statusToggleCandidate.status === 'Active' ? 'Inactive' : 'Active';
      await dispatch(
        updateStudent({
          id: statusToggleCandidate.id,
          studentData: { ...statusToggleCandidate, status: newStatus },
        })
      );
      setStatusToggleCandidate(null);
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
            Student Directory
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0 0',
            }}
          >
            Manage enrolled students, academic departments, registration, and attendance records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={handleOpenAddModal}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Directory Metrics Strip */}
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
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Enrolled
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalCount}
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
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Students
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeCount}
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
              backgroundColor: 'rgba(100, 116, 139, 0.1)',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Filter size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Filtered Matches
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {filteredStudents.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card
        title="Search & Filter Records"
        icon={Filter}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() => dispatch(resetFilters())}
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
          {/* Search Input */}
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
              placeholder="Search by student ID or name..."
              value={filters.search}
              onChange={(e) => dispatch(setSearchFilter(e.target.value))}
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

          {/* Department Filter */}
          <div>
            <select
              value={filters.department}
              onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
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

          {/* Semester Filter */}
          <div>
            <select
              value={filters.semester}
              onChange={(e) => dispatch(setSemesterFilter(e.target.value))}
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

          {/* Section Filter */}
          <div>
            <select
              value={filters.section}
              onChange={(e) => dispatch(setSectionFilter(e.target.value))}
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

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
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
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Student Directory Table */}
      <StudentTable
        students={filteredStudents}
        studentStatsMap={studentStatsMap}
        onViewProfile={(student) => setViewingProfileId(student.id)}
        onEditStudent={handleOpenEditModal}
        onDeleteStudent={(student) => setDeleteCandidate(student)}
        onToggleStatus={(student) => setStatusToggleCandidate(student)}
      />

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        student={editingStudent}
        existingStudents={allStudents}
        departments={departments}
        loading={loading}
      />

      {/* Student Attendance Profile Modal */}
      <StudentProfileModal
        isOpen={Boolean(viewingProfileId)}
        profile={currentProfile}
        onClose={() => setViewingProfileId(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteCandidate)}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${deleteCandidate?.name} (${deleteCandidate?.id})? This will also remove their attendance history.`}
        confirmText="Delete Student"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteCandidate(null)}
      />

      {/* Activate / Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(statusToggleCandidate)}
        title={`${statusToggleCandidate?.status === 'Active' ? 'Deactivate' : 'Activate'} Student`}
        message={`Are you sure you want to set ${statusToggleCandidate?.name} to ${
          statusToggleCandidate?.status === 'Active' ? 'Inactive' : 'Active'
        }?`}
        confirmText={statusToggleCandidate?.status === 'Active' ? 'Deactivate' : 'Activate'}
        variant={statusToggleCandidate?.status === 'Active' ? 'danger' : 'primary'}
        onConfirm={handleConfirmStatusToggle}
        onClose={() => setStatusToggleCandidate(null)}
      />
    </div>
  );
};

export default StudentsPage;
