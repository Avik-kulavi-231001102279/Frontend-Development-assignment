import React from 'react';
import { Calendar, BookOpen, Layers, Users, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { getTodayDateString } from '../../utils/dateUtils';

/**
 * Attendify - Classroom Attendance Session Selector
 */
export const AttendanceSessionSelector = ({
  session = {},
  subjects = [],
  semesters = [],
  sections = [],
  onSessionChange,
  onLoadStudents,
  hasExistingRecords = false,
  loading = false,
}) => {
  const handleSubjectChange = (subjectId) => {
    const selected = subjects.find((s) => s.id === subjectId);
    if (selected) {
      onSessionChange({
        subjectId,
        subjectCode: selected.code,
        semester: selected.semester,
        section: selected.section,
      });
    } else {
      onSessionChange({ subjectId: '' });
    }
  };

  const isReadyToLoad = session.date && session.subjectId;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '1.75rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        {/* 1. Date */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.45rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Calendar size={14} color="var(--brand-primary)" /> 1. Attendance Date *
          </label>
          <input
            type="date"
            value={session.date || getTodayDateString()}
            onChange={(e) => onSessionChange({ date: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>

        {/* 2. Subject */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.45rem',
              color: 'var(--text-secondary)',
            }}
          >
            <BookOpen size={14} color="var(--brand-primary)" /> 2. Subject / Course *
          </label>
          <select
            value={session.subjectId || ''}
            onChange={(e) => handleSubjectChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">Select Course...</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name} (Sec {sub.section})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Semester */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.45rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Layers size={14} color="var(--brand-primary)" /> 3. Semester
          </label>
          <select
            value={session.semester || ''}
            onChange={(e) => onSessionChange({ semester: e.target.value })}
            style={{ width: '100%' }}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Section */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.45rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Users size={14} color="var(--brand-primary)" /> 4. Section
          </label>
          <select
            value={session.section || ''}
            onChange={(e) => onSessionChange({ section: e.target.value })}
            style={{ width: '100%' }}
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        {/* Load Students Button */}
        <div>
          <Button
            variant="primary"
            disabled={!isReadyToLoad || loading}
            loading={loading}
            onClick={onLoadStudents}
            icon={PlayCircle}
            style={{ width: '100%', height: '42px' }}
          >
            Load Students
          </Button>
        </div>
      </div>

      {hasExistingRecords && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.65rem 1rem',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--brand-primary)',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>
            Existing attendance records detected for this session. Loaded saved statuses ready for update.
          </span>
        </div>
      )}
    </div>
  );
};

export default AttendanceSessionSelector;
