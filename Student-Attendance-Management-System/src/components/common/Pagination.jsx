import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

/**
 * Attendify - Reusable Table Pagination Bar Component
 */
export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalItems <= pageSize) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0 0 0',
        borderTop: '1px solid var(--border-light)',
        marginTop: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        Showing {startRecord} to {endRecord} of {totalItems} records
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          variant="outline"
          size="sm"
          icon={ChevronLeft}
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Previous
        </Button>

        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            padding: '0 0.5rem',
          }}
        >
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          icon={ChevronRight}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
