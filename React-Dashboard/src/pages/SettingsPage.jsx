import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import {
  Save,
  RotateCcw,
  Store,
  BellRing,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { useOrderFilters } from '../context/FilterContext';

export const SettingsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { mode, toggleTheme } = useAppTheme();
  const { resetFilters } = useOrderFilters();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings state
  const [storeName, setStoreName] = useState('Orderly Flagship Store');
  const [currency, setCurrency] = useState('USD ($)');
  const [supportEmail, setSupportEmail] = useState('support@orderly-store.io');
  const [taxRate, setTaxRate] = useState('8.0');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="fade-in">
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Store Settings
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your dashboard configuration, notification triggers, and store preferences.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert icon={<CheckCircle2 size={18} />} severity="success" sx={{ borderRadius: 2 }}>
          Settings successfully saved and synchronized!
        </Alert>
      )}

      {/* 1. General Store Profile */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Store size={20} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            General Store Details
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Configure standard business information displayed across reports and invoices.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          <TextField
            label="Store Business Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Customer Support Email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            select
            label="Operating Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="USD ($)">USD ($) - US Dollar</MenuItem>
            <MenuItem value="EUR (€)">EUR (€) - Euro</MenuItem>
            <MenuItem value="GBP (£)">GBP (£) - British Pound</MenuItem>
            <MenuItem value="CAD ($)">CAD ($) - Canadian Dollar</MenuItem>
          </TextField>

          <TextField
            label="Default Sales Tax (%)"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      </Card>

      {/* 2. Notification Preferences */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <BellRing size={20} color="#10b981" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notification Channels & Rules
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Select which events trigger alerts in your top navigation menu and dashboard inbox.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  High-Value Order Alerts
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Send immediate notifications when orders over $250 are placed.
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={lowStockAlerts}
                onChange={(e) => setLowStockAlerts(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Low Inventory Warnings
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Alert team when product stock drops below threshold units.
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Daily Analytics Summary
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Deliver daily evening digest of total revenue and order fulfilment.
                </Typography>
              </Box>
            }
          />
        </Box>
      </Card>

      {/* 3. Appearance */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Palette size={20} color="#0ea5e9" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Appearance & Visual Theme
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Customize your interface color palette. Current mode: <strong>{mode.toUpperCase()}</strong>.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant={mode === 'light' ? 'contained' : 'outlined'}
            onClick={() => {
              if (mode !== 'light') toggleTheme();
            }}
          >
            Light Theme
          </Button>

          <Button
            variant={mode === 'dark' ? 'contained' : 'outlined'}
            onClick={() => {
              if (mode !== 'dark') toggleTheme();
            }}
          >
            Dark Theme
          </Button>
        </Box>
      </Card>

      {/* Save Button Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RotateCcw size={15} />}
          onClick={resetFilters}
        >
          Reset Store Filters
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save size={15} />}
          onClick={handleSave}
          sx={{ px: 3 }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;

