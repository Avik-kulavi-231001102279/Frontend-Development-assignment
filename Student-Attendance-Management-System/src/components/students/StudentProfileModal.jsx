import React from 'react';
import {
  X,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StatsCard } from '../common/StatsCard';
import { formatDate } from '../../utils/dateUtils';

/**
 * Attendify - Comprehensive Student Attendance Profile Modal
 */
export const StudentProfileModal = ({ profile, isOpen, onClose }) => {
  if (!isOpen || !profile) return null;

  const { student, overallStats, subjectBreakdown, history } = profile;
  const isLow = overallStats.isLowAttendance;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero */}
        <div
          style={{
            padding: '1.75rem 2rem',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                border: '2px solid #3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {student.name}
                </h2>
                <Badge status={student.status} size="sm" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.85rem',
                  color: '#94A3B8',
                  marginTop: '0.35rem',
                  flexWrap: 'wrap',
                }}
              >
                <span>ID: {student.id}</span>
                <span>•</span>
                <span>{student.department}</span>
                <span>•</span>
                <span>Sem {student.semester} (Sec {student.section})</span>
                <span>•</span>
                <span>{student.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              display: 'flex',
            }}
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          {/* Key Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                OVERALL ATTENDANCE
              </div>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: isLow ? '#EF4444' : '#10B981',
                  marginTop: '0.25rem',
                }}
              >
                {overallStats.formattedPercentage}
              </div>
              {isLow && (
                <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700, marginTop: '2px' }}>
                  Below {overallStats.threshold}% Threshold
                </div>
              )}
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                TOTAL SESSIONS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {overallStats.totalSessions}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Countable: {overallStats.countableSessions}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                PRESENT (P)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
                {overallStats.present}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ABSENT (A)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EF4444', marginTop: '0.25rem' }}>
                {overallStats.absent}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                PLACEMENT (PL)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.25rem' }}>
                {overallStats.pl}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ENGAGEMENT (E)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3B82F6', marginTop: '0.25rem' }}>
                {overallStats.e}
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                LATE ARRIVALS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706', marginTop: '0.25rem' }}>
                {overallStats.late}
              </div>
            </div>
          </div>

          {/* Subject-wise Attendance Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.85rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <BookOpen size={18} color="var(--brand-primary)" /> Subject-wise Performance
            </h4>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Subject</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Present</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Absent</th>
                    <th style={{ padding: '0.75rem 1rem' }}>PL / E</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No subject attendance recorded yet.
                      </td>
                    </tr>
                  ) : (
                    subjectBreakdown.map((sub) => {
                      const subLow = sub.isLowAttendance;
                      return (
                        <tr key={sub.subjectId} style={{ borderTop: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                            {sub.subjectCode} - {sub.subjectName}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>{sub.totalSessions}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#10B981', fontWeight: 600 }}>{sub.present}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#EF4444', fontWeight: 600 }}>{sub.absent}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{sub.pl} PL / {sub.e} E</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: subLow ? '#EF4444' : '#10B981' }}>
                            {sub.formattedPercentage}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Attendance History */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.85rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Calendar size={18} color="var(--brand-primary)" /> Daily Attendance History
            </h4>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                maxHeight: '260px',
                overflowY: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Subject</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Arrival Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No session records available.
                      </td>
                    </tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 500 }}>{formatDate(h.date)}</td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{h.subjectCode}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <Badge status={h.status} isLate={h.isLate} lateTime={h.lateTime} size="sm" />
                        </td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>
                          {h.isLate && h.lateTime ? (
                            <span style={{ color: '#D97706', fontWeight: 600 }}>{h.lateTime}</span>
                          ) : (
                            'On Time'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
