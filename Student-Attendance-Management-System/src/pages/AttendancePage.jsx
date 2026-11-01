import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CalendarCheck,
  Calendar,
  Users,
  BookOpen,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AttendanceSessionSelector } from '../components/attendance/AttendanceSessionSelector';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { getTodayDateString } from '../utils/dateUtils';

import {
  setActiveSession,
  initializeDraftAttendance,
  setStudentStatus,
  setStudentLate,
  markAllPresent,
  markAllAbsent,
  resetDraftChanges,
  saveAttendance,
} from '../features/attendance/attendanceSlice';

import { selectAllStudents } from '../selectors/studentSelectors';
import {
  selectAllAttendanceRecords,
  selectAttendanceSaving,
  selectDraftAttendance,
} from '../selectors/attendanceSelectors';

/**
 * Attendify - Core Classroom Attendance Management Page
 */
export const AttendancePage = () => {
  const dispatch = useDispatch();

  const allStudents = useSelector(selectAllStudents);
  const subjects = useSelector((state) => state.subjects.items || []);
  const allRecords = useSelector(selectAllAttendanceRecords);
  const isSaving = useSelector(selectAttendanceSaving);
  const activeSession = useSelector((state) => state.attendance?.activeSession) || {};
  const draftMap = useSelector(selectDraftAttendance) || {};

  // Local state for session parameters before or while loaded
  const [sessionParams, setSessionParams] = useState({
    date: activeSession.date || getTodayDateString(),
    subjectId: activeSession.subjectId || (subjects[0]?.id || ''),
    semester: activeSession.semester || (subjects[0]?.semester || 4),
    section: activeSession.section || (subjects[0]?.section || 'A'),
  });

  // Unique semesters & sections from subjects
  const semesters = Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
  const sections = Array.from(new Set(subjects.map((s) => s.section))).sort();

  // If subjects loaded and none selected, auto-select first subject
  useEffect(() => {
    if (!sessionParams.subjectId && subjects.length > 0) {
      const first = subjects[0];
      setSessionParams((prev) => ({
        ...prev,
        subjectId: first.id,
        semester: first.semester,
        section: first.section,
      }));
    }
  }, [subjects, sessionParams.subjectId]);

  // Check if existing records exist for selected date + subject
  const hasExistingRecords = allRecords.some(
    (r) => r.subjectId === sessionParams.subjectId && r.date === sessionParams.date
  );

  // Handle session selector changes
  const handleSessionChange = (updated) => {
    setSessionParams((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Find the selected subject entity
  const selectedSubject = subjects.find((s) => s.id === sessionParams.subjectId);

  // Filter students matching the class session (semester + section)
  const sessionStudents = allStudents.filter((stu) => {
    if (stu.status !== 'Active') return false;
    const semMatch = String(stu.semester) === String(sessionParams.semester);
    const secMatch = String(stu.section) === String(sessionParams.section);
    return semMatch && secMatch;
  });

  // Load students into draft
  const handleLoadStudents = () => {
    dispatch(
      setActiveSession({
        date: sessionParams.date,
        subjectId: sessionParams.subjectId,
        subjectCode: selectedSubject?.code || '',
        semester: sessionParams.semester,
        section: sessionParams.section,
        isLoaded: true,
      })
    );

    dispatch(
      initializeDraftAttendance({
        students: sessionStudents,
        existingRecords: allRecords,
        date: sessionParams.date,
        subjectId: sessionParams.subjectId,
        subjectCode: selectedSubject?.code || '',
      })
    );
  };

  // Individual status update
  const handleStatusChange = (studentId, status) => {
    dispatch(setStudentStatus({ studentId, status }));
  };

  // Late arrival toggle/edit
  const handleLateChange = (studentId, isLate, lateTime) => {
    dispatch(setStudentLate({ studentId, isLate, lateTime }));
  };

  // Batch mark all
  const handleMarkAllPresent = () => {
    dispatch(markAllPresent());
  };

  const handleMarkAllAbsent = () => {
    dispatch(markAllAbsent());
  };

  const handleResetDraft = () => {
    dispatch(resetDraftChanges());
  };

  // Save attendance batch
  const handleSaveAttendance = async () => {
    const entries = sessionStudents.map((stu) => {
      const draft = draftMap[stu.id] || { status: 'P', isLate: false, lateTime: null };
      return {
        id: `${stu.id}_${sessionParams.subjectId}_${sessionParams.date}`,
        studentId: stu.id,
        studentName: stu.name,
        department: stu.department,
        semester: stu.semester,
        section: stu.section,
        subjectId: sessionParams.subjectId,
        subjectCode: selectedSubject?.code || '',
        subjectName: selectedSubject?.name || '',
        date: sessionParams.date,
        status: draft.status,
        isLate: Boolean(draft.isLate),
        lateTime: draft.isLate ? (draft.lateTime || '09:15 AM') : null,
      };
    });

    await dispatch(saveAttendance(entries)).unwrap();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
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
          Classroom Attendance
        </h1>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            margin: '0.25rem 0 0 0',
          }}
        >
          Select an academic session, mark present/absent/late/official engagement, and save verified attendance records.
        </p>
      </div>

      {/* Attendance Session Configuration Card */}
      <AttendanceSessionSelector
        session={sessionParams}
        subjects={subjects}
        semesters={semesters}
        sections={sections}
        onSessionChange={handleSessionChange}
        onLoadStudents={handleLoadStudents}
        hasExistingRecords={hasExistingRecords}
        loading={isSaving}
      />

      {/* Main Student Attendance Table (when session is active/loaded) */}
      {activeSession.isLoaded ? (
        sessionStudents.length > 0 ? (
          <AttendanceTable
            students={sessionStudents}
            draftMap={draftMap}
            onStatusChange={handleStatusChange}
            onLateChange={handleLateChange}
            onMarkAllPresent={handleMarkAllPresent}
            onMarkAllAbsent={handleMarkAllAbsent}
            onResetDraft={handleResetDraft}
            onSaveAttendance={handleSaveAttendance}
            isSaving={isSaving}
            subjectCode={selectedSubject?.code || ''}
            date={sessionParams.date}
          />
        ) : (
          <Card>
            <div
              style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Users size={48} color="var(--text-muted)" />
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                No Students Registered for this Class Session
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '460px',
                  margin: 0,
                }}
              >
                No active students were found matching Semester {sessionParams.semester}, Section{' '}
                {sessionParams.section}. Please verify the student directory or select another class session.
              </p>
            </div>
          </Card>
        )
      ) : (
        /* Empty Guidance State */
        <Card>
          <div
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarCheck size={32} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                Ready to Record Class Attendance
              </h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Configure the session Date, Subject, Semester, and Section above, then click{' '}
                <strong>Load Class Students</strong> to review or mark classroom attendance.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Attendance Policy Guidelines Card */}
      <Card title="Attendance Calculation Policy" icon={HelpCircle}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Formula & Countable Sessions
            </div>
            <div>
              <code>Countable Sessions = Present (P) + Absent (A)</code>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <code>Attendance % = (Present / Countable Sessions) × 100</code>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Special Exclusions (PL & E)
            </div>
            <div>
              <strong>Internship Placed (PL)</strong> and <strong>Official Engagement (E)</strong> are
              strictly excluded from both numerator and denominator so students are not penalized.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Late Arrival Rule
            </div>
            <div>
              Late arrival is tracked as an attribute of <strong>Present</strong> and counts towards
              attendance percentage as Present.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendancePage;
