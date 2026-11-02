import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sliders,
  AlertTriangle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  setThreshold,
  updatePreferences,
} from '../features/preferences/preferencesSlice';
import { selectStudentsBelowThreshold } from '../selectors/attendanceSelectors';

/**
 * Attendify - Professional Academic System Settings Page
 */
export const SettingsPage = () => {
  const dispatch = useDispatch();

  const preferences = useSelector((state) => state.preferences);
  const lowAttendanceStudents = useSelector(selectStudentsBelowThreshold);

  const [thresholdInput, setThresholdInput] = useState(preferences.threshold || 45);
  const [institutionInput, setInstitutionInput] = useState(
    preferences.institutionName || 'Attendify Institute of Technology'
  );
  const [termInput, setTermInput] = useState(preferences.academicTerm || 'Fall Semester 2026');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
          Configure institutional rules and attendance compliance thresholds.
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

      {/* Settings Grid */}
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

        {/* 2. Institutional Settings */}
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
      </div>
    </div>
  );
};

export default SettingsPage;
