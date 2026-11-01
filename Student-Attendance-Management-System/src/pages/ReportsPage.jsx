import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileSpreadsheet,
  Download,
  Filter,
  RefreshCw,
  Calendar,
  Users,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Percent,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatDate, getTodayDateString } from '../utils/dateUtils';
import { exportAttendanceToCsv } from '../utils/csvExport';

import {
  setSearchFilter,
  setDepartmentFilter,
  setSemesterFilter,
  setSectionFilter,
  setStatusFilter,
  setDateRangeFilter,
  setStudentIdFilter,
  setSubjectCodeFilter,
  resetFilters,
} from '../features/filters/filtersSlice';

import {
  selectFilteredReportRecords,
  selectFilteredReportSummary,
} from '../selectors/reportSelectors';
import {
  selectAllStudents,
  selectUniqueDepartments,
  selectUniqueSemesters,
  selectUniqueSections,
} from '../selectors/studentSelectors';

/**
 * Attendify - Professional Attendance Reports & Analytics Export Page
 */
export const ReportsPage = () => {
  const dispatch = useDispatch();

  const records = useSelector(selectFilteredReportRecords);
  const summary = useSelector(selectFilteredReportSummary);
  const allStudents = useSelector(selectAllStudents);
  const subjects = useSelector((state) => state.subjects.items || []);
  const departments = useSelector(selectUniqueDepartments);
  const semesters = useSelector(selectUniqueSemesters);
  const sections = useSelector(selectUniqueSections);
  const filters = useSelector((state) => state.filters);

  // Table pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const pageSize = 10;

  // Active Report Type Preset tab
  const [reportType, setReportType] = useState('all');

  const handleSelectReportType = (type) => {
    setReportType(type);
    const today = getTodayDateString();

    if (type === 'daily') {
      dispatch(setDateRangeFilter({ startDate: today, endDate: today }));
    } else if (type === 'monthly') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      dispatch(setDateRangeFilter({ startDate: firstDay, endDate: today }));
    } else if (type === 'all') {
      dispatch(setDateRangeFilter({ startDate: '', endDate: '' }));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    const list = [...records];
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
  }, [records, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    const filename = `Attendify_Report_${filters.startDate || 'all'}_to_${filters.endDate || 'all'}.csv`;
    exportAttendanceToCsv(records, filename);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
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
            Attendance Reports & Audits
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0 0',
            }}
          >
            Generate comprehensive daily, monthly, student-level, or course attendance reports with CSV export.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={Download}
            onClick={handleExportCsv}
            disabled={records.length === 0}
          >
            Export Filtered CSV ({records.length})
          </Button>
        </div>
      </div>

      {/* Preset Report Types Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.5rem',
        }}
      >
        {[
          { id: 'all', label: 'All Records' },
          { id: 'daily', label: 'Daily Report (Today)' },
          { id: 'monthly', label: 'Monthly Overview' },
          { id: 'custom', label: 'Custom Date Range' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelectReportType(tab.id)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: reportType === tab.id ? 700 : 500,
              backgroundColor: reportType === tab.id ? 'var(--brand-primary)' : 'var(--bg-hover)',
              color: reportType === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary KPI Strip for Filtered Set */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Records
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {records.length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>
            Present Count
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>
            {summary.present}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#EF4444', textTransform: 'uppercase' }}>
            Absent Count
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444', marginTop: '0.2rem' }}>
            {summary.absent}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase' }}>
            Internship (PL)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6', marginTop: '0.2rem' }}>
            {summary.internship}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8B5CF6', textTransform: 'uppercase' }}>
            Engagement (E)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8B5CF6', marginTop: '0.2rem' }}>
            {summary.officialEngagement}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase' }}>
            Late Arrivals
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
            {summary.late}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
            Effective Rate
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
            {summary.formattedPercentage}
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filter Controls Card */}
      <Card
        title="Multi-Criteria Filter Parameters"
        icon={Filter}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() => dispatch(resetFilters())}
          >
            Clear All
          </Button>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Student Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Student
            </label>
            <select
              value={filters.studentId || ''}
              onChange={(e) => dispatch(setStudentIdFilter(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            >
              <option value="">All Enrolled Students</option>
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Academic Subject
            </label>
            <select
              value={filters.subjectCode || ''}
              onChange={(e) => dispatch(setSubjectCodeFilter(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            >
              <option value="">All Academic Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Department
            </label>
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
                fontSize: '0.85rem',
              }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Semester
            </label>
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
                fontSize: '0.85rem',
              }}
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Section
            </label>
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
                fontSize: '0.85rem',
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

          {/* Status */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Status
            </label>
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
                fontSize: '0.85rem',
              }}
            >
              <option value="">All Statuses</option>
              <option value="P">Present (P)</option>
              <option value="A">Absent (A)</option>
              <option value="PL">Internship (PL)</option>
              <option value="E">Official Engagement (E)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              From Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) =>
                dispatch(setDateRangeFilter({ startDate: e.target.value, endDate: filters.endDate }))
              }
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              To Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) =>
                dispatch(setDateRangeFilter({ startDate: filters.startDate, endDate: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>
      </Card>

      {/* Records Table */}
      <Card
        title={`Attendance Records (${records.length} Results)`}
        icon={FileSpreadsheet}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', backgroundColor: 'var(--bg-hover)' }}>
                <th
                  onClick={() => handleSort('date')}
                  style={{
                    padding: '0.85rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Date</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('studentId')}
                  style={{
                    padding: '0.85rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Student ID</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('studentName')}
                  style={{
                    padding: '0.85rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Student Name</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Class
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Subject
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Late Arrival
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Cumulative %
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r, idx) => (
                  <tr
                    key={r.id || `${r.studentId}_${r.subjectId}_${r.date}_${idx}`}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {formatDate(r.date)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', fontFamily: 'monospace' }}>
                      {r.studentId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {r.studentName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Sem {r.semester} • Sec {r.section}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.subjectCode}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.subjectName}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge status={r.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                      {r.isLate ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(217, 119, 6, 0.1)',
                            color: '#D97706',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        >
                          <Clock size={12} />
                          {r.lateTime || 'Late'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {r.percentageFormatted || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '3rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No attendance records match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {sortedRecords.length > pageSize && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 0 0 0',
              borderTop: '1px solid var(--border-light)',
              marginTop: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} records
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={ChevronRight}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;
