import React from 'react';

/**
 * Attendify - Professional 4-Way Attendance Status Control
 * Statuses: P (Present), A (Absent), PL (Internship Placed), E (Official Engagement)
 */
export const AttendanceStatusButton = ({ currentStatus, onStatusChange, onChange, disabled = false }) => {
  const handleStatusChange = onStatusChange || onChange;
  const options = [
    {
      code: 'P',
      label: 'Present',
      short: 'P',
      activeBg: '#10B981',
      activeColor: '#FFFFFF',
      hoverBorder: '#10B981',
      tooltip: 'Student attended class',
    },
    {
      code: 'A',
      label: 'Absent',
      short: 'A',
      activeBg: '#EF4444',
      activeColor: '#FFFFFF',
      hoverBorder: '#EF4444',
      tooltip: 'Student did not attend',
    },
    {
      code: 'PL',
      label: 'Placement',
      short: 'PL',
      activeBg: '#F59E0B',
      activeColor: '#FFFFFF',
      hoverBorder: '#F59E0B',
      tooltip: 'Approved internship placement (Excluded from percentage)',
    },
    {
      code: 'E',
      label: 'Engagement',
      short: 'E',
      activeBg: '#3B82F6',
      activeColor: '#FFFFFF',
      hoverBorder: '#3B82F6',
      tooltip: 'Authorized institutional engagement (Excluded from percentage)',
    },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-hover)',
        border: '1px solid var(--border-light)',
        padding: '2px',
        gap: '2px',
      }}
      role="group"
      aria-label="Attendance status options"
    >
      {options.map((opt) => {
        const isSelected = currentStatus === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            disabled={disabled}
            onClick={() => handleStatusChange && handleStatusChange(opt.code)}
            title={`${opt.label}: ${opt.tooltip}`}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: isSelected ? opt.activeBg : 'transparent',
              color: isSelected ? opt.activeColor : 'var(--text-secondary)',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
              minWidth: '34px',
            }}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
};

export default AttendanceStatusButton;
