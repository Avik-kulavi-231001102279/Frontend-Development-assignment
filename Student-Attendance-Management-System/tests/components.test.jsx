import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../src/components/common/Badge';
import { StatsCard } from '../src/components/common/StatsCard';
import { ConfirmationModal } from '../src/components/common/ConfirmationModal';
import { AttendanceStatusButton } from '../src/components/attendance/AttendanceStatusButton';
import { sanitizeCsvCell, exportAttendanceToCsv } from '../src/utils/csvExport';

describe('UI Components & Helper Tests', () => {
  describe('Status Badge Component', () => {
    it('renders correct labels for all attendance codes', () => {
      const { rerender } = render(<Badge status="P" />);
      expect(screen.getByText('Present')).toBeInTheDocument();

      rerender(<Badge status="A" />);
      expect(screen.getByText('Absent')).toBeInTheDocument();

      rerender(<Badge status="PL" />);
      expect(screen.getByText('Internship Placed')).toBeInTheDocument();

      rerender(<Badge status="E" />);
      expect(screen.getByText('Official Engagement')).toBeInTheDocument();

      rerender(<Badge status="Active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();

      rerender(<Badge status="Inactive" />);
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  describe('StatsCard Component', () => {
    it('renders title, value, and subtext accurately', () => {
      render(
        <StatsCard
          title="Total Enrolled"
          value="42 Students"
          subtext="+5 new this semester"
          variant="primary"
        />
      );

      expect(screen.getByText('Total Enrolled')).toBeInTheDocument();
      expect(screen.getByText('42 Students')).toBeInTheDocument();
      expect(screen.getByText('+5 new this semester')).toBeInTheDocument();
    });
  });

  describe('ConfirmationModal Component', () => {
    it('renders modal content and triggers onConfirm and onClose callbacks', () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Confirmation"
          message="Are you sure you want to delete this record?"
          confirmText="Yes, Delete"
          cancelText="No, Keep"
          variant="danger"
          onConfirm={onConfirm}
          onClose={onClose}
        />
      );

      expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this record?')).toBeInTheDocument();

      // Click Confirm
      fireEvent.click(screen.getByText('Yes, Delete'));
      expect(onConfirm).toHaveBeenCalledTimes(1);

      // Click Cancel
      fireEvent.click(screen.getByText('No, Keep'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('returns null when isOpen is false', () => {
      const { container } = render(
        <ConfirmationModal
          isOpen={false}
          title="Hidden Modal"
          message="Hidden"
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('AttendanceStatusButton Component', () => {
    it('renders 4 status options (P, A, PL, E) and notifies on selection', () => {
      const onChange = vi.fn();

      render(<AttendanceStatusButton currentStatus="P" onChange={onChange} />);

      // Verify buttons exist
      const presentBtn = screen.getByTitle(/Present/i);
      const absentBtn = screen.getByTitle(/Absent/i);
      const plBtn = screen.getByTitle(/Placement/i);
      const eBtn = screen.getByTitle(/Engagement/i);

      expect(presentBtn).toBeInTheDocument();
      expect(absentBtn).toBeInTheDocument();
      expect(plBtn).toBeInTheDocument();
      expect(eBtn).toBeInTheDocument();

      // Click Absent button
      fireEvent.click(absentBtn);
      expect(onChange).toHaveBeenCalledWith('A');

      // Click Internship Placed
      fireEvent.click(plBtn);
      expect(onChange).toHaveBeenCalledWith('PL');
    });
  });

  describe('CSV Export Sanitization & Injection Protection', () => {
    it('protects against formula injection characters (=, +, -, @)', () => {
      expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe(`'=SUM(A1:A10)`);
      expect(sanitizeCsvCell('+12345')).toBe(`'+12345`);
      expect(sanitizeCsvCell('-54321')).toBe(`'-54321`);
      expect(sanitizeCsvCell('@ATTACK')).toBe(`'@ATTACK`);
    });

    it('complies with RFC 4180 escaping by doubling internal quotes and enclosing commas', () => {
      expect(sanitizeCsvCell('John, Jr.')).toBe('"John, Jr."');
      expect(sanitizeCsvCell('Said "Hello"')).toBe('"Said ""Hello"""');
    });

    it('creates Blob and triggers browser download URL safely', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const records = [
        {
          studentId: 'STU001',
          studentName: 'Alice Adams',
          department: 'Computer Science',
          semester: 4,
          section: 'A',
          subjectCode: 'CS301',
          subjectName: 'Data Structures',
          date: '2026-11-01',
          status: 'P',
          isLate: false,
          percentageFormatted: '85.0%',
        },
      ];

      expect(() => exportAttendanceToCsv(records, 'test.csv')).not.toThrow();
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();
    });
  });
});
