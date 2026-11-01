import React, { useState } from 'react';
import {
  CheckCheck,
  XCircle,
  RotateCcw,
  Save,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AttendanceStatusButton } from './AttendanceStatusButton';
import { LateTimeModal } from './LateTimeModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Button } from '../common/Button';

/**
 * Attendify - Classroom Attendance Marking Table
 */
export const AttendanceTable = ({
  students = [],
  draftMap = {},
  onStatusChange,
  onLateChange,
  onMarkAllPresent,
  onMarkAllAbsent,
  onResetDraft,
  onSaveAttendance,
  isSaving = false,
  subjectCode = '',
  date = '',
}) => {
  const [lateModalStudent, setLateModalStudent] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  // Calculate live counters for the session draft
  let presentCount = 0;
  let absentCount = 0;
  let plCount = 0;
  let eCount = 0;
  let lateCount = 0;

  students.forEach((stu) => {
    const draft = draftMap[stu.id] || { status: 'P', isLate: false };
    if (draft.status === 'P') {
      presentCount++;
      if (draft.isLate) lateCount++;
    } else if (draft.status === 'A') {
      absentCount++;
    } else if (draft.status === 'PL') {
      plCount++;
    } else if (draft.status === 'E') {
      eCount++;
    }
  });

  const handleOpenLateModal = (student, currentLateTime) => {
    setLateModalStudent({
      student,
      time: currentLateTime || '09:15 AM',
    });
  };

  const handleSaveLateTime = (time) => {
    if (lateModalStudent) {
      onLateChange(lateModalStudent.student.id, true, time);
      setLateModalStudent(null);
    }
  };

  const handleToggleLate = (studentId, currentIsLate, currentTime) => {
    if (currentIsLate) {
      // Toggle off
      onLateChange(studentId, false, null);
    } else {
      // Toggle on with default time
      onLateChange(studentId, true, currentTime || '09:15 AM');
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Session Summary & Batch Action Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-hover)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Live Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Class Roster ({students.length} Students):
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#059669',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            {presentCount} Present
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#DC2626',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            {absentCount} Absent
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#D97706',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            {plCount} Placement
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#2563EB',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            {eCount} Engagement
          </span>
          {lateCount > 0 && (
            <span
              style={{
                padding: '0.2rem 0.6rem',
                backgroundColor: 'rgba(217, 119, 6, 0.15)',
                color: '#B45309',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              {lateCount} Late
            </span>
          )}
        </div>

        {/* Batch Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkAllPresent}
            icon={CheckCheck}
            title="Mark all students Present"
          >
            All Present
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkAllAbsent}
            icon={XCircle}
            title="Mark all students Absent"
          >
            All Absent
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetDraft}
            icon={RotateCcw}
            title="Reset changes back to last saved state"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setConfirmSaveOpen(true)}
            icon={Save}
            loading={isSaving}
          >
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '0.85rem 1.25rem', width: '60px' }}>#</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Student ID</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Student Name</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Department / Class</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Attendance Status</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Late Arrival</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No students found enrolled in this subject, semester, and section.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const draft = draftMap[student.id] || { status: 'P', isLate: false, lateTime: null };
                const isPresent = draft.status === 'P';

                return (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: draft.status === 'A' ? 'var(--status-a-bg)' : undefined,
                      transition: 'background-color var(--transition-fast)',
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {student.id}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {student.department} (Sem {student.semester}-{student.section})
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <AttendanceStatusButton
                        currentStatus={draft.status}
                        onStatusChange={(newStatus) => onStatusChange(student.id, newStatus)}
                      />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      {isPresent ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleLate(student.id, draft.isLate, draft.lateTime)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: draft.isLate ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-hover)',
                              color: draft.isLate ? '#B45309' : 'var(--text-muted)',
                              border: `1px solid ${draft.isLate ? '#F59E0B' : 'var(--border-light)'}`,
                              cursor: 'pointer',
                            }}
                            title={draft.isLate ? 'Mark on-time' : 'Mark late arrival'}
                          >
                            <Clock size={13} />
                            {draft.isLate ? (draft.lateTime || 'Late') : 'Mark Late'}
                          </button>

                          {draft.isLate && (
                            <button
                              type="button"
                              onClick={() => handleOpenLateModal(student, draft.lateTime)}
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--brand-primary)',
                                fontWeight: 600,
                                textDecoration: 'underline',
                                padding: '2px 4px',
                              }}
                            >
                              Edit Time
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        onConfirm={() => {
          setConfirmSaveOpen(false);
          onSaveAttendance();
        }}
        variant="primary"
        title="Save Classroom Attendance"
        message={`Are you sure you want to commit attendance records for ${subjectCode} on ${date}? This will synchronize records with LocalStorage and update all analytics.`}
        confirmText="Save & Synchronize"
      />

      {/* Late Arrival Time Editor Modal */}
      <LateTimeModal
        isOpen={Boolean(lateModalStudent)}
        onClose={() => setLateModalStudent(null)}
        onSave={handleSaveLateTime}
        studentName={lateModalStudent?.student?.name}
        initialTime={lateModalStudent?.time}
      />
    </div>
  );
};

export default AttendanceTable;
