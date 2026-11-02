import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Attendify - Professional Academic Subjects Table
 */
export const SubjectTable = ({
  subjects = [],
  onEditSubject,
  onDeleteSubject,
  filters = {},
}) => {
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      if (filters.search) {
        const q = filters.search.trim().toLowerCase();
        const codeMatch = sub.code.toLowerCase().includes(q);
        const nameMatch = sub.name.toLowerCase().includes(q);
        if (!codeMatch && !nameMatch) return false;
      }
      if (filters.department && sub.department !== filters.department) {
        return false;
      }
      if (filters.semester && String(sub.semester) !== String(filters.semester)) {
        return false;
      }
      if (filters.section && sub.section !== filters.section) {
        return false;
      }
      return true;
    });
  }, [subjects, filters]);

  const sortedSubjects = useMemo(() => {
    const list = [...filteredSubjects];
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
  }, [filteredSubjects, sortField, sortDirection]);

  return (
    <div>
      {/* Subjects Table */}
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
                  onClick={() => handleSort('code')}
                  style={{ padding: '0.9rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Code <ArrowUpDown size={13} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  style={{ padding: '0.9rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Subject Title <ArrowUpDown size={13} />
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
                  Semester / Section
                </th>
                <th style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                  Credits
                </th>
                <th style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                  Instructor
                </th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No subjects match your filter selections.
                  </td>
                </tr>
              ) : (
                sortedSubjects.map((sub) => (
                  <tr
                    key={sub.id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {sub.code}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sub.name}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      {sub.department}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      Sem {sub.semester} - Sec {sub.section}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      {sub.creditUnits} Credits
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {sub.instructor || 'Staff Assigned'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEditSubject(sub)}
                          title="Edit Subject"
                          aria-label={`Edit ${sub.code}`}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteSubject(sub)}
                          title="Delete Subject"
                          aria-label={`Delete ${sub.code}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectTable;
