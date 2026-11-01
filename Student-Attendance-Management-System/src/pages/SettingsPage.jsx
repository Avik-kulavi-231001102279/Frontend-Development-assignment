import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Settings,
  Sliders,
  Sun,
  Moon,
  Database,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
  HardDrive,
  Info,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  setTheme,
  setThreshold,
  updatePreferences,
} from '../features/preferences/preferencesSlice';
import { resetStore } from '../app/store';
import { getStorageDiagnostics } from '../utils/storage';
import { selectStudentsBelowThreshold } from '../selectors/attendanceSelectors';

/**
 * Attendify - Professional Academic System Settings Page
 */
export const SettingsPage = () => {
  const dispatch = useDispatch();

  const preferences = useSelector((state) => state.preferences);
  const students = useSelector((state) => state.students.items || []);
  const subjects = useSelector((state) => state.subjects.items || []);
  const attendance = useSelector((state) => state.attendance.records || []);
  const lowAttendanceStudents = useSelector(selectStudentsBelowThreshold);

  const [thresholdInput, setThresholdInput] = useState(preferences.threshold || 45);
  const [institutionInput, setInstitutionInput] = useState(
    preferences.institutionName || 'Attendify Institute of Technology'
  );
  const [termInput, setTermInput] = useState(preferences.academicTerm || 'Fall Semester 2026');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState(getStorageDiagnostics());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync diagnostic info on mount and state changes
  useEffect(() => {
    setStorageInfo(getStorageDiagnostics());
  }, [students, subjects, attendance, preferences]);

  // Handle threshold change
  const handleThresholdSave = (newVal) => {
    const val = Number(newVal);
    if (!isNaN(val) && val >= 10 && val <= 100) {
      dispatch(setThreshold(val));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Handle institutional info save
  const handleSaveInstitutionalInfo = (e) => {
    e.preventDefault();
    dispatch(
      updatePreferences({
        institutionName: institutionInput,
        academicTerm: termInput,
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Reset to Demo Data
  const handleConfirmReset = () => {
    resetStore();
    setResetModalOpen(false);
    setStorageInfo(getStorageDiagnostics());
    setThresholdInput(45);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
          System Settings & Preferences
        </h1>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            margin: '0.25rem 0 0 0',
          }}
        >
          Configure institutional rules, attendance compliance thresholds, theme styles, and local persistence.
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Configuration saved and immediately synchronized with local persistence.</span>
        </div>
      )}

      {/* Grid: Attendance Policy & Appearance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* 1. Attendance Configuration */}
        <Card title="Attendance Policy & Thresholds" icon={Sliders}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Specify the minimum required attendance percentage. Students falling below this threshold
              are automatically flagged across executive dashboards and alerts.
            </p>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Minimum Attendance Threshold
                </label>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: thresholdInput < 50 ? '#EF4444' : 'var(--brand-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {thresholdInput}%
                </span>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="20"
                max="85"
                step="5"
                value={thresholdInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setThresholdInput(val);
                  handleThresholdSave(val);
                }}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: 'var(--brand-primary)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem',
                }}
              >
                <span>20% (Lenient)</span>
                <span>45% (Default)</span>
                <span>75% (Strict)</span>
                <span>85% (Rigorous)</span>
              </div>
            </div>

            {/* Live Impact Preview */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={20} color="#D97706" />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Currently <strong>{lowAttendanceStudents.length} students</strong> are below{' '}
                <strong>{preferences.threshold}%</strong> attendance based on countable sessions.
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Visual Theme & Appearance */}
        <Card title="Interface Theme" icon={Sun}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Choose your preferred visual presentation. Theme preferences are persisted in browser
              storage and synced across sessions.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {/* Light Theme Card */}
              <div
                onClick={() => dispatch(setTheme('light'))}
                style={{
                  border: `2px solid ${
                    preferences.theme === 'light' ? 'var(--brand-primary)' : 'var(--border-light)'
                  }`,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: preferences.theme === 'light' ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                  }}
                >
                  <Sun size={22} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Light Mode</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
                  Crisp daylight academic styling
                </div>
              </div>

              {/* Dark Theme Card */}
              <div
                onClick={() => dispatch(setTheme('dark'))}
                style={{
                  border: `2px solid ${
                    preferences.theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-light)'
                  }`,
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: preferences.theme === 'dark' ? '0 0 0 3px rgba(37, 99, 235, 0.25)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FBBF24',
                  }}
                >
                  <Moon size={22} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dark Mode</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center' }}>
                  Deep navy high-contrast layout
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Institutional Identity & Local Storage Management */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* 3. Institutional Settings */}
        <Card title="Institutional Profile" icon={Building}>
          <form onSubmit={handleSaveInstitutionalInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                University / Institution Name
              </label>
              <input
                type="text"
                value={institutionInput}
                onChange={(e) => setInstitutionInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Academic Term / Session
              </label>
              <input
                type="text"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                }}
                required
              />
            </div>

            <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
              Save Institutional Info
            </Button>
          </form>
        </Card>

        {/* 4. LocalStorage Diagnostics & Reset */}
        <Card title="Client-Side Storage Management" icon={Database}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Attendify operates strictly client-side. All student entities, courses, and attendance logs
              are saved in your browser's LocalStorage engine.
            </p>

            {/* Storage Diagnostic Metrics */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Storage Key:</span>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {storageInfo.storageKey || 'attendify_state_v1'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Storage Used:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {storageInfo.usedKb} KB ({storageInfo.usedBytes} bytes)
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Student Entities:</span>
                <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {students.length} Records
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Attendance Records:</span>
                <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {attendance.length} Sessions
                </div>
              </div>
            </div>

            {/* Reset Action */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-light)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Restore Seed Demo Data
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Replaces current storage with the initial academic seed dataset.
                </div>
              </div>

              <Button
                variant="danger"
                icon={RotateCcw}
                onClick={() => setResetModalOpen(true)}
              >
                Reset Demo Data
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset Application Data to Demo State?"
        message="This action will replace all currently saved students, courses, and attendance records with the original academic seed dataset. This cannot be undone."
        confirmText="Confirm Reset"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmReset}
        onClose={() => setResetModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
