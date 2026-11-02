import React, { useState, useMemo, useEffect } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

/**
 * Attendify - Professional Student Directory Table
 */
export const StudentTable = ({
  students = [],
  studentStatsMap = {},
  onViewProfile,
  onEditStudent,
  onDeleteStudent,
  onToggleStatus,
}) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    const list = [...students];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [students, sortField, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* Students Data Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-hover)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th
                  onClick={() => handleSort('id')}
                  style={{ padding: '0.9rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Student ID <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  style={{ padding: '0.9rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Full Name <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  style={{ padding: '0.9rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Department <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                  Class
                </th>
                <th style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                  Attendance %
                </th>
                <th style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                  Status
                </th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const stats = studentStatsMap[student.id];
                  const hasStats = stats && stats.countableSessions > 0;
                  const percentage = hasStats ? stats.percentage : null;
                  const isLow = stats?.isLowAttendance;

                  return (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {student.id}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        {student.department}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        Sem {student.semester} - Sec {student.section}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {percentage !== null ? (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              color: isLow ? '#EF4444' : '#10B981',
                              backgroundColor: isLow ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: `1px solid ${isLow ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>
                            N/A
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge status={student.status} size="sm" />
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewProfile(student.id)}
                            title="View Student Profile"
                            aria-label={`View profile for ${student.name}`}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEditStudent(student)}
                            title="Edit Student"
                            aria-label={`Edit ${student.name}`}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onToggleStatus(student)}
                            title={student.status === 'Active' ? 'Deactivate' : 'Activate'}
                            aria-label={`Toggle status for ${student.name}`}
                          >
                            {student.status === 'Active' ? (
                              <XCircle size={14} color="#EF4444" />
                            ) : (
                              <CheckCircle size={14} color="#10B981" />
                            )}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDeleteStudent(student)}
                            title="Delete Student Record"
                            aria-label={`Delete ${student.name}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Showing{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {sortedStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {Math.min(currentPage * pageSize, sortedStudents.length)}
            </strong>{' '}
            of <strong style={{ color: 'var(--text-primary)' }}>{sortedStudents.length}</strong> students
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              icon={ChevronLeft}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span style={{ padding: '0 0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              icon={ChevronRight}
              iconPosition="right"
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
